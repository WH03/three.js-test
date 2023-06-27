import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, controls, renderer;

let texture;
// 场景
function initScene() {
  scene = new THREE.Scene();
  //   const axesHelper = new THREE.AxesHelper(500);
  //   scene.add(axesHelper);
}

// 相机
function initCamera() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(10, 10, 10);
  camera.lookAt(0, 0, 0);
}
// 渲染器
function initRender() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    side: THREE.DoubleSide,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.setClearColor("#add8e6");
  document.body.appendChild(renderer.domElement);
}

// 灯光
function initLight() {
  let ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(-20, 20, 35);
}

function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
}

function initContent() {
  texture = new THREE.TextureLoader().load("images/line.png");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping; //每个都重复
  texture.repeat.set(1, 1);
  texture.needsUpdate = true;

  let material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
    transparent: true,
  });

  // 创建顶点数组
  let points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(10, 0, 0),
    new THREE.Vector3(10, 0, 10),
    new THREE.Vector3(0, 0, 10),
    new THREE.Vector3(0, 0, 0),
  ];

  // CatmullRomCurve3创建一条平滑的三维样条曲线
  let curve = new THREE.CatmullRomCurve3(points); // 曲线路径

  // 创建管道
  let tubeGeometry = new THREE.TubeGeometry(curve, 80, 0.1);

  let mesh = new THREE.Mesh(tubeGeometry, material);

  scene.add(mesh);
}

// 窗口变动触发
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.update.projectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function update() {
  controls.update();
}

// 初始化
function init() {
  initScene();
  initCamera();
  initRender();
  initLight();
  initContent();
  initControls();

  window.addEventListener("resize", onWindowResize, false);
}

// 循环渲染
function animate() {
  // 一定要在此函数中调用
  if (texture) texture.offset.x -= 0.01;
  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);
}

// 初始化加载
window.onload = function () {
  init();
  animate();
};
