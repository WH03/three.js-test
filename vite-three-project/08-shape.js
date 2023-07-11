import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';


let scene, camera, renderer;
let axesHelper;
let controls;
let ambientLight, directionalLight;

let shape, extrudeGeometry, extrudeMatrial, extrude;
let shapeGeometry, shapeMatrial, mesh;


function init() {
    initScene();
    initCamera();

    initLight();
    // createShape();

    createSmile();
    initAxesHelper();
    initRenderer();
    initControls();
}

function initScene() {
    scene = new THREE.Scene();

};

function initCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 1);
};

function initRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setClearColor ('#B0E0E6');
    document.body.appendChild(renderer.domElement);
};

function initAxesHelper() {
    axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);
}


function initLight() {
    // hemisPhereLight = new THREE.HemisphereLight(0.45);
    // // hemisPhereLight.intensity = 0.3;
    // scene.add(hemisPhereLight);

    ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    // 平行光
    directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(-10, 10, 0);
    directionalLight.lookAt(0, 0, 0);
    scene.add(directionalLight);

    // const directionalLightHelp = new THREE.DirectionalLightHelper(directionalLight, 5);
    // scene.add(directionalLightHelp);
}

// 在几何体上挖孔
function createShape() {
    shape = new THREE.Shape();
    // 远点
    shape.lineTo(0, 0)
        .lineTo(2, 0)
        .lineTo(2, 2)
        .lineTo(0, 2)
        .lineTo(0, 0);

    // holes:数组
    shape.holes.push(new THREE.Path().moveTo(0.5, 0.5).lineTo(1.5, 0.5).lineTo(1.5, 1.5).lineTo(0.5, 1.5).lineTo(0.5, 0.5));
    // 创建挤压缓冲几何体
    extrudeGeometry = new THREE.ExtrudeGeometry(shape);
    extrudeMatrial = new THREE.MeshStandardMaterial()
    extrude = new THREE.Mesh(extrudeGeometry, extrudeMatrial);
    scene.add(extrude);

}

// 创建笑脸
function createSmile() {
    // 创建圆
    shape = new THREE.Shape().absarc(0, 0, 1, 0, 2 * Math.PI);
    // 左眼睛
    shape.holes.push(new THREE.Path().absarc(-0.3, 0.55, 0.2, 0,2 * Math.PI));
    // 右眼睛
    shape.holes.push(new THREE.Path().absarc(0.3, 0.55, 0.2, 0,2 * Math.PI));
    // 嘴
    shape.holes.push(new THREE.Path().moveTo(-0.4,-0.25).bezierCurveTo(-0.4,-0.3,0,-0.8,0.4,-0.3).bezierCurveTo(0.4,-0.3,0,-0.65,-0.4,-0.3))

    shapeGeometry = new THREE.ShapeGeometry(shape);
    shapeMatrial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    mesh = new THREE.Mesh(shapeGeometry, shapeMatrial);
    scene.add(mesh);
}

function initControls() {
    controls = new OrbitControls(camera, renderer.domElement);
};


window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function update() {
    controls.update();
};

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    update();

}

window.onload = function () {
    init();
    animate();
    // initGui()
}
