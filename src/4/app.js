import { sentence } from "./data";

class App {
  constructor() {
    // HTML Element
    this.textBox = document.getElementById("textBox");
    // Settings
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    this.mousePos = { x: 0, y: 0 };
    this.circleSize = 100;
    this.sentenceData = sentence
      .sort((a, b) => Math.random() - 0.5)
      .slice(0, 20);
    // LifeCycle
    this.init();
    this.start();
  }

  init() {
    this.resize();
    this.addEventListener();
  }

  start() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.fillText();
  }

  fillText() {
    this.textBox.innerHTML = "";
    this.sentenceData.forEach((s, idx) => {
      const elm = this.makeText(s);
      elm.classList.add(`color${idx % 5}`);
      this.textBox.appendChild(elm);
    });
  }

  makeText(s) {
    const span = document.createElement("span");
    span.innerText = s;
    span.classList.add("sentence");
    span.style.animationDuration = `${Math.floor(Math.random() * 10) + 2}s`;
    return span;
  }

  animate(t) {
    this.circleSize = 300 + Math.sin(t / 1000) * 300;
    if (this.circleSize < 1) {
      this.sentenceData = sentence
        .sort((a, b) => Math.random() - 0.5)
        .slice(0, 20);
      this.fillText();
    }

    this.draw();

    window.requestAnimationFrame(this.animate.bind(this));
  }

  draw() {
    this.textBox.style.clipPath = `circle(${this.circleSize}px at ${this.mousePos.x}px ${this.mousePos.y}px)`;
  }

  addEventListener() {
    window.addEventListener("resize", this.resize.bind(this), false);
    window.addEventListener("mousemove", this.mouseMove.bind(this), false);
  }

  mouseMove(e) {
    const { clientX, clientY } = e;
    this.mousePos = { x: clientX, y: clientY };
  }

  resize() {}
}

window.onload = () => {
  const app = new App();
};
