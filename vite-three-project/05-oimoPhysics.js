import * as THREE from 'three';
import { PlaneGeometry } from 'three';
// import { DirectionalLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// 引入物理引擎方法
import { OimoPhysics } from 'three/examples/jsm/physics/OimoPhysics.js'

console.log(OimoPhysics)

let scene, camera, renderer;
let axesHelper;
let controls;
let hemisPhereLight, directionalLight;
let floor, boxes, spheres;
let physics;

let position = new THREE.Vector3();

// function init() {
initRenderer();
initCamera();
initScene();
// initAxesHelper()
initControls();
initMesh();

initLight();

initShadow();


await initPhysics();

animate();
// }

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x888888);
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
    renderer.outputColorSpace = new THREE.SRGBColorSpace;
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
    // floor
    floor = new THREE.Mesh(
        new THREE.BoxGeometry(30, 1, 30),
        new THREE.ShadowMaterial({ color: 0x111111 })//影子的颜色
    );
    floor.position.set(0, -1, 0);
    scene.add(floor);

    // floor = new THREE.Mesh(
    //     new THREE.BoxGeometry(20,1, 20),
    //     new THREE.MeshBasicMaterial({ color: '#7FFFAA', side: THREE.DoubleSide }),

    // );
    // floor.position.set(0, -1, 0);
    // floor.rotation.set(-Math.PI / 2, 0, 0);
    scene.add(floor)

    boxes = new THREE.InstancedMesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.1),
        new THREE.MeshLambertMaterial(),
        100
    );
    // 更新每一帧  提高渲染
    boxes.instanceMatrix.setUsage(THREE.DynamicCopyUsage);

    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    for (let i = 0; i < boxes.count; i++) {
        matrix.setPosition(
            Math.random() - 0.5,
            Math.random() * 20,
            Math.random() - 0.5
        );
        boxes.setMatrixAt(i, matrix);
        boxes.setColorAt(i, color.setHex(Math.random() * 0xffffffff));
    };
    scene.add(boxes);


    spheres = new THREE.InstancedMesh(
        new THREE.IcosahedronGeometry(0.075, 3),
        new THREE.MeshLambertMaterial(),
        100
    );
    spheres.instanceMatrix.setUsage(THREE.DynamicCopyUsage);


    for (let i = 0; i < spheres.count; i++) {
        matrix.setPosition(
            Math.random() - 0.5,
            Math.random() * 20,
            Math.random() - 0.5
        );
        spheres.setMatrixAt(i, matrix);
        spheres.setColorAt(i, color.setHex(Math.random() * 0xffffffff));
    }
    scene.add(spheres);


}

function initShadow() {
    renderer.shadowMap.enabled = true;
    directionalLight.castShadow = true;
    floor.receiveShadow = true;
    boxes.castShadow = true;
    boxes.castShadow = true;
    boxes.receiveShadow = true;
}

// 物理引擎
async function initPhysics() {
    // 异步
    physics = await OimoPhysics();
    // 第二个参数不写，表示为接受
    physics.addMesh(floor);
    physics.addMesh(boxes, 1);
    physics.addMesh(spheres, 1);

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

    let index = Math.floor(Math.random() * boxes.count);
    position.set(0, Math.random() + 1, 0);
    physics.setMeshPosition(boxes, position, index);


    index = Math.floor(Math.random() * spheres.count);
    position.set(0, Math.random() + 1, 0);
    physics.setMeshPosition(spheres, position, index);



    requestAnimationFrame(animate);

}

// window.onload = function () {
//     init()
// }