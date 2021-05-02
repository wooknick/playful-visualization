import * as d3 from "d3";
import Chart from "./chart";

class App {
  constructor() {
    // DOM
    this.chartCanvas = document.getElementById("chart");
    this.control = document.getElementById("control");
    this.artistSelect = document.getElementById("artistSelect");
    // Data
    this.data = [];
    this.artists = [];
    this.selectedArtist = "";
    // Logic
    this.chart = undefined;
    // Event
    this.resize();
    window.addEventListener("resize", this.resize.bind(this), false);
    this.artistSelect.addEventListener("change", this.handleSelect.bind(this));
  }

  async init() {
    await this.dataFetch();
    this.artists.forEach((artist) => {
      const option = document.createElement("option");
      option.value = artist;
      option.innerHTML = artist;
      this.artistSelect.appendChild(option);
    });

    this.chart = new Chart(this.chartCanvas, this.data);
    this.chart.draw(this.selectedArtist);
  }

  async dataFetch() {
    try {
      this.data = await d3.csv(
        "https://raw.githubusercontent.com/wooknick/playful-visualization/master/data/raw_billboard.csv"
      );
      this.artists = this.data
        .map((item) => item.Main)
        .reduce(
          (unique, cur) => (unique.includes(cur) ? unique : [...unique, cur]),
          []
        );
      this.selectedArtist = this.artists[0];
    } catch (e) {
      console.error(e);
    }
  }

  handleSelect(e) {
    this.selectedArtist = e.target.value;
    this.chart.draw(this.selectedArtist);
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
}

window.onload = () => {
  const app = new App();
  app.init();
};
