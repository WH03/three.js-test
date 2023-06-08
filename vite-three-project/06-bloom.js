import * as THREE from 'three';
import { PlaneGeometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

let scene, camera, renderer;
let axesHelper;
let controls;
let hemisPhereLight, directionalLight;
let sphereGeometry, sphereMaterial, sphere;
let renderScene, bloomPass, composer;

initRenderer();
initCamera();
initScene();
// initAxesHelper();
initControls();
initMesh();
initBloom();
initLight();

initShadow();

animate();


function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x445566);
};

function initCamera() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
};

function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
};

function initAxesHelper() {
    axesHelper = new THREE.AxesHelper(50);
    scene.add(axesHelper);
}


function initLight() {
    hemisPhereLight = new THREE.HemisphereLight();
    hemisPhereLight.intensity = 0.3;
    scene.add(hemisPhereLight);

    // 平行光
    directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // const directionalLightHelp = new THREE.DirectionalLightHelper(directionalLight, 5);
    // scene.add(directionalLightHelp);
}

function initMesh() {
    sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
}

//设置高亮效果
function initBloom() {
    //使用场景和相机创建RenderPass通道
    renderScene = new RenderPass(scene, camera);
    //创建UnrealBloomPass泛光通道
    bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1, 1.5, 0);

    bloomPass.renderToScreen = true;

    //创建效果组合器
    composer = new EffectComposer(renderer);
    // 将创建的通道添加到EffectComposer(效果组合器)对象中
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
}

function initShadow() {
    renderer.shadowMap.enabled = true;
    directionalLight.castShadow = true;
}

function initControls() {
    controls = new OrbitControls(camera, renderer.domElement);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})


function animate() {
    sphere.rotation.x += 0.01;
    // renderer.render(scene, camera);
    requestAnimationFrame(animate);
    /********** 更新效果组合器一定要在渲染器更新后，否则通道无法产生效果************/
    //效果组合器更新
    composer.render();
}
