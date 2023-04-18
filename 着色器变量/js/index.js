
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 引入着色器变量
import vertexShader from '../shader/vertexShader.js'
import fragmentShader from '../shader/fragmentShader.js'

let scene, controls, camera, renderer;
function initScene() {
    scene = new THREE.Scene();
    const axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);
};

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);
};

function initRender() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        side: THREE.DoubleSide
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
    directionalLight.position.set(-20, 20, 35);
};

function initControls() {
    controls = new OrbitControls(camera, renderer.domElement);
};

function initContent() {
    const shader = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });

    const planeGeometry = new THREE.PlaneBufferGeometry(10, 10, 64, 64);
    // const planeMaterial = new THREE.MeshBasicMaterial({
    //     color: '#f5f5dc',
    //     side: THREE.DoubleSide
    // });
    const plane = new THREE.Mesh(planeGeometry, shader);
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
    // window.addEventListener('resize', onWindowResize, false);
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