import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
let scene, camera, renderer;
let axesHelper;
let controls;
let hemisPhereLight, meshes;

let amount = 10;
let count = Math.pow(amount, 3);
let color = new THREE.Color();
let white = new THREE.Color().setHex(0xffffff);

let colored = 0;

// 射线对象
let raycaster = new THREE.Raycaster();

// 鼠标位置信息   设置(1,1),避免第一个有颜色
let mouse = new THREE.Vector2(1, 1);

// function init() {
initRenderer();
initCamera();
initScene();
initAxesHelper()
initControls();

// initAmbientLight();
initHemisphereLight()
initMesh();

// initShadow();


render();
// }

function initScene() {
    scene = new THREE.Scene();
};

function initCamera() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(15, 15, 15);
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


function initHemisphereLight() {
    hemisPhereLight = new THREE.HemisphereLight(0xffffff, 0x888888);
    scene.add(hemisPhereLight);
}

function initMesh() {
    const geometry = new THREE.IcosahedronGeometry(0.5, 3);
    const geometryMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    meshes = new THREE.InstancedMesh(geometry, geometryMaterial, count);
    scene.add(meshes);

    let index = 0;
    const offset = (amount - 1) / 2;
    let matrix = new THREE.Matrix4();
    console.log(matrix);
    for (let i = 0; i < amount; i++) {
        for (let j = 0; j < amount; j++) {
            for (let k = 0; k < amount; k++) {
                matrix.setPosition(offset - i, offset - j, offset - k);
                meshes.setMatrixAt(index, matrix);
                meshes.setColorAt(index, white);
                index += 1;


            }
        }
    }

}


function initControls() {
    controls = new OrbitControls(camera, renderer.domElement);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
})

function render() {
    renderer.render(scene, camera);
    raycaster.setFromCamera(mouse, camera);
    // 射线射向物体 返回数组
    const intersection = raycaster.intersectObject(meshes);

    if (intersection.length > 0) {
        // 保存选中id
        const instanceId = intersection[0].instanceId;
        meshes.getColorAt(instanceId, color);
        // 判断，白色才赋值，避免重复赋值
        if (color.equals(white)) {
            // 设置随机颜色
            meshes.setColorAt(instanceId, color.setHex(Math.random() * 0xffffff));
            meshes.instanceColor.needsUpdate = true;
            colored += 1;
        }
    }

    document.querySelector('.status').innerHTML = `${colored}/${count}`;

    requestAnimationFrame(render);

}

// window.onload = function () {
//     init()
// }