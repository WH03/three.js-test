import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
let scene, camera, renderer;
let axesHelper;
let ambientLight, spotLight;
let plane, cylinder;
let controls;

// function init() {
initRenderer();
initCamera();
initScene();
initAxesHelper()
initControls();


initAmbientLight();
initSpotLight()
initMesh();

initShadow();
render();
// }

function initScene() {
    scene = new THREE.Scene();

};

function initCamera() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(100, 100, 100);
    camera.lookAt(0, 0, 0);

};

function initRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
};

function initAxesHelper() {
    axesHelper = new THREE.AxesHelper(50);
    scene.add(axesHelper);
}

function initAmbientLight() {
    ambientLight = new THREE.AmbientLight('#fff');
    scene.add(ambientLight);
}

function initSpotLight() {
    spotLight = new THREE.SpotLight('#fff', 1);
    spotLight.position.set(-50, 80, 0);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.2;
    scene.add(spotLight);
}


function initMesh() {
    const planeGeometry = new THREE.PlaneGeometry(600, 400);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x808080, side: THREE.DoubleSide });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.set(Math.PI / 2, 0, 0);
    scene.add(plane)
    /* 
        CylinderGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)
        radiusTop — 圆柱的顶部半径，默认值是1。
        radiusBottom — 圆柱的底部半径，默认值是1。
        height — 圆柱的高度，默认值是1。
        radialSegments — 圆柱侧面周围的分段数，默认为8。
        heightSegments — 圆柱侧面沿着其高度的分段数，默认值为1。
        openEnded — 一个Boolean值，指明该圆锥的底面是开放的还是封顶的。默认值为false，即其底面默认是封顶的。
        thetaStart — 第一个分段的起始角度，默认为0。（three o'clock position）
        thetaLength — 圆柱底面圆扇区的中心角，通常被称为“θ”（西塔）。默认值是2*Pi，这使其成为一个完整的圆柱。
    */
    const cylinderGeometry = new THREE.CylinderGeometry(3, 3, 5, 20, 30, false);
    const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0x4080ff });
    cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(0, 20, 0);
    scene.add(cylinder);
}


function initControls() {
    controls = new OrbitControls(camera, renderer.domElement);
}

function initShadow() {
    cylinder.castShadow = true;
    plane.receiveShadow = true;
    spotLight.castShadow = true;
    renderer.shadowMap.enabled = true;
}

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);

}

// window.onload = function () {
//     init()
// }