import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, controls, renderer;
let boxArr = [];
let redMaterial = new THREE.MeshBasicMaterial({
    color: 'red'
})
// 场景
function initScene() {
    scene = new THREE.Scene();
    const axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);
}

// 相机
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
}
// 渲染器
function initRender() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        side: THREE.DoubleSide
    })
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setClearColor('#add8e6');
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
    const boxGeometry = new THREE.BoxGeometry();
    // const boxMaterial = new THREE.MeshStandardMaterial();
    // const boxMaterial = new THREE.MeshPhongMaterial();
    const boxMaterial = new THREE.MeshBasicMaterial();


    // 创建多个正方体
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            for (let z = 0; z < 5; z++) {
                const box = new THREE.Mesh(boxGeometry, boxMaterial);
                box.position.set(Math.random() * 10 + i, Math.random() * 20 + j, Math.random() * 15 + z);
                scene.add(box);
                boxArr.push(box);
            }
        }
    }
}

// 创建投射光线
const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();
// 监听鼠标位置
window.addEventListener('mousemove', (event) => {
    console.log(event);
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
    raycaster.setFromCamera(mouse, camera);
    let result = raycaster.intersectObjects(boxArr);
    result.forEach(item => {
        item.object.material = redMaterial
    })
})


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