import * as THREE from "three";
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import {
    RGBELoader
} from 'three/addons/loaders/RGBELoader.js';


// 引入着色器变量
import vertexShader from '../shader/vertexShader.js'
import fragmentShader from '../shader/fragmentShader.js'


let scene, controls, camera, renderer;

let shaderMaterial, rawShaderMaterial, textureLoader, texture, gltfLoader, rgbeLoader;


const clock = new THREE.Clock();


function initScene() {
    scene = new THREE.Scene();
    const axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);
};

function initCamera() {
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 500);
    // camera.position.set(10, 10, 10);
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
    // 曝光程度，环境光亮度
    renderer.toneMappingExposure = 0.5;
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
    shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,
    });

    const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 512, 512);
    const planeMatrial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(planeGeometry, shaderMaterial);

    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

};

// 窗口变动触发 
function onWindowResize() {
    //   console.log("画面变化了");
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();
    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
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
    initControls();
    initContent();



    window.addEventListener('resize', onWindowResize, false);
};

// 循环渲染
function animate() {
    const elapsedTime = clock.getElapsedTime();
    // rawShaderMaterial.uniforms.u_time.value = elapsedTime;
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

// 初始化加载
window.onload = function () {
    init();
    animate();
}