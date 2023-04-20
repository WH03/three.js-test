import * as THREE from "three";
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import {
    RGBELoader
} from 'three/addons/loaders/RGBELoader.js';
import {
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js'
import {
    DRACOLoader
} from 'three/addons/loaders/DRACOLoader.js';

// import gsap from 'gsap/esm/index.js'

import {
    EffectComposer
} from 'three/addons/postprocessing/EffectComposer.js';
import {
    RenderPass
} from 'three/addons/postprocessing/RenderPass.js';
import {
    ShaderPass
} from 'three/addons/postprocessing/ShaderPass.js';
import {
    OutlinePass
} from 'three/addons/postprocessing/OutlinePass.js';
import {
    FXAAShader
} from 'three/addons/shaders/FXAAShader.js';

// 引入着色器变量
import vertexShader from '../shader/vertexShader.js'
import fragmentShader from '../shader/fragmentShader.js'


// console.log('vertexShader:',vertexShader)
// console.log('fragmentShader:',fragmentShader)

let scene, controls, camera, renderer;

let shaderMaterial, rawShaderMaterial, textureLoader, texture, gltfLoader, rgbeLoader;


const clock = new THREE.Clock();


function initScene() {
    scene = new THREE.Scene();
    // const axesHelper = new THREE.AxesHelper(500);
    // scene.add(axesHelper);
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



    //加载hdr
    rgbeLoader = new RGBELoader();
    rgbeLoader.loadAsync('textures/2k.hdr').then((texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
    });

    // 加载gltf模型
    gltfLoader = new GLTFLoader();
    let lightBox = null;
    gltfLoader.load('model/flyLight.glb', (gltf) => {
        // gltf.scene.scale.set(0.2, 0.2, 0.2);
        console.log('gltf.scene.children[1]:', gltf.scene.children[1]);

        lightBox = gltf.scene.children[1];
        lightBox.material = shaderMaterial;

        // 克隆
        for (let i = 0; i < 150; i++) {
            let flyLight = gltf.scene.clone(true);
            let x = (Math.random() - 0.5) * 300;
            let y = Math.random() * 60 + 25;
            let z = (Math.random() - 0.5) * 300;

            flyLight.position.set(x, y, z);
            scene.add(flyLight);
        }



    });

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