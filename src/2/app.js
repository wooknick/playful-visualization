import "regenerator-runtime/runtime";
import axios from "axios";
import TextRoll from "./textRoll";
import MainImage from "./images/main.png";
import SubImage from "./images/sub.png";

class App {
  constructor() {
    // HTML Elements
    this.mainArtistList = document.getElementById("mainArtistList");
    this.subArtistList = document.getElementById("subArtistList");
    this.searchList = undefined;
    this.inputLine = document.getElementById("inputLine");
    this.contentLine = document.getElementById("contentLine");
    this.mainInput = document.getElementById("mainInput");
    this.subInput = document.getElementById("subInput");
    this.mainImage = document.getElementById("mainImage");
    this.subImage = document.getElementById("subImage");
    this.beforeResult = document.getElementById("beforeResult");
    this.result = document.getElementById("result");
    // Variables
    this.artists = { mainArtist: "", subArtist: "", mainIdx: -1, subIdx: -1 };
    this.artistType = undefined;
    this.animating = false;
    this.inputT = undefined;
    this.resizeT = undefined;
    this.searchT = undefined;
    this.blurT = undefined;
    this.size = window.innerWidth / 32;
    // Data
    this.artistsData = undefined;
    this.score = undefined;
  }

  async init() {
    // TextRoll
    this.textRoll = new TextRoll(result, this.size);
    this.textRoll.setText("Try your Self");

    try {
      const {
        data: { artists },
      } = await axios.get(
        "https://raw.githubusercontent.com/wooknick/playful-visualization/master/src/2/artists.json"
      );
      this.artistsData = artists;
      const {
        data: { score },
      } = await axios.get(
        "https://raw.githubusercontent.com/wooknick/playful-visualization/master/src/2/billboard.json"
      );
      this.score = score;
    } catch (e) {
      console.error("data fetch error");
    }

    this.resize();
    // Event handler
    window.addEventListener("resize", this.debouncedResize.bind(this));
    this.mainInput.addEventListener("input", this.handleInput.bind(this));
    this.mainInput.addEventListener("focus", (e) => {
      e.target.placeholder = "";
      this.handleInput(e);
    });
    this.mainInput.addEventListener("blur", (e) => {
      e.target.placeholder = "Main Artist";
      this.blurT = setTimeout(this.handleInputBlur.bind(this), 200);
    });
    this.subInput.addEventListener("input", this.handleInput.bind(this));
    this.subInput.addEventListener("focus", (e) => {
      e.target.placeholder = "";
      this.handleInput(e);
    });
    this.subInput.addEventListener("blur", (e) => {
      e.target.placeholder = "Sub Artist";
      this.blurT = setTimeout(this.handleInputBlur.bind(this), 200);
    });
  }

  handleInput(e) {
    const { name, value } = e.target;
    this.artists[name] = value;
    this.artistType = name;
    this.handleArtistList(value);
  }

  handleArtistList(value) {
    let refElement, targetElement, notTargetElement;
    if (this.artistType === "mainArtist") {
      refElement = this.mainInput.parentElement;
      targetElement = this.mainArtistList;
      notTargetElement = this.subArtistList;
    } else {
      refElement = this.subInput.parentElement;
      targetElement = this.subArtistList;
      notTargetElement = this.mainArtistList;
    }
    this.searchList = targetElement;
    // targetElement.onclick = () => {
    //   targetElement.style.display = "none";
    // };
    const { width, height, left, top } = refElement.getBoundingClientRect();
    notTargetElement.style.display = "none";
    targetElement.style = `
      left: ${left}px;
      top: ${top + height + 10}px;
      width: ${width}px;
      height: ${this.size * 3}px;
      opacity: 1;
    `;
    this.searchArtist(value);
  }

  searchArtist(term) {
    if (this.searchT) {
      clearTimeout(this.searchT);
    }
    this.searchT = setTimeout(() => {
      const searchResult = this.artistsData.filter((artist) => {
        return artist[1].search(RegExp(term, "i")) > -1;
      });
      let topTen;
      if (term === "") {
        topTen = searchResult
          .sort((x, y) => {
            return Math.random() - 0.5;
          })
          .slice(0, 10);
      } else {
        topTen = searchResult.slice(0, 10);
      }
      this.searchList.innerHTML = "";
      if (topTen.length === 0) {
        this.searchList.innerHTML = `
        <div class="searchResultItem">No Result</div>
        `;
      } else {
        topTen.forEach((item) => {
          const searchResultItem = document.createElement("div");
          searchResultItem.className = "searchResultItem";
          searchResultItem.onclick = this.handleClickSearchResult.bind(this);
          searchResultItem.innerText = item[1];
          searchResultItem.dataset.artist = item[1];
          searchResultItem.dataset.artistIdx = item[0];
          this.searchList.appendChild(searchResultItem);
        });
      }
    }, 400);
  }

  handleClickSearchResult(e) {
    if (this.blurT) {
      clearTimeout(this.blurT);
    }
    const newValue = e.target.dataset.artist;
    const artistIdx = e.target.dataset.artistIdx;
    let targetInput;
    if (this.artistType === "mainArtist") {
      targetInput = this.mainInput;
      this.artists.mainArtist = newValue;
      this.artists.mainIdx = artistIdx;
    } else {
      targetInput = this.subInput;
      this.artists.subArtist = newValue;
      this.artists.subIdx = artistIdx;
    }
    targetInput.value = newValue;
    this.searchList.innerHTML = "";
    this.searchList.style.display = "none";
    this.showSelectedArtistImage();
  }

  handleInputBlur() {
    this.searchList.innerHTML = "";
    this.searchList.style.display = "none";
    let nowInput;
    if (this.artistType === "mainArtist") {
      nowInput = this.mainInput;
    } else {
      nowInput = this.subInput;
    }
    if (!this.artistsData.some((artist) => artist[1] === nowInput.value)) {
      this.artists[this.artistType] = "";
      nowInput.value = "";
    }
    this.showSelectedArtistImage();
  }

  showSelectedArtistImage() {
    if (this.artistType === "mainArtist") {
      this.mainImage.style.opacity = 0;
      this.mainImage.ontransitionend = () => {
        if (this.artists.mainArtist !== "") {
          this.mainImage.innerHTML = `<image src="${MainImage}"></image>`;
        } else {
          this.mainImage.innerHTML = ``;
        }
        this.mainImage.style.opacity = 1;
        this.mainImage.ontransitionend = "";
      };
    } else {
      this.subImage.style.opacity = 0;
      this.subImage.ontransitionend = () => {
        if (this.artists.subArtist !== "") {
          this.subImage.innerHTML = `<image src="${SubImage}"></image>`;
        } else {
          this.subImage.innerHTML = ``;
        }
        this.subImage.style.opacity = 1;
        this.subImage.ontransitionend = "";
      };
    }

    this.showSelectedArtistName();
  }

  showSelectedArtistName() {
    if (this.artists.mainArtist !== "" && this.artists.subArtist !== "") {
      this.beforeResult.innerHTML = `<span>${this.artists.mainArtist}</span><span>feat. ${this.artists.subArtist}</span>`;
      this.predict();
    } else {
      this.beforeResult.innerHTML = ``;
    }
  }

  predict() {
    const predictScore = this.score[Number(this.artists.mainIdx)][
      Number(this.artists.subIdx)
    ];
    console.log("predict", predictScore);
    if (this.artists.mainArtist !== "" && this.artists.subArtist !== "") {
      if (this.inputT) {
        clearTimeout(this.inputT);
      }
      this.inputT = setTimeout(() => {
        this.animating = true;
        this.mainInput.disabled = true;
        this.subInput.disabled = true;
        this.textRoll.animateTo(
          `Expected position is No.${predictScore}`,
          1000
        );
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
