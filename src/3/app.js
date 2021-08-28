import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

class App {
  constructor() {
    this.canvas = document.getElementById("app");
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    this.particleGeometry = undefined;
    this.particleMaterial = undefined;
    this.particle = undefined;

    this.init();
    this.debug();
    this.animate();
    this.eventHandler();
  }

  eventHandler() {
    window.addEventListener("resize", this.resize.bind(this), false);
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    // Update camera
    this.camera.aspect = this.stageWidth / this.stageHeight;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.stageWidth, this.stageHeight);
    this.renderer.setPixelRatio(this.pixelRatio);
  }

  init() {
    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.stageWidth / this.stageHeight,
      0.1,
      100
    );
    this.camera.position.x = 3;
    this.camera.position.y = 3;
    this.camera.position.z = 3;
    this.scene.add(this.camera);

    // Controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.renderer.setSize(this.stageWidth, this.stageHeight);
    this.renderer.setPixelRatio(this.pixelRatio);

    // Clock
    this.clock = new THREE.Clock();
  }

  debug() {
    this.parameters = {};
    this.parameters.count = 100000;
    this.parameters.size = 0.02;
    this.parameters.radius = 5;
    this.parameters.branches = 3;
    this.parameters.spin = 1;
    this.parameters.randomness = 0.2;
    this.parameters.randomnessPower = 3;
    this.parameters.insideColor = "#ff6030";
    this.parameters.outsideColor = "#1b3984";

    this.gui = new dat.GUI({ width: 400 });

    this.gui
      .add(this.parameters, "count")
      .min(100)
      .max(100000)
      .step(100)
      .onFinishChange(this.generateGalaxy.bind(this));
    this.gui
      .add(this.parameters, "size")
      .min(0.001)
      .max(0.1)
      .step(0.001)
      .onFinishChange(this.generateGalaxy.bind(this));
    this.gui
      .add(this.parameters, "radius")
      .min(2)
      .max(20)
      .step(0.01)
      .onFinishChange(this.generateGalaxy.bind(this));
    this.gui
      .add(this.parameters, "branches")
      .min(2)
      .max(20)
      .step(1)
      .onFinishChange(this.generateGalaxy.bind(this));
    this.gui
      .add(this.parameters, "spin")
      .min(-5)
      .max(5)
      .step(0.001)
      .onFinishChange(this.generateGalaxy.bind(this));
    this.gui
      .add(this.parameters, "randomness")
      .min(0)
      .max(2)
      .step(0.001)
      .onFinishChange(this.generateGalaxy.bind(this));
    this.gui
      .add(this.parameters, "randomnessPower")
      .min(1)
      .max(5)
      .step(0.01)
      .onFinishChange(this.generateGalaxy.bind(this));
    this.gui
      .addColor(this.parameters, "insideColor")
      .onFinishChange(this.generateGalaxy.bind(this));
    this.gui
      .addColor(this.parameters, "outsideColor")
      .onFinishChange(this.generateGalaxy.bind(this));

    this.generateGalaxy();
  }

  generateGalaxy() {
    if (!!this.particle) {
      this.particleGeometry.dispose();
      this.particleMaterial.dispose();
      this.scene.remove(this.particle);
    }
    this.particleGeometry = new THREE.BufferGeometry();

    const particlePositions = new Float32Array(this.parameters.count * 3);
    const particleColors = new Float32Array(this.parameters.count * 3);

    const colorInside = new THREE.Color(this.parameters.insideColor);
    const colorOutside = new THREE.Color(this.parameters.outsideColor);

    for (let i = 0; i < this.parameters.count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * this.parameters.radius;

      const spinAngle = radius * this.parameters.spin;
      const branchAngle =
        ((i % this.parameters.branches) / this.parameters.branches) *
        Math.PI *
        2;

      const randomX =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomY =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomZ =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);

      particlePositions[i3] =
        Math.cos(branchAngle + spinAngle) * radius + randomX;
      particlePositions[i3 + 1] = 0 + randomY;
      particlePositions[i3 + 2] =
        Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / this.parameters.radius);

      particleColors[i3] = mixedColor.r;
      particleColors[i3 + 1] = mixedColor.g;
      particleColors[i3 + 2] = mixedColor.b;
    }

    this.particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    this.particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(particleColors, 3)
    );

    this.particleMaterial = new THREE.PointsMaterial({
      size: this.parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    this.particle = new THREE.Points(
      this.particleGeometry,
      this.particleMaterial
    );

    this.scene.add(this.particle);
  }

  animate(t) {
    const elapsedTime = this.clock.getElapsedTime();
    // this.parameters.spin = Number(this.parameters.spin) + 0.001;
    // this.generateGalaxy();

    // Camera animation
    // this.camera.position.x -= Math.cos(elapsedTime) * 0.05;
    // this.camera.position.y -= Math.cos(elapsedTime) * 0.05;
    // this.camera.position.z -= Math.cos(elapsedTime) * 0.05;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Update controls
    this.controls.update();

    // Render
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.animate.bind(this));
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
}

window.onload = () => {
  const app = new App();
  console.log(app.isMobile());
};
