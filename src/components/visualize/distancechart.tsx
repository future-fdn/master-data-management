"use client";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { createContextMenu } from "./contextMenu";

interface DistanceChartProps {
  allLinks: any[];
  allNodes: any[];
}

const DistanceChart = ({ allLinks, allNodes }: DistanceChartProps) => {
  const svgRef = useRef(null);

  //Menu Item
  const menuItems = [
    {
      title: "First action",
      action: (d) => {
        // TODO: add any action you want to perform
        console.log(d);
      },
    },
    {
      title: "Second action",
      action: (d) => {
        // TODO: add any action you want to perform
        console.log(d);
      },
    },
  ];

  // Create copies of the fake data to avoid mutation
  const links = allLinks.map((d) => ({ ...d }));
  const nodes = allNodes.map((d) => ({ ...d }));
  // Specify the dimensions of the chart.
  const width = 500 * 2;
  const height = 350 * 2;

  // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  useEffect(() => {
    // Create a simulation with several forces.
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          // @ts-ignore
          .id((d) => d.id)
          .distance((d) => d.distance + 60),
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    // Create the SVG container.
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;")
      .attr("id", "graphSvg");

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
      .attr("stroke-width", 5)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    // Add labels to each node
    const nodeLabels = svg
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.id)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle");

    // Add a label drag behavior.
    nodeLabels.call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended),
    );

    const node = svg
      .append("g")
      .attr("stroke-width", 5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .on("contextmenu", (event, d) => {
        event.preventDefault();
        const mouseX =
          event.clientX -
          (svg.node().getBoundingClientRect().left +
            svg.node().getBoundingClientRect().width / 2);
        const mouseY =
          event.clientY -
          (svg.node().getBoundingClientRect().top +
            svg.node().getBoundingClientRect().height / 2);
        createContextMenu(d, menuItems, mouseX, mouseY, "#graphSvg");
      })
      .attr("r", 20)
      .attr("stroke", (d) => color(d.group))
      .attr("fill", (d) => d3.interpolateRgb(color(d.group), "white")(0.6));

    // Add a node drag behavior.
    node.call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended),
    );

    // Set the position attributes of links and nodes each time the simulation ticks.
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      nodeLabels.attr("x", (d) => d.x).attr("y", (d) => d.y + 35);
    });

    nodeLabels.raise();

    // Handle mouse over event for links
    function handleMouseOver(event, d) {
      const tooltip = svg.append("g").attr("class", "tooltip");
      const mouseX =
        event.clientX -
        (svg.node().getBoundingClientRect().left +
          svg.node().getBoundingClientRect().width / 2);
      const mouseY =
        event.clientY -
        (svg.node().getBoundingClientRect().top +
          svg.node().getBoundingClientRect().height / 2);

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
        .text(`Distance: ${d.distance}, Partial: ${d.partial}`)
        .attr("x", 5)
        .attr("y", 20);

      tooltip.attr("transform", `translate(${mouseX + 10}, ${mouseY + 10})`);
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
