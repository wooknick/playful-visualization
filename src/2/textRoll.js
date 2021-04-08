import "./textRoll.css";

class TextRoll {
  /**
   * @param {HTMLElement} target
   * @param {number} size
   */
  constructor(target, size = 80) {
    this.target = target;
    this.text = "";
    this.size = size;
    this.passingLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    this.letters = [];
    this.rollingLetterDom = [];
    this.passingLetterDom = [];
  }

  createRollingLetter() {
    const rollingLetter = document.createElement("div");
    rollingLetter.classList.add("rolling-letter");
    rollingLetter.style.width = `${this.size}px`;
    rollingLetter.style.height = `${this.size}px`;
    rollingLetter.style.fontSize = `${this.size}px`;
    return rollingLetter;
  }

  createPassingLetter(letter) {
    const passingLetter = document.createElement("div");
    passingLetter.classList.add("passing-letter");
    passingLetter.style.width = `${this.size}px`;
    passingLetter.style.height = `${this.size}px`;
    passingLetter.innerText = letter;
    return passingLetter;
  }

  setText(newText) {
    this.text = newText;
    this.letters = this.text.split("");
    for (let i = 0; i < this.letters.length; i++) {
      const rollingLetter = this.createRollingLetter();
      const passingLetter = this.createPassingLetter(this.letters[i]);

      this.rollingLetterDom.push(rollingLetter);
      this.passingLetterDom.push([passingLetter]);
      rollingLetter.appendChild(passingLetter);
      this.target.appendChild(rollingLetter);
    }
  }

  updateText(newText) {
    this.rollingLetterDom = [];
    this.passingLetterDom = [];
    this.target.innerHTML = "";
    this.setText(newText);
  }

  getStatus() {
    console.log(this.rollingLetterDom);
    console.log(this.passingLetterDom);
  }

  animateTo(newText, time = 2000, delay = 400) {
    // confirm text length
    this.updateText(this.text.padEnd(newText.length, " "));

    // insert passing letter
    for (let i = 0; i < this.rollingLetterDom.length; i++) {
      this.passingLetters
        .sort((x, y) => Math.random() - 0.5)
        .slice(0, 14 + Math.floor(Math.random() * 5))
        .map((letter) => this.createPassingLetter(letter))
        .forEach((pl) => {
          this.rollingLetterDom[i].appendChild(pl);
          this.passingLetterDom[i].push(pl);
        });
    }
    // insert next letter
    const newTextLetters = newText.padEnd(this.text.length, " ").split("");
    for (let i = 0; i < newTextLetters.length; i++) {
      const pl = this.createPassingLetter(newTextLetters[i]);
      this.rollingLetterDom[i].appendChild(pl);
      this.passingLetterDom[i].push(pl);
    }
    // animate
    setTimeout(() => {
      let animateTime;
      for (let i = 0; i < this.rollingLetterDom.length; i++) {
        animateTime = time / 1000 + Math.random();
        for (let j = 0; j < this.passingLetterDom[i].length; j++) {
          const animateValue = `translateY(-${
            this.size * (this.passingLetterDom[i].length - 1)
          }px)`;

          this.passingLetterDom[i][
            j
          ].style.transition = `transform ${animateTime}s ease-in-out`;
          this.passingLetterDom[i][j].style.transform = animateValue;
        }
      }
      // clear passing letter thing
      setTimeout(() => {
        this.updateText(newText);
      }, Math.floor(animateTime * 1000 + 1000));
    }, delay);
  }
}

export default TextRoll;
