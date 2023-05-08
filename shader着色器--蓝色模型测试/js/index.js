import * as THREE from "three";
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import {
    RGBELoader
} from 'three/addons/loaders/RGBELoader.js';
import {
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

// import {
//     DRACOLoader
// } from 'three/addons/loaders/DRACOLoader.js';

// import gsap from '../../gsap-public/gsap-public/esm/index.js';
// console.log(333, gsap);



// 引入着色器变量
import vertexShader from '../shader/vertexShader.js'
import fragmentShader from '../shader/fragmentShader.js'

import strafeVertex from '../shader/strafeVertex.js'
import strafeFragment from '../shader/strafeFragment.js'


// console.log('vertexShader:',vertexShader)    
// console.log('fragmentShader:',fragmentShader)

let scene, controls, camera, renderer;

let shaderMaterial, strafeshaderMaterial, rawShaderMaterial, textureLoader, texture, gltfLoader, rgbeLoader;

const clock = new THREE.Clock();

// const cubeTextureLoader = new THREE.CubeTextureLoader();
//   const envMapTexture = cubeTextureLoader.load([
//     "../textures/background/posx.jpg",
//     "../textures/background/negx.jpg",
//     "../textures/background/posy.jpg",
//     "../textures/background/negy.jpg",
//     "../textures/background/posz.jpg",
//     "../textures/background/negz.jpg",
//   ]);
// // scene.background = envMapTexture;
// // scene.environment = envMapTexture;



function initScene() {
    scene = new THREE.Scene();
    // const axesHelper = new THREE.AxesHelper(500);
    // scene.add(axesHelper);
};

function initCamera() {
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 2000);
    camera.position.set(50, 50, 50);
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
    strafeshaderMaterial = new THREE.ShaderMaterial({
        vertexShader: strafeVertex,
        fragmentShader: strafeFragment,
        side: THREE.DoubleSide,
        transparent: true,
        uniforms: {
            scale: {
                value: 0
            },
            color1: {
                value: new THREE.Color("#54FF9F")
            },
            color2: {
                // value:new THREE.Color("#FFFF00")
                value: new THREE.Color("#EE3B3B")
            }
        }
    });
    shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,
    });

    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const envMapTexture = cubeTextureLoader.load([
        "textures/background/posx.jpg",
        "textures/background/negx.jpg",
        "textures/background/posy.jpg",
        "textures/background/negy.jpg",
        "textures/background/posz.jpg",
        "textures/background/negz.jpg",
    ]);

    scene.background = envMapTexture;

    // //加载hdr
    // rgbeLoader = new RGBELoader();
    // rgbeLoader.loadAsync('textures/2k.hdr').then((texture) => {
    //     texture.mapping = THREE.EquirectangularReflectionMapping;
    //     scene.background = texture;
    //     scene.environment = texture;
    // });

    // 加载gltf模型
    gltfLoader = new GLTFLoader();
    // // model
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath('three.js-dev-143/examples/js/libs/draco/');

    // gltfLoader.setDRACOLoader(dracoLoader);

    let lightBox = null;
    // gltfLoader.load('model/flyLight.glb', (gltf) => {
    gltfLoader.load('model/lb1.glb', (gltf) => {
        gltf.scene.scale.set(0.2, 0.2, 0.2);

        lightBox = gltf.scene.children;
        lightBox.material = shaderMaterial;

        gltf.scene.traverse((child) => {
            child.material = shaderMaterial;
        });
        scene.add(gltf.scene);
    });



    const plane = new THREE.Mesh(
        // new THREE.PlaneGeometry(100, 100),
        new THREE.CircleGeometry(50, 100),
        // new THREE.MeshBasicMaterial({
        //     side:THREE.DoubleSide
        // })
        strafeshaderMaterial
    );
    plane.position.set(0, 2, 0);
    plane.rotation.set(-Math.PI / 2, 0, 0);

    scene.add(plane);
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
    renderer.render(scene, camera);
};

// 循环渲染
function animate() {
    // const elapsedTime = clock.getElapsedTime();
    // rawShaderMaterial.uniforms.u_time.value = elapsedTime;

    // strafeshaderMaterial.uniforms.scale.value += 0.01;
    // strafeshaderMaterial.uniforms.scale.value %= 1;

    strafeshaderMaterial.uniforms.scale.value = Math.abs(Math.sin(performance.now() / 1000))

    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

// 初始化加载
window.onload = function () {
    init();
    animate();
}