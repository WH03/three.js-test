import * as THREE from "three";
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 引入着色器变量
import vertexShader from '../shader/vertexShader.js'
import fragmentShader from '../shader/fragmentShader.js'

// console.log('vertexShader:',vertexShader)
// console.log('fragmentShader:',fragmentShader)

let scene, controls, camera, renderer;

let shaderMaterial, rawShaderMaterial;

const clock = new THREE.Clock();


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

    // Three提供的纹理加载器
    const textureLoader = new THREE.TextureLoader()
    // 导入纹理贴图基础贴图
    const texture = textureLoader.load('texture/ca.jpeg');
 

    // 创建原始主色器材质
    rawShaderMaterial = new THREE.RawShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,
        uniforms: {
            u_time: {
                value: 0
            },
            u_texture: {
                value: texture
            }
        }
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
    // window.addEventListener('resize', onWindowResize, false);
};

// 循环渲染
function animate() {
    const elapsedTime = clock.getElapsedTime();
    rawShaderMaterial.uniforms.u_time.value = elapsedTime;
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

// 初始化加载
window.onload = function () {
    init();
    animate();
}