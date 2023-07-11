import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// 通过文本缓冲几何体加载文字
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
console.log(TextGeometry);

let scene, camera, renderer;
let axesHelper;
let controls;
let ambientLight, directionalLight;
let fontLoader, shapes, shapeGeometry, material, mesh, mesh1;

initRenderer();
initCamera();
initScene();
initAxesHelper();
initControls();
createFont();
createPlane();
initLight();

initShadow();

animate();


function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000,100,1000);
};

function initCamera() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(500, 100, 0);
    camera.position.z = 10;
    camera.rotateY(Math.PI/2);
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
    ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    // 平行光
    directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0, 10);
    scene.add(directionalLight);

}

function createFont() {
    fontLoader = new FontLoader().load('./public/fonts/gentilis_bold.typeface.json', (font) => {
        // 一个用于将文本生成为单一的几何体的类。 它是由一串给定的文本，以及由加载的font（字体）和该几何体ExtrudeGeometry父类中的设置所组成的参数来构造的.
        shapeGeometry = new TextGeometry('Three.js', {
            font,
        });
        // 获取外边界矩形
        shapeGeometry.computeBoundingBox();
        // 定义一个三维向量
        let vec3 = new THREE.Vector3();
        // .getCenter:返回包围盒的中心点。
        shapeGeometry.boundingBox.getCenter(vec3);
        // 中心点偏右，需要向左移动，取反
        vec3.negate();
        material = new THREE.MeshPhongMaterial({
            color: 0x006699,
            side: THREE.DoubleSide,
        });
        mesh = new THREE.Mesh(shapeGeometry, material);
        // 放到中心
        mesh.position.x = vec3.x;
        mesh.position.z = 2 * vec3.z;
        mesh.position.y = 50;
        scene.add(mesh);


        mesh1 = new THREE.Mesh(shapeGeometry, material);
        // 放到中心
        mesh1.position.x = vec3.x;
        mesh1.position.y = -50;
        mesh1.rotateX(Math.PI);

        scene.add(mesh1);
    })
}


function createPlane() {
    let planeGeometry = new THREE.PlaneGeometry(1000, 1000);
    let planeMaterial = new THREE.MeshBasicMaterial({ opacity: 0.65, transparent: true });
    let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotateX(-Math.PI / 2);
    scene.add(planeMesh);
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
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
