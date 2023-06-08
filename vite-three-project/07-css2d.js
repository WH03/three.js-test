import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';


let scene, camera, renderer;
let axesHelper;
let controls;
let hemisPhereLight, directionalLight;
let sphereGeometry, sphereMaterial, earth, moon, earthLabel, moonLabel;
let texture;

let clock = new THREE.Clock();
let elapsedTime = 0;

let labelRenderer;



function init() {

    initCamera();
    initScene();
    initAxesHelper();
    createCSS2DRenderer();
    initRenderer();
    initControls();



    createEarth();
    createMoon();



    initLight();
    initShadow();


}

function initScene() {
    scene = new THREE.Scene();

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
    // renderer.setClearColor ('#B0E0E6');
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
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const directionalLightHelp = new THREE.DirectionalLightHelper(directionalLight, 5);
    scene.add(directionalLightHelp);
}

// 创建地球
function createEarth() {
    texture = new THREE.TextureLoader();

    sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    sphereMaterial = new THREE.MeshPhongMaterial({
        map: texture.load('./public/images/earth_atmos_2048.jpg'),
        // 高光颜色
        specular: 0x333333,
        // 高光轻度
        shininess: 5,
        // 加载图片，白色代表高光，黑色不会反射高光
        specularMap: texture.load('./public/images/earth_specular_2048.jpg'),
        // 法线贴图对物体的影响
        normalScale: new THREE.Vector2(0.85, 0.85),

    });
    earth = new THREE.Mesh(sphereGeometry, sphereMaterial);

    createEarthLabel();

    scene.add(earth);
}

// 创建月亮
function createMoon() {
    sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    sphereMaterial = new THREE.MeshPhongMaterial({
        map: texture.load('./public/images/moon_1024.jpg'),
        // 设置高光强度
        shininess: 5,
    });
    moon = new THREE.Mesh(sphereGeometry, sphereMaterial);
    moon.position.set(5, 0, 0);
    scene.add(moon);
}

// 创建CSS2DRenderer
function createCSS2DRenderer() {
    labelRenderer = new CSS2DRenderer();
    // labelRenderer.domElement.style.pointerEvents = 'none';
    // 设置渲染尺寸
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    // 设置绝对定位，脱离文档流
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);

}
// 创建css2DObject
function createEarthLabel() {
    earthLabel = document.createElement('div');
    // earthLabel.style.pointerEvents = 'auto';
    earthLabel.className = 'textLabel2d';
    earthLabel.textContent = "EARTH";
    earthLabel.style.color = 'aqua'
    let textLabel3 = new CSS2DObject(earthLabel);
    textLabel3.position.set(0, 1.5, 0);
    // earth.add(textLabel3);
    scene.add(textLabel3);
}


function initShadow() {
    renderer.shadowMap.enabled = true;
    directionalLight.castShadow = true;
}

function initControls() {
    // controls = new OrbitControls(camera, renderer.domElement);
    controls = new OrbitControls(camera, labelRenderer.domElement);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
})

function animate() {
    elapsedTime = clock.getElapsedTime();
    moon.position.set(Math.sin(elapsedTime) * 5, 0, Math.cos(elapsedTime) * 5);
    labelRenderer.render(scene, camera);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

}

window.onload = function () {
    init();
    animate();
}