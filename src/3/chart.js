import "regenerator-runtime/runtime";
import * as d3 from "d3";
import * as observablehq from "@observablehq/stdlib";

class Chart {
  constructor(canvas, data) {
    // DOM
    this.canvas = canvas;
    this.width = canvas.offsetWidth;
    this.height = canvas.offsetHeight;
    // Data
    this.data = data;
    // Util
    this.DOM = new observablehq.Library().DOM;
  }

  changeData(idx) {
    const newData = this.pack(this.data[idx], "구조인원");
    d3.selectAll("g")
      .data(newData.leaves())
      .join("g")
      .transition()
      .duration(750)
      .attr("transform", (d) => {
        return `translate(${d.x + 1},${d.y + 1})`;
      });

    d3.selectAll("circle")
      .transition()
      .duration(750)
      .attr("id", (d) => (d.leafUid = this.DOM.uid("leaf")).id)
      .attr("r", (d) => d.r)
      .attr("fill-opacity", 0.7)
      .attr("fill", (d) =>
        this.color(
          this.data[idx],
          "구조인원/구조건수"
        )(d.data["구조인원/구조건수"])
      );
  }

  make(data) {
    this.svg = d3
      .create("svg")
      .attr("viewBox", [0, 0, this.width, this.height])
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle");

    this.g = this.svg
      .append("g")
      .attr("transform", `translate(100, 30) scale(${this.width / 100}, 1)`);

    this.g
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 25)
      .attr("width", (d) => Number(d.peakPos))
      .attr("height", 20);

    return this.svg.node();
  }

  async draw(artist) {
    const d = this.data.filter((item) => item.Main === artist);
    console.log(d);
    const c = this.make(d);
    this.canvas.append(c);
  }
}

export default Chart;
