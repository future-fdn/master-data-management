"use client";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

const DistanceChart = () => {
  const svgRef = useRef(null);

  // Fake data for links
  const fakeLinks = [
    { source: "กรุงเทพมหานคร", target: "เชียงใหม่", distance: 5, partial: 7 },
    { source: "เชียงใหม่", target: "เชียงราย", distance: 3, partial: 5 },
    { source: "เชียงราย", target: "กรุงเทพมหานคร", distance: 7, partial: 10 },
    { source: "ขอนแก่น", target: "อุบลราชธานี", distance: 10, partial: 3 },
    // Add more fake links as needed
  ];

  // Fake data for nodes
  const fakeNodes = [
    { id: "กรุงเทพมหานคร", group: 1 },
    { id: "เชียงใหม่", group: 2 },
    { id: "เชียงราย", group: 1 },
    { id: "ขอนแก่น", group: 1 },
    { id: "อุบลราชธานี", group: 2 },
    // Add more fake nodes as needed
  ];

  // Create copies of the fake data to avoid mutation
  const links = fakeLinks.map((d) => ({ ...d }));
  const nodes = fakeNodes.map((d) => ({ ...d }));

  // Specify the dimensions of the chart.
  const width = 464;
  const height = 340;

  // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  useEffect(() => {
    // Create a simulation with several forces.
    const simulation = d3
      // @ts-expect-error
      .forceSimulation(nodes)
      .force(
        "link",
        // @ts-expect-error
        d3.forceLink(links).id((d) => d.id),
      )
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    // Create the SVG container.
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Remove any existing links and nodes
    svg.selectAll("line").remove();
    svg.selectAll("circle").remove();

    // Add a line for each link, and a circle for each node.
    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 3)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 5)
      // @ts-expect-error
      .attr("fill", (d) => color(d.group));

    // Add a node drag behavior.
    node.call(
      // @ts-expect-error
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended),
    );

    // Add labels to each node
    const nodeLabels = svg
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.id)
      .attr("fill", "black");

    // Add a label drag behavior.
    nodeLabels.call(
      // @ts-expect-error
      d3

        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended),
    );

    // Set the position attributes of links and nodes each time the simulation ticks.
    simulation.on("tick", () => {
      link
        // @ts-expect-error
        .attr("x1", (d) => d.source.x)
        // @ts-expect-error
        .attr("y1", (d) => d.source.y)
        // @ts-expect-error
        .attr("x2", (d) => d.target.x)
        // @ts-expect-error
        .attr("y2", (d) => d.target.y);
      // @ts-expect-error

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      // @ts-expect-error
      nodeLabels.attr("transform", (d) => `translate(${d.x + 30},${d.y})`);
    });

    // Handle mouse over event for links
    function handleMouseOver(event, d) {
      const tooltip = svg.append("g").attr("class", "tooltip");

      const text = tooltip
        .append("text")
        .text(`Partial: ${d.partial}, Distance: ${d.distance}`)
        .attr("x", 5)
        .attr("y", 20);

      const bbox = text.node().getBBox();

      tooltip
        .append("rect")
        .attr("x", bbox.x - 5)
        .attr("y", bbox.y - 5)
        .attr("width", bbox.width + 10)
        .attr("height", bbox.height + 10)
        .attr("fill", "white")
        .attr("stroke", "black");

      tooltip
        .append("text")
        .text(`Partial: ${d.partial}, Distance: ${d.distance}`)
        .attr("x", 5)
        .attr("y", 20);
    }

    // Handle mouse out event for links
    function handleMouseOut() {
      // Remove tooltip
      svg.select(".tooltip").remove();
    }

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Clean up the simulation on unmount
    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DistanceChart;
