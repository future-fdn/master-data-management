"use client";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function QualityBar(props) {
  const svgRef = useRef(null);
  const [percent, setPercent] = useState(Number(props.Number));

  const data = [{ value: percent }, { value: 100 - Number(percent) }];

  const customColors = ["#56C435", "#e0e0e0"];

  useEffect(() => {
    const width = 200;
    const height = 30;
    const cornerRadius = 15;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create background bar
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("rx", cornerRadius)
      .attr("ry", cornerRadius)
      .attr("fill", "#e0e0e0");

    // Create progress bar
    svg
      .append("rect")
      .attr("width", width * (percent / 100))
      .attr("height", height)
      .attr("rx", cornerRadius)
      .attr("ry", cornerRadius)
      .attr("fill", "#56C435");

    // Add text indicating progress percentage
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "black")
      .text(`${percent}%`);
  }, [data, percent]);

  return <svg ref={svgRef}></svg>;
}
