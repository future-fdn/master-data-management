import * as d3 from "d3";
import styles from "./ContextMenu.module.css";

export const menuFactory = (x, y, menuItems, data, svgId) => {
  d3.select(`.${styles.contextMenu}`).remove();

  // Draw the menu
  d3.select(svgId)
    .append("g")
    .attr("class", styles.contextMenu)
    .selectAll("tmp")
    .data(menuItems)
    .enter()
    .append("g")
    .attr("class", styles.menuEntry)
    // @ts-ignore
    .style({ cursor: "pointer" });

  // Draw menu entries
  d3.selectAll(`.${styles.menuEntry}`)
    .append("rect")
    .attr("x", x)
    .attr("y", (d, i) => {
      return y + i * 30;
    })
    .attr("rx", 2)
    .attr("width", 150)
    .attr("height", 30)
    // @ts-ignore
    .on("click", (d, i) => {
      // @ts-ignore
      i.action(data);
    });

  d3.selectAll(`.${styles.menuEntry}`)
    .append("text")
    // @ts-ignore
    .text((d) => {
      // @ts-ignore
      return d.title;
    })
    .attr("x", x)
    .attr("y", (d, i) => {
      return y + i * 30;
    })
    .attr("dy", 20)
    .attr("dx", 45)
    // @ts-ignore
    .on("click", (d, i) => {
      // @ts-ignore
      i.action(data);
    });

  // Other interactions
  d3.select("body").on("click", () => {
    d3.select(`.${styles.contextMenu}`).remove();
  });
};

export const createContextMenu = (d, menuItems, mouseX, mouseY, svgId) => {
  menuFactory(mouseX, mouseY, menuItems, d, svgId);
};
