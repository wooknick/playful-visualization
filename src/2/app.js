import "regenerator-runtime/runtime";
import axios from "axios";
import TextRoll from "./textRoll";
import default1 from "./images/default1.jpg";
import default2 from "./images/default2.jpg";

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
    this.screenTopButtonWrapper = document.getElementById(
      "screenTopButtonWrapper"
    );
    this.refreshButton = document.getElementById("refresh");
    this.exchangeButton = document.getElementById("exchange");
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
    this.textRoll.setText("Guess Billboard Hot 100?");

    try {
      const {
        data: { artists },
      } = await axios.get(
        "https://raw.githubusercontent.com/hantaeha/billboard/main/src/json/artists.json"
      );
      this.artistsData = artists;
      const {
        data: { score },
      } = await axios.get(
        "https://raw.githubusercontent.com/hantaeha/billboard/main/src/json/billboard.json"
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
      e.target.placeholder = "Feat. Artist";
      this.blurT = setTimeout(this.handleInputBlur.bind(this), 200);
    });
    this.refreshButton.addEventListener("click", this.handleRefresh.bind(this));
    this.exchangeButton.addEventListener(
      "click",
      this.handleExchange.bind(this)
    );
  }

  handleRefresh(e) {
    if (this.animating) {
      return;
    }
    this.textRoll.updateText("Guess Billboard Hot 100?");
    this.artists = { mainArtist: "", subArtist: "", mainIdx: -1, subIdx: -1 };
    this.artistType = undefined;
    this.mainImage.innerHTML = ``;
    this.subImage.innerHTML = ``;
    this.mainInput.value = "";
    this.subInput.value = "";
    this.beforeResult.innerHTML = ``;
  }

  handleExchange(e) {
    if (this.animating) {
      return;
    }
    if (!!this.artists.mainArtist && !!this.artists.subArtist) {
      this.artists = {
        mainArtist: this.artists.subArtist,
        subArtist: this.artists.mainArtist,
        mainIdx: this.artists.subIdx,
        subIdx: this.artists.mainIdx,
      };
      const t = this.mainInput.value;
      this.mainInput.value = this.subInput.value;
      this.subInput.value = t;
      const tImage = this.mainImage.innerHTML;
      this.mainImage.innerHTML = this.subImage.innerHTML;
      this.subImage.innerHTML = tImage;
      this.showSelectedArtistName();
    }
  }

  handleInput(e) {
    const { name, value } = e.target;
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
        if (
          artist[1] !== this.artists.mainArtist &&
          artist[1] !== this.artists.subArtist
        ) {
          return artist[1].search(RegExp(term, "i")) > -1;
        }
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
      nowInput.value = this.artists.mainArtist;
    } else {
      nowInput = this.subInput;
      nowInput.value = this.artists.subArtist;
    }
  }

  showSelectedArtistImage() {
    if (this.artistType === "mainArtist") {
      this.mainImage.style.opacity = 0;
      this.mainImage.ontransitionend = () => {
        if (this.artists.mainArtist !== "") {
          const img = document.createElement("img");
          img.onerror = (e) => {
            e.target.src = default1;
          };
          img.src = `https://raw.githubusercontent.com/hantaeha/billboard/main/src/images/${this.artists.mainIdx}.jpg`;
          this.mainImage.innerHTML = ``;
          this.mainImage.appendChild(img);
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
          const img = document.createElement("img");
          img.onerror = (e) => {
            e.target.src = default2;
          };
          img.src = `https://raw.githubusercontent.com/hantaeha/billboard/main/src/images/${this.artists.subIdx}.jpg`;
          this.subImage.innerHTML = ``;
          this.subImage.appendChild(img);
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
        this.screenTopButtonWrapper.style.opacity = 0;
        this.textRoll.animateTo(`Predicted Rank is ${predictScore}`, 1000);
        setTimeout(() => {
          this.animating = false;
          this.mainInput.disabled = false;
          this.subInput.disabled = false;
          this.screenTopButtonWrapper.style.opacity = 1;
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
