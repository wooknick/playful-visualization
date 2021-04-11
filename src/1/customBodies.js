import Matter from "matter-js";

const Bodies = Matter.Bodies;

export function artistBox(text, x, y, w, h) {
  const body = Bodies.rectangle(x, y, w, h, {
    render: {
      fillStyle: `rgb(
            ${Math.ceil(Math.random() * 255)},
            ${Math.ceil(Math.random() * 255)},
            ${Math.ceil(Math.random() * 255)}
          )`,
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
  const l = string.length;
  const unit = l * 20;

  drawing.width = `${unit}`;
  drawing.height = `${unit}`;

  let ctx = drawing.getContext("2d");

  ctx.fillStyle = "red";
  //ctx.fillRect(0, 0, 150, 150);
  ctx.beginPath();
  // ctx.arc(75, 75, 20, 0, Math.PI * 2, true);
  // ctx.rect(0, 0, drawing.width, 75);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff";
  // ctx.font = "20pt sans-serif";
  ctx.font = "20pt Exo";
  ctx.textAlign = "center";
  ctx.fillText(string, unit / 2, unit / 2);
  // ctx.strokeText("Canvas Rocks!", 5, 130);

  return drawing.toDataURL("image/png");
}
