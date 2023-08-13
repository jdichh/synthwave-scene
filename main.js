/* To-do List™ 
  Displacement map for terrain
   - Middle geometry is flat
   - Sides are "mountainous"
   - Low poly or nah?
  Endless terrain
   - 2nd copy of terrain?
   - Move 1st copy of terrain after 2nd copy when the first copy has "ended"?
   Plane popup fix
   - Add fog?
*/
import * as THREE from "three";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "./node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "./node_modules/three/examples/jsm/postprocessing/ShaderPass.js";
import { RGBShiftShader } from "./node_modules/three/examples/jsm/shaders/RGBShiftShader.js";
import { GammaCorrectionShader } from "./node_modules/three/examples/jsm/shaders/GammaCorrectionShader.js";
import { UnrealBloomPass } from "./node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";

// FPS Data
import Stats from 'stats.js';
const stats = new Stats()
stats.showPanel(0);
stats.dom.style.position = "absolute";
stats.dom.style.top = "0";
stats.dom.style.left = "0";
document.body.appendChild(stats.dom);

// Colors
const BLACK = "#000000";

const TEXTURE = "./public/assets/grid.webp";
const TERRAIN = "./public/assets/terrain_data.webp";

const textureLoader = new THREE.TextureLoader();
const gridLandscape = textureLoader.load(TEXTURE);
const terrain = textureLoader.load(TERRAIN);

const canvas = document.querySelector(".webGL");
const scene = new THREE.Scene();

// Landscape width is 3, height is 2, and then divided by 24 segments along the width and height to enhance terrain detail.
const geometry = new THREE.PlaneGeometry(3, 2, 24, 24);

// Material is the texture. Or if you're a gamer™, a weapon skin.
const material = new THREE.MeshStandardMaterial({
  map: gridLandscape,
  displacementMap: terrain,
  // Height of "mountains".
  displacementScale: 0.8,
});
// Geometry + Material = Mesh

// Plane (the landscape) is positioned in front of the camera.
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = 0;
plane.position.z = 0.15;

const plane2 = new THREE.Mesh(geometry, material);
plane2.rotation.x = -Math.PI * 0.5;
plane2.position.y = 0.0;
plane2.position.z = -1.85

const plane3 = new THREE.Mesh(geometry, material);
plane3.rotation.x = -Math.PI * 0.5;
plane3.position.y = 0;
plane3.position.z = -3.85; 

scene.add(plane);
scene.add(plane2);
scene.add(plane3);

// AmbientLight(color, intensity)
const ambientLight = new THREE.AmbientLight("#ffffff", 15);
scene.add(ambientLight);

const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/* PerspectiveCamera(FoV, Aspect Ratio, Near Plane Distance, Far Plane Distance)
  Near Clipping Plane is the visibility of the foreground. Higher value means that the anything close to the camera isn't visible. Opposite for lower values.
  Far Clipping Plane is the visibility of the background. Higher value means longer draw distance (Can see the scene further). Opposite for lower values.
*/
const camera = new THREE.PerspectiveCamera(
  90,
  windowSize.width / windowSize.height,
  0.01,
  10 
);

camera.position.x = 0;
camera.position.y = 0.125;
camera.position.z = 1;

// DEVTOOLS! Not meant for normal users/viewers.
const controls = new OrbitControls(camera, canvas);
// Enabling damping is like scroll-behavior: smooth in CSS.
controls.enableDamping = true;
// DEVTOOLS!

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(windowSize.width, windowSize.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// const backgroundColor = new THREE.Color("#000000")
// scene.background = backgroundColor;

// Fog(color, near clip, far clip)
const fog = new THREE.Fog(BLACK, 1, 4.5);
scene.fog = fog

const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(windowSize.width, windowSize.height)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.0006;
effectComposer.addPass(rgbShiftPass);

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1, 0.2, 0.6);
effectComposer.addPass(bloomPass);

// Event listener for resizing events.
window.addEventListener("resize", () => {
  // Update size based on current browser's size.
  windowSize.width = window.innerWidth;
  windowSize.height = window.innerHeight;

  /* Update camera aspect ratio and projection matrix.
    Projection matrix defines how a 3D scene is rendered onto a 2D scene, based on PerspectiveCamera (values).
  */
  camera.aspect = windowSize.width / windowSize.height;
  camera.updateProjectionMatrix();

  // Update renderer window size.
  renderer.setSize(windowSize.width / windowSize.height);
  renderer.setPixelRatio(Math.min(windowSize.devicePixelRatio), 2);

  effectComposer.setSize(windowSize.width / windowSize.height);
  effectComposer.setPixelRatio(Math.min(windowSize.devicePixelRatio), 2);
});

// Clock() tracks the elapsed time since the loop started.
const clock = new THREE.Clock();
const animationSpeed = 0.1;

const updateFrame = () => {
  stats.begin()

  // Returns time in seconds.
  const elapsedTime = clock.getElapsedTime();
  // Devtool
  controls.update();
  /* Enables looping effect along with requestAnimationFrame.
    (elapsedTime * speed) % 2 enables smooth z-movement. 
    When '% 2' reaches 2, it resets the loop to 0. 
    '- 2' in plane2 just staggers plane2.
  */
  plane.position.z = (elapsedTime * animationSpeed) % 2;
  plane2.position.z = ((elapsedTime * animationSpeed) % 2) - 2;
  plane3.position.z = ((elapsedTime * animationSpeed) % 2) - 4;

  renderer.render(scene, camera);
  effectComposer.render();
  // Call updateFrame on every frame passed.
  window.requestAnimationFrame(updateFrame);

  stats.end()
};

updateFrame();
