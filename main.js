import * as THREE from "three";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector(".webGL");
const scene = new THREE.Scene();

// Width is 1, height is 2, and then divided by 24 squares along the width and height.
const geometry = new THREE.PlaneGeometry(1, 2, 24, 24);
const material = new THREE.MeshBasicMaterial({
  color: 0xfff,
});
const plane = new THREE.Mesh(geometry, material);

// Plane (the landscape) is positioned in front of the camera.
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = 0;
plane.position.z = 0.15;

scene.add(plane);

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
  0.1,
  20
);

camera.position.x = 0;
camera.position.y = 0.7;
camera.position.z = 1;

// DEVTOOLS! Not meant for normal users/viewers.
const controls = new OrbitControls(camera, canvas);
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

const updateFrame = () => {
  controls.update();
  renderer.render(scene, camera)

  // Call updateFrame on every frame passed.
  window.requestAnimationFrame(updateFrame)
}

updateFrame();