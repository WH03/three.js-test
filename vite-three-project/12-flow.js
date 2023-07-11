import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// 通过文本缓冲几何体加载文字
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// 导入flow
import { Flow } from 'three/addons/modifiers/CurveModifier.js'

let scene, camera, renderer;
let axesHelper;
let controls;
let ambientLight, directionalLight;
let fontLoader, shapes, shapeGeometry, material, mesh;
let curve;
let flow;


initRenderer();
initCamera();
initScene();
initAxesHelper();
initControls();
createFont();

createMoveFont()

initLight();

initShadow();

animate();


function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 100, 1000);
};

function initCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 2, 4);
    // camera.position.z = 10;
    // camera.rotateY(Math.PI / 2);
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
    ambientLight = new THREE.AmbientLight(0xffffff, 0.2,);
    scene.add(ambientLight);

    // 平行光
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.55);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

}

function createFont() {
    fontLoader = new FontLoader().load('./public/fonts/gentilis_bold.typeface.json', (font) => {
        // 一个用于将文本生成为单一的几何体的类。 它是由一串给定的文本，以及由加载的font（字体）和该几何体ExtrudeGeometry父类中的设置所组成的参数来构造的.
        shapeGeometry = new TextGeometry('Hello,Three.js', {
            font,
            size: 0.2,
            // 挤出文本厚度
            height: 0.05,
            // 曲线上点的数量，默认12
            curveSegments: 12,
            // 是否开启斜角
            bevelEnabled: true,
            // 斜角深度
            bevelThickness: 0.02,
            bevelSize: 0.01,
            bevelSegments: 5,

        });
        shapeGeometry.rotateX(Math.PI);
        material = new THREE.MeshStandardMaterial({
            color: 0x99ffff,
            side: THREE.DoubleSide,
        });
        mesh = new THREE.Mesh(shapeGeometry, material);
        // 实例化flow
        flow = new Flow(mesh);
        // 第一个参数是索引，第二个参数是曲线
        flow.updateCurve(0, curve);
        scene.add(flow.object3D);

    })
}


function createMoveFont() {
    //Create a closed wavey loop
    curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1, 0, 1),
        new THREE.Vector3(1, 0, -1),
        new THREE.Vector3(-1, 0, -1),
        new THREE.Vector3(-1, 0, 1),
    ], true);

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: '#00FF00' });

    // Create the final object to add to the scene
    const curveObject = new THREE.Line(geometry, material);
    scene.add(curveObject);
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
    // 让数字动起来,flow？:判断是否存在，存在执行方法  参数：代表速度
    flow?.moveAlongCurve(-0.01)
}
