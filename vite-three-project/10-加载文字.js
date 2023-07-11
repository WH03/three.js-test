import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

let scene, camera, renderer;
let axesHelper;
let controls;
let hemisPhereLight, directionalLight;
let fontLoader, shapes, shapeGeometry, material, mesh;

let lineMat = new THREE.LineBasicMaterial({  color: 0x006699,     side: THREE.DoubleSide });
let lines = new THREE.Object3D();

initRenderer();
initCamera();
initScene();
initAxesHelper();
initControls();
createFont();
initLight();

initShadow();

animate();


function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#fff');
};

function initCamera() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 3000);
    // camera.position.set(10, 10, 10);
    camera.position.z = 8;
    camera.position.y = -5; 
    // camera.lookAt(0, 0, 0);
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

}

function createFont() {
    fontLoader = new FontLoader().load('./public/fonts/gentilis_bold.typeface.json', (font) => {
        shapes = font.generateShapes("three.js", 1);
        shapeGeometry = new THREE.ShapeGeometry(shapes);
        // 获取外边界矩形
        shapeGeometry.computeBoundingBox();
        // 定义一个三维向量
        let vec3 = new THREE.Vector3();
        // .getCenter:返回包围盒的中心点。
        shapeGeometry.boundingBox.getCenter(vec3);
        // 中心点偏右，需要向左移动，取反
        vec3.negate();
        material = new THREE.MeshBasicMaterial({
            color: 0x006699,
            side: THREE.DoubleSide,
            opacity:0.4,
            transparent:true
        });
        mesh = new THREE.Mesh(shapeGeometry, material);

        // 放到中心
        mesh.position.x = vec3.x;
        mesh.position.z = -2;
        scene.add(mesh);

        // 画线的字体
        for (let i = 0; i < shapes.length; i++) {
            let shape = shapes[i];
            // console.log(shape.holes);
            // 判断是否存在孔洞
            // if (shape.holes.length > 0) {
                // for (let j = 0; j < shape.holes.length; j++) {
                    // let hole = shape.holes[j];
                    // 得到曲线上的一组点位
                    let points = shape.getPoints();
                    // console.log('points:',points);
                    // 将点位放到缓冲几何体里边
                    let geo;
                    if (points.length > 0)
                        geo = new THREE.BufferGeometry().setFromPoints(points);
                    // console.log(geo);
                    // 生成线
                    let line = new THREE.Line(geo, lineMat);
                    line.position.x = vec3.x;

                    lines.add(line);
                }
            // }

        // }
        scene.add(lines)
    })
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
