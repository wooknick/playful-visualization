import {
  Body,
  Bodies,
  Events,
  Engine,
  World,
  Mouse,
  MouseConstraint,
  Constraint,
  Render,
  Composites,
  Composite,
} from "matter-js";
import { data } from "./data";
import { wordBox } from "./customBodies";

function init() {
  /**
   * Common Variables
   */
  const canvas = document.getElementById("app");
  const ctx = canvas.getContext("2d");
  const pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
  let screenWidth = window.innerWidth;
  let screenHeight = window.innerHeight;
  let clickedBody;
  const stickyBodies = [];
  const stickyBodiesSet = new Set();

  const words = data.slice(0, 40).map((item) => {
    item.score = Math.ceil(Math.random() * 100);
    return item;
  });

  /**
   * Matter.js things
   */
  // const Engine = Matter.Engine,
  //   Render = Matter.Render,
  //   World = Matter.World,
  //   Bodies = Matter.Bodies,
  //   Mouse = Matter.Mouse,
  //   MouseConstraint = Matter.MouseConstraint,
  //   Events = Matter.Events;

  /**
   * Create Engine
   */
  const engine = Engine.create();
  Engine.run(engine);

  /**
   * Create World
   */
  const world = engine.world;
  world.gravity.x = 0;
  world.gravity.y = 0;

  /**
   * Mouse Control
   */
  const mouse = Mouse.create(canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        // visible: true,
      },
    },
  });
  // mouse.pixelRatio = pixelRatio;
  World.add(world, mouseConstraint);

  /**
   * Renderer
   */
  const renderer = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      width: screenWidth,
      height: screenHeight,
      // showVelocity: true,
      // hasBounds: true,
      wireframes: false,
    },
  });
  // renderer.mouse = mouse;
  // Render.setPixelRatio(renderer, "auto");
  Render.run(renderer);

  /**
   * Bodies, World Maker
   */

  // Wall
  const wd = 40;
  const walls = [
    // left, right, top, bottom
    Bodies.rectangle(-wd / 2, screenHeight / 2, wd, screenHeight, {
      isStatic: true,
    }),
    Bodies.rectangle(screenWidth + wd / 2, screenHeight / 2, wd, screenHeight, {
      isStatic: true,
    }),
    Bodies.rectangle(screenWidth / 2, -wd / 2, screenWidth, wd, {
      isStatic: true,
    }),
    Bodies.rectangle(screenWidth / 2, screenHeight + wd / 2, screenWidth, wd, {
      isStatic: true,
    }),
  ];
  World.add(world, walls);

  const wordBodies = [];
  words.forEach((word) => {
    wordBodies.push(
      wordBox(
        word.text,
        word.score,
        screenWidth / 2 + (Math.random() - 0.5) * 700,
        screenHeight / 2 + (Math.random() - 0.5) * 200,
        100,
        40
      )
    );
  });
  wordBodies.forEach((wordBody) => {
    World.add(world, wordBody);
  });

  function getForce(from, to, force = 0.000005) {
    const xv = to.x - from.x;
    const yv = to.y - from.y;
    // if (Math.abs(xv) < 80 || Math.abs(yv) < 80) {
    //   force = 0;
    // }
    return { x: xv * force, y: yv * force };
  }
  /**
   * Update Animation
   */
  let t = 0;
  function update(e) {
    // if (stickyBodies.length !== 0 && stickyBodies.length < 3) {
    //   console.log(stickyBodies);
    // }
    stickyBodies.forEach((bodies) => {
      Body.applyForce(
        bodies[0],
        bodies[0].position,
        getForce(bodies[0].position, bodies[1].position)
      );
      Body.applyForce(
        bodies[1],
        bodies[1].position,
        getForce(bodies[1].position, bodies[0].position)
      );
    });
    // const { timestamp } = e;
    // world.gravity.x = Math.sin(timestamp / 1000);
    // world.gravity.y = Math.cos(timestamp / 1000);
    // t += 1;
    // requestAnimationFrame(update.bind(this));
  }
  Events.on(engine, "beforeUpdate", update);
  // update();

  /**
   * Events
   */

  Events.on(mouseConstraint, "mousedown", (e) => {
    clickedBody = mouseConstraint.body;
    // clickedBody.isSensor = true;
  });
  Events.on(mouseConstraint, "mouseup", (e) => {
    // clickedBody.isSensor = false;
  });
  Events.on(engine, "collisionStart", (e) => {
    const pairs = e.pairs;
    if (!clickedBody) {
      return;
    }
    let bodyA, bodyB;
    let idA, idB;
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      if (pair.bodyA === clickedBody || pair.bodyB === clickedBody) {
        // pair.bodyB.render.strokeStyle = colorA;
        bodyA = pair.bodyA;
        idA = pair.bodyA.id;
        bodyB = pair.bodyB;
        idB = pair.bodyB.id;
      }
    }
    if (!!words[idA - 6] && !!words[idB - 6]) {
      const score = words[idA - 6].score + words[idB - 6].score;
      console.log(words[idA - 6].text, words[idB - 6].text, score);
      if (score >= 150) {
        // console.log("do sticky");
        if (!stickyBodiesSet.has(`${idA}${idB}`)) {
          stickyBodiesSet.add(`${idA}${idB}`);
          stickyBodies.push([bodyA, bodyB]);
        }
        // console.log(bodyA);
      }
    }
  });
}

window.onload = init;
let t;
window.onresize = () => {
  if (t) {
    clearTimeout(t);
  }
  t = setTimeout(init, 500);
};
