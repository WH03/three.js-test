
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 引入着色器变量
import vertexShader from '../shader/vertexShader.js'
import fragmentShader from '../shader/fragmentShader.js'

// console.log('vertexShader:',vertexShader)
// console.log('fragmentShader:',fragmentShader)

let scene, controls, camera, renderer;
function initScene() {
    scene = new THREE.Scene();
    const axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);
};

function initCamera() {
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(1, 1, 1);
    camera.lookAt(0, 0, 0);
};

function initRender() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setClearColor('#add8e6', 1);
    document.body.appendChild(renderer.domElement);
};

function initLight() {
    let ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(20, 20, 35);
};

function initControls() {
    controls = new OrbitControls(camera, renderer.domElement);
};

function initContent() {
    // 创建原始主色器材质
    const rawShaderMaterial = new THREE.RawShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        // wireFrame:true
        side:THREE.DoubleSide
    });

    const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 64, 64);

    const plane = new THREE.Mesh(planeGeometry, rawShaderMaterial);
    scene.add(plane);
};


// 窗口变动触发 
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.update.projectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

function update() {
    controls.update();
};

// 初始化
function init() {
    initScene();
    initCamera()
    initRender();
    initLight();
    initContent();
    initControls();
    window.addEventListener('resize', onWindowResize, false);
};

// 循环渲染
function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

// 初始化加载
window.onload = function () {
    init();
    animate();
}