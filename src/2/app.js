import TextRoll from "./textRoll";

function getDummy() {
  const data = [
    "Get the Top",
    "Not Bad",
    "Garbage",
    "Wasting Time",
    "Amazing!!",
    "The Return of the King",
  ];

  return data[Math.floor(Math.random() * data.length)];
}

function init() {
  // Variables
  const v = { mainArtist: "", subArtist: "" };

  // HTML Elements
  const mainInput = document.getElementById("mainInput");
  const subInput = document.getElementById("subInput");
  const beforeResult = document.getElementById("beforeResult");
  const result = document.getElementById("result");

  // TextRoll
  const textRoll = new TextRoll(result, window.innerWidth / 32);
  textRoll.setText("Try your Self");

  // Event handler
  let t;

  function handleInput(e) {
    const { value, name } = e.target;
    v[name] = value;
    beforeResult.innerHTML = `${v.mainArtist} + ${v.subArtist}`;

    if (v.mainArtist !== "" && v.subArtist !== "") {
      if (t) {
        clearTimeout(t);
      }
      t = setTimeout(() => {
        mainInput.disabled = true;
        subInput.disabled = true;
        textRoll.animateTo(getDummy(), 1000);
        setTimeout(() => {
          mainInput.disabled = false;
          subInput.disabled = false;
        }, 1500);
      }, 1200);
    }
  }

  document.getElementById("mainInput").addEventListener("input", handleInput);
  document.getElementById("subInput").addEventListener("input", handleInput);
}

window.onload = init;
