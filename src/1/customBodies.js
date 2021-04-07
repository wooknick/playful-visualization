import Matter from "matter-js";

const Bodies = Matter.Bodies;

export function wordBox(text, score, x, y, w, h) {
  const body = Bodies.rectangle(x, y, w, h, {
    render: {
      fillStyle: `rgb(
            ${Math.ceil(Math.random() * 255)},
            ${Math.ceil(Math.random() * 255)},
            ${Math.ceil(Math.random() * 255)}
          )`,
      // text: {
      //   content: text,
      //   size: 16,
      //   color: "black",
      // },
      sprite: {
        texture: createImage(text),
        xScale: 1.2,
        yScale: 1.2,
      },
    },
  });
  // console.log(text);
  return body;
}

function createImage(string) {
  let drawing = document.createElement("canvas");

  drawing.width = "150";
  drawing.height = "150";

  let ctx = drawing.getContext("2d");

  ctx.fillStyle = "transparent";
  //ctx.fillRect(0, 0, 150, 150);
  ctx.beginPath();
  ctx.arc(75, 75, 20, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "20pt sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(string, 75, 85);
  // ctx.strokeText("Canvas Rocks!", 5, 130);

  return drawing.toDataURL("image/png");
}
