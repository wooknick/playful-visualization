import TextRoll from "./textRoll";
import MainImage from "./images/main.png";
import SubImage from "./images/sub.png";

function getDummy() {
  const data = [
    // "Get the Top",
    // "Not Bad",
    // "Garbage",
    // "Wasting Time",
    // "Amazing!!",
    // "The Return of the King",
    "Expected position is No.50",
    "Expected position is No.1",
    "Expected position is No.350",
  ];

  return data[Math.floor(Math.random() * data.length)];
}

const artists = ["dua lipa", "eminem", "bts", "muse", "radiohead", "beatles"];

class App {
  constructor() {
    // HTML Elements
    this.inputLine = document.getElementById("inputLine");
    this.contentLine = document.getElementById("contentLine");
    this.mainInput = document.getElementById("mainInput");
    this.subInput = document.getElementById("subInput");
    this.mainImage = document.getElementById("mainImage");
    this.subImage = document.getElementById("subImage");
    this.beforeResult = document.getElementById("beforeResult");
    this.result = document.getElementById("result");
    // Variables
    this.artists = { mainArtist: "", subArtist: "" };
    this.animating = false;
    this.inputT = undefined;
    this.resizeT = undefined;
    this.size = window.innerWidth / 32;
  }

  init() {
    // TextRoll
    this.textRoll = new TextRoll(result, this.size);
    this.textRoll.setText("Try your Self");

    this.resize();
    // Event handler
    window.addEventListener("resize", this.debouncedResize.bind(this));
    this.mainInput.addEventListener("input", this.handleInput.bind(this));
    this.subInput.addEventListener("input", this.handleInput.bind(this));
  }

  handleInput(e) {
    const { value, name } = e.target;
    this.artists[name] = value;
    this.beforeResult.innerHTML = `<span>${this.artists.mainArtist}</span><span>feat. ${this.artists.subArtist}</span>`;

    if (name === "mainArtist") {
      this.mainImage.style.opacity = 0;
      this.mainImage.ontransitionend = () => {
        this.mainImage.innerHTML = `<image src="${MainImage}"></image>`;
        this.mainImage.style.opacity = 1;
      };
    } else {
      this.subImage.style.opacity = 0;
      this.subImage.ontransitionend = () => {
        this.subImage.innerHTML = `<image src="${SubImage}"></image>`;
        this.subImage.style.opacity = 1;
      };
    }

    if (this.artists.mainArtist !== "" && this.artists.subArtist !== "") {
      if (this.inputT) {
        clearTimeout(this.inputT);
      }
      this.inputT = setTimeout(() => {
        this.animating = true;
        this.mainInput.disabled = true;
        this.subInput.disabled = true;
        this.textRoll.animateTo(getDummy(), 1000);
        setTimeout(() => {
          this.animating = false;
          this.mainInput.disabled = false;
          this.subInput.disabled = false;
        }, 2500);
      }, 1200);
    }
  }

  resize() {
    this.size = window.innerWidth / 32;
    this.inputLine.style.fontSize = this.size + "px";
    this.contentLine.style.fontSize = this.size + "px";
    this.beforeResult.style.fontSize = this.size * 2 + "px";
    this.textRoll.updateSize(this.size);
  }

  debouncedResize() {
    if (this.resizeT) {
      clearTimeout(this.resizeT);
    }
    if (this.animating) {
      this.resizeT = setTimeout(() => {
        this.resize();
      }, 2500 + 500);
    } else {
      this.resizeT = setTimeout(() => {
        this.resize();
      }, 500);
    }
  }
}

window.onload = () => {
  new App().init();
};
