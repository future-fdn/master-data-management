"use client";
import { getQualityChartData } from "@/components/visualize/alldata";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function QualityChart() {
  const [data, setData] = useState(getQualityChartData());
  const svgRef = useRef(null);

  useEffect(() => {
    if (data.length === 0) return; // Do nothing if data is not yet loaded

    // setting up svg
    const w = 400;
    const h = 200;
    const svg = d3
      .select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .style("overflow", "visible");

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, w]);

    //yscales
    const yScale = d3.scaleLinear().domain([0, 100]).range([h, 0]);

    //  Setup functions to draw Lines ---------------//
    const generateScaledLine = d3
      .line()

      // @ts-expect-error
      .x((d) => xScale(d.date))

      // @ts-expect-error
      .y((d) => yScale(d.value))
      .curve(d3.curveCatmullRom.alpha(0.5));

    // setting the axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(13)
      .tickFormat(d3.timeFormat("%m/%g"));
    const yAxis = d3.axisLeft(yScale).ticks(7);
    svg.append("g").call(xAxis).attr("transform", `translate(0,${h})`);
    svg.append("g").call(yAxis);

    // setting up the data for the svg
    svg
      .append("path")
      .data([data])

      // @ts-expect-error
      .attr("d", generateScaledLine)
      .attr("fill", "none")
      .attr("stroke", "#0086FF")
      .style("stroke-width", "2px");

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

    //add chart label
    svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px");

    // add text next to each circle
    circles.each(function (d) {
      // 'this' refers to the current circle element

      // @ts-expect-error
      d3.select(this.parentNode) // Select the parent of the circle (i.e., the SVG)
        .append("text")
        .text(d3.format(".0f")(d.value) + "%")
        .attr("x", xScale(d.date) + 10)
        .attr("y", yScale(d.value) + 4)
        .attr("font-size", "10px")
        .attr("fill", "#000000");
    });
  }, [data]);
  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
}
