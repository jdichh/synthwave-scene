/* To-do List™ 
  Displacement map for terrain
   - Middle geometry is flat
   - Sides are "mountainous"
   - Low poly or nah?
  Animating terrain moving to camera.
   - Can't do plane.position.z += 0.5 -> Varies on FPS. -> DONE!
  Endless terrain
*/
import * as THREE from "three";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";

const TEXTURE = "./public/assets/grid.webp";
const TERRAIN = "./public/assets/terrain_data.webp";

const textureLoader = new THREE.TextureLoader();
const gridLandscape = textureLoader.load(TEXTURE);
const terrain = textureLoader.load(TERRAIN);

const canvas = document.querySelector(".webGL");
const scene = new THREE.Scene();

// Geometry width is 1, height is 2, and then divided by 24 segments along the width and height to enhance terrain detail.
const geometry = new THREE.PlaneGeometry(2, 2, 24, 24);

// Material is the texture. Or if you're a gamer™, a weapon skin.
const material = new THREE.MeshStandardMaterial({
  map: gridLandscape,
  displacementMap: terrain,
  // Height of "mountains".
  displacementScale: 0.7,
});
// Geometry + Material = Mesh

// Plane (the landscape) is positioned in front of the camera.
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = 0;
plane.position.z = 0.15;
scene.add(plane);

// AmbientLight(color, intensity)
const ambientLight = new THREE.AmbientLight("#ffffff", 15);
scene.add(ambientLight);

const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/* PerspectiveCamera(FoV, Aspect Ratio, Near Plane Distance, Far Plane Distance)
  Don't fully understand everything yet. Just the basics.
  Near Clipping Plane is the visibility of the foreground. Higher value means that the anything close to the camera isn't visible. Opposite for lower values.
  Far Clipping Plane is the visibility of the background. Higher value means longer draw distance (Can see the scene further). Opposite for lower values.
*/
const camera = new THREE.PerspectiveCamera(
  75,
  windowSize.width / windowSize.height,
  0.01,
  30
);

camera.position.x = 0;
camera.position.y = 0.1;
camera.position.z = 0.9;

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
});

// Clock() is used for "proper framecounting" purposes animating something.
const clock = new THREE.Clock()

const updateFrame = () => {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  plane.position.z = elapsedTime * 0.1;
  renderer.render(scene, camera);
  // Call updateFrame on every frame passed.
  window.requestAnimationFrame(updateFrame);
};

updateFrame();
