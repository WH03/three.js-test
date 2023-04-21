import * as THREE from "three";
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import {
    RGBELoader
} from 'three/addons/loaders/RGBELoader.js';
import {
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js'
import gsap from '../../gsap/esm/index.js';
console.log(111, gsap);


// 引入着色器变量
import vertexShader from '../shader/vertexShader.js'
import fragmentShader from '../shader/fragmentShader.js'

let scene, controls, camera, renderer;

let shaderMaterial, rawShaderMaterial, textureLoader, texture, gltfLoader, rgbeLoader;


const clock = new THREE.Clock();


function initScene() {
    scene = new THREE.Scene();
    // const axesHelper = new THREE.AxesHelper(500);
    // scene.add(axesHelper);
};

function initCamera() {
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(1, 1, 1);
    camera.lookAt(0, 0, 0);
};

function initRender() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // 曝光程度，环境光亮度
    renderer.toneMappingExposure = 0.5;
    renderer.setClearColor('#add8e6', 1);
    document.body.appendChild(renderer.domElement);



};

function initLight() {
    let ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(20, 20, 35);
};

function initControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    // 设置控制阻尼
    controls.enableDamping = true;
    // 设置自动旋转
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;
    controls.maxPolarAngle = (Math.PI / 4) * 3;
    controls.minPolarAngle = (Math.PI / 4) * 3;

};

function initContent() {

    // 创建原始主色器材质
    shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,
        // uniforms: {}
        transparent: true,
    });



    //加载hdr
    rgbeLoader = new RGBELoader();
    rgbeLoader.loadAsync('textures/2k.hdr').then((texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
    });

    // 加载gltf模型
    gltfLoader = new GLTFLoader();
    let lightBox = null;
    gltfLoader.load('model/flyLight.glb', (gltf) => {
        // gltf.scene.scale.set(0.2, 0.2, 0.2);
        // console.log('gltf.scene.children[1]:', gltf.scene.children[1]);

        lightBox = gltf.scene.children[1];
        lightBox.material = shaderMaterial;
        // 克隆生成150个
        for (let i = 0; i < 150; i++) {
            let flyLight = gltf.scene.clone(true);
            let x = (Math.random() - 0.5) * 300;
            let y = Math.random() * 60 + 5;
            let z = (Math.random() - 0.5) * 300;
            flyLight.position.set(x, y, z);


            gsap.to(flyLight.rotation, {
                y: 2 * Math.PI,
                duration: 10 + Math.random() * 30,
                repeat: -1,
            });
            gsap.to(flyLight.position, {
                x: '+=' + Math.random() * 5,
                y: '+=' + Math.random() * 20,
                yoyo: true,
                duration: 5 + Math.random() * 10,
                repeat: -1
            })

            scene.add(flyLight);


        }




    })






};

// 窗口变动触发 
function onWindowResize() {
    //   console.log("画面变化了");
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();
    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
};

function update() {
    controls.update();
};

// 初始化
function init() {
    initScene();
    initCamera()
    initRender();
    initLight();
    initControls();
    initContent();



    window.addEventListener('resize', onWindowResize, false);
};

// 循环渲染
function animate() {
    const elapsedTime = clock.getElapsedTime();
    // rawShaderMaterial.uniforms.u_time.value = elapsedTime;
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

// 初始化加载
window.onload = function () {
    init();
    animate();
}