"use client";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function DonutChart(props) {
  const svgRef = useRef(null);
  const [percent, setPercent] = useState(Number(props.Number));

  const data = [{ value: percent }, { value: 100 - Number(percent) }];

  const customColors = ["#56C435", "#e0e0e0"];

  useEffect(() => {
    const width = 80;
    const height = 80;
    const radius = Math.min(width, height) / 2;

    // Set up the SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Define the color scale
    const color = d3.scaleOrdinal().range(customColors);

    // Define the pie chart layout
    let pie;
    if (data[0].value < data[1].value) {
      pie = d3
        .pie()

        // @ts-expect-error
        .value((d) => d.value)

        // @ts-expect-error
        .sort((a, b) => d3.ascending(a.value, b.value));
    } else {
      // @ts-expect-error
      pie = d3.pie().value((d) => d.value);
    }

    // Generate the arc paths
    const arc = d3
      .arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius - 2);

    // Create the donut chart
    svg
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)

      // @ts-expect-error
      .attr("fill", (_, i) => color(i));

    // Add text in the center
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text(d3.format(".0f")(percent) + "%")
      .style("font-size", "15px"); // Replace with your desired text
  }, [data]);

  return <svg ref={svgRef}></svg>;
}
