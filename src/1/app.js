import "regenerator-runtime/runtime";
import axios from "axios";
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
import { artistBox } from "./customBodies";

class App {
  constructor() {
    this.canvas = document.getElementById("app");
    this.ctx = this.canvas.getContext("2d");
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.clickedBody;
    this.stickyBodies = [];
    this.stickyBodiesSet = new Set();
    this.resizeT = undefined;
    this.artistsData = undefined;
    this.score = undefined;
    this.artistsCount = Math.floor(window.innerWidth / 80);
    this.artists = [];
    this.diffIdx = 6;
  }

  async init() {
    try {
      const {
        data: { artists },
      } = await axios.get(
        "https://raw.githubusercontent.com/hantaeha/billboard/main/src/json/artists.json"
      );
      this.artistsData = artists;
      this.artists = this.artistsData
        .sort((a, b) => Math.random() - 0.5)
        .slice(0, this.artistsCount);
      const {
        data: { score },
      } = await axios.get(
        "https://raw.githubusercontent.com/hantaeha/billboard/main/src/json/billboard.json"
      );
      this.score = score;
    } catch (e) {
      console.error("data fetch error");
    }

    // Engine
    this.engine = Engine.create();
    Engine.run(this.engine);

    // World
    this.world = this.engine.world;
    this.world.gravity.x = 0;
    this.world.gravity.y = 0;

    // Renderer
    this.renderer = Render.create({
      canvas: this.canvas,
      engine: this.engine,
      options: {
        width: this.screenWidth,
        height: this.screenHeight,
        wireframes: false,
        background: "transparent",
      },
    });
    Render.run(this.renderer);

    this.addMouse();
    this.makeWorld();

    // Event Listener
    Events.on(this.engine, "beforeUpdate", this.update.bind(this));

    // Events.on(this.engine, "collisionStart", (e) => {
    //   const pairs = e.pairs;
    //   if (!this.clickedBody) {
    //     return;
    //   }
    //   let bodyA, bodyB;
    //   let idA, idB;
    //   for (let i = 0; i < pairs.length; i++) {
    //     const pair = pairs[i];
    //     if (
    //       pair.bodyA === this.clickedBody ||
    //       pair.bodyB === this.clickedBody
    //     ) {
    //       // pair.bodyB.render.strokeStyle = colorA;
    //       bodyA = pair.bodyA;
    //       idA = pair.bodyA.id;
    //       bodyB = pair.bodyB;
    //       idB = pair.bodyB.id;
    //     }
    //   }
    //   if (!!this.artists[idA - 6] && !!this.artists[idB - 6]) {
    //     const score = this.score[this.artists[idA - 6][0]][
    //       this.artists[idB - 6][0]
    //     ];
    //     console.log(this.artists[idA - 6][1], this.artists[idB - 6][1], score);
    //     if (score < 30) {
    //       // console.log("do sticky");
    //       if (!this.stickyBodiesSet.has(`${idA}${idB}`)) {
    //         this.stickyBodiesSet.add(`${idA}${idB}`);
    //         this.stickyBodies.push([bodyA, bodyB]);
    //       }
    //       // console.log(bodyA);
    //     }
    //   }
    // });
    window.addEventListener("resize", () => {
      if (this.resizeT) {
        clearTimeout(this.resizeT);
      }
      this.resizeT = setTimeout(this.resize.bind(this), 300);
    });
  }

  makeWorld() {
    // Wall
    const wd = 40;
    const walls = [
      // left, right, top, bottom
      Bodies.rectangle(0, this.screenHeight / 2, wd, this.screenHeight, {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
      }),
      Bodies.rectangle(
        this.screenWidth,
        this.screenHeight / 2,
        wd,
        this.screenHeight,
        {
          isStatic: true,
          render: {
            fillStyle: "transparent",
          },
        }
      ),
      Bodies.rectangle(this.screenWidth / 2, 0, this.screenWidth, wd, {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
      }),
      Bodies.rectangle(
        this.screenWidth / 2,
        this.screenHeight,
        this.screenWidth,
        wd,
        {
          isStatic: true,
          render: {
            fillStyle: "transparent",
          },
        }
      ),
    ];
    World.add(this.world, walls);

    this.artistBodies = [];
    this.artists.forEach((artist) => {
      this.artistBodies.push(
        artistBox(
          artist[1],
          this.screenWidth / 2 + (Math.random() - 0.5) * 700,
          this.screenHeight / 2 + (Math.random() - 0.5) * 200,
          artist[1].length * 15,
          40
        )
      );
    });
    this.artistBodies.forEach((artistBody) => {
      World.add(this.world, artistBody);
    });
  }

  clearWorld() {
    World.clear(this.world, false);
  }

  addMouse() {
    if (this.mouseConstraint) {
      Events.off(this.mouseConstraint, "mousedown");
    }
    this.mouse = Mouse.create(this.canvas);
    this.mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: this.mouse,
      constraint: {
        stiffness: 0.2,
      },
    });
    World.add(this.world, this.mouseConstraint);
    Events.on(
      this.mouseConstraint,
      "mousedown",
      this.handleArtistClick.bind(this)
    );
  }

  update(e) {
    this.stickyBodies.forEach((bodies) => {
      // Body.applyForce(
      //   bodies[0],
      //   bodies[0].position,
      //   this.getForce(bodies[0].position, bodies[1].position)
      // );
      Body.applyForce(
        bodies[1],
        bodies[1].position,
        this.getForce(bodies[1].position, bodies[0].position)
      );
    });
    if (this.artistBodies) {
      this.artistBodies
        .filter((item) => !this.stickyBodies.includes(item))
        .forEach((body) => {
          Body.applyForce(
            body,
            body.position,
            this.getForce(
              {
                x: this.screenWidth / 2,
                y: this.screenHeight / 2,
              },
              body.position,
              0.000003
            )
          );
        });
    }
    if (this.clickedBody) {
      Body.applyForce(
        this.clickedBody,
        this.clickedBody.position,
        this.getForce(
          this.clickedBody.position,
          { x: this.screenWidth / 2, y: this.screenHeight / 2 },
          0.00003
        )
      );
    }
    // const { timestamp } = e;
    // this.world.gravity = {
    //   x: Math.sin(timestamp / 1000) * 0.1,
    //   y: Math.cos(timestamp / 1000) * 0.1,
    // };
  }

  resize() {
    this.clearWorld();
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.canvas.width = this.screenWidth;
    this.canvas.height = this.screenHeight;
    this.diffIdx += 5 + Number(this.artistsCount);
    this.artistsCount = Math.floor(window.innerWidth / 80);
    this.artists = this.artistsData
      .sort((a, b) => Math.random() - 0.5)
      .slice(0, this.artistsCount);
    this.addMouse();
    this.makeWorld();
  }

  handleArtistClick(e) {
    this.clickedBody = this.mouseConstraint.body;
    if (!!this.clickedBody) {
      this.stickyBodiesSet.clear();
      this.stickyBodies = [];
      const idA = this.clickedBody.id;
      const all = this.artistBodies.filter((b) => b.id !== idA);
      all.forEach((b) => {
        const idB = b.id;
        const score = Math.min(
          this.score[this.artists[idA - this.diffIdx][0]][
            this.artists[idB - this.diffIdx][0]
          ],
          this.score[this.artists[idB - this.diffIdx][0]][
            this.artists[idA - this.diffIdx][0]
          ]
        );
        if (score < 10) {
          if (!this.stickyBodiesSet.has(`${idA}${idB}`)) {
            this.stickyBodiesSet.add(`${idA}${idB}`);
            this.stickyBodies.push([this.clickedBody, b]);
          }
        }
      });
    }
  }

  getForce(from, to, force = 0.000005) {
    const xv = to.x - from.x;
    const yv = to.y - from.y;
    return { x: xv * force, y: yv * force };
  }
}

window.onload = () => {
  new App().init();
};
