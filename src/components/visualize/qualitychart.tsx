"use client";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

interface QualityChartProps {
  graphData: any[];
}

const qualitychart = ({ graphData }: QualityChartProps) => {
  const [data, setData] = useState(graphData);
  const svgRef = useRef(null);
  console.log(data);

  useEffect(() => {
    if (data.length === 0) return; // Do nothing if data is not yet loaded

    // setting up svg
    const w = 600;
    const h = 250;
    const svg = d3
      .select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .style("overflow", "visible");
    // .style("background", "#d6f2ff");

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, w]);

    //yscales
    const yScale = d3.scaleLinear().domain([0, 100]).range([h, 0]);

    //  Setup functions to draw Lines ---------------//
    const generateScaledLine = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value));

    // setting the axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(13)
      .tickFormat(d3.timeFormat("%b %Y"));
    const yAxis = d3.axisLeft(yScale).ticks(7);
    svg.append("g").call(xAxis).attr("transform", `translate(0,${h})`);
    svg.append("g").call(yAxis);

    // setting up the data for the svg
    svg
      .append("path")
      .data([data])
      .attr("d", generateScaledLine)
      .attr("fill", "none")
      .attr("stroke", "#0086FF")
      .lower();

    //add circle to data point
    const circles = svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 3) // Set the radius of the circles
      .attr("fill", "#0163FF"); // Set the fill color of the circles

    // add text next to each circle
    circles.each(function (d) {
      // 'this' refers to the current circle element
      const percent = d3
        .select(this.parentNode) // Select the parent of the circle (i.e., the SVG)
        .append("text")
        .text(d3.format(".0f")(d.value) + "%")
        .attr("x", xScale(d.date) + 10)
        .attr("y", yScale(d.value) + 4)
        .attr("font-size", "14px")
        .attr("fill", "#000000")
        .style("opacity", 0);

      var focus = svg
        .append("g")
        .append("circle")
        .style("fill", "none")
        .attr("stroke", "black")
        .attr("r", 8.5)
        .style("opacity", 1)
        .attr("cx", xScale(d.date))
        .attr("cy", yScale(d.value))
        .style("opacity", 0);

      svg
        .append("rect")
        .attr("x", xScale(d.date) - 25)
        .attr("y", 0)
        .attr("width", w / 11)
        .attr("height", h)
        .attr("fill", "#0163FF")
        .style("opacity", 0)
        .on("mouseover", () => {
          percent.style("opacity", 1);
          focus.style("opacity", 1);
        })
        .on("mouseout", () => {
          percent.style("opacity", 0);
          focus.style("opacity", 0);
        });
    });
  }, [data]);
  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default qualitychart;
