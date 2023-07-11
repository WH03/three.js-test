import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    CSS3DRenderer,
    CSS3DObject,
    CSS3DSprite
} from 'three/examples/jsm/renderers/CSS3DRenderer.js';

import {
    GUI
} from 'three/examples/jsm/libs/lil-gui.module.min.js';
// 引入pdbloader，解析pdb结尾文件
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader.js'

let scene, camera, renderer;
let axesHelper;
let controls;
let hemisPhereLight, directionalLight;

let css3DRenderer;
let textLabel, img, sprite;

// 存储不同原子的颜色图片
let colorSpriteMap = {};

let baseSprite;

let gui;



function init() {

    initScene();
    initCamera();
    initLight();
    initAxesHelper();


    createCSS3Renderer();
    create3DObject();
    create3DSprite();
    // createPDB();


    initControls();

    initGui()

}

function initScene() {
    scene = new THREE.Scene();

};

function initCamera() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(10, 10, 300);
    camera.lookAt(0, 0, 0);
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


function createCSS3Renderer() {
    css3DRenderer = new CSS3DRenderer();
    css3DRenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(css3DRenderer.domElement);
}


function create3DObject() {
    textLabel = document.createElement('div');
    textLabel.textContent = "啦啦啦";
    textLabel.style.fontSize = "15px";
    textLabel.style.backgroundColor = "aqua";
    let obj = new CSS3DObject(textLabel);
    scene.add(obj);
}

// 创建图片
function create3DSprite() {
    baseSprite = document.createElement('img');
    baseSprite.src = './public/textures/sprites/ball.png';
    baseSprite.width = 30;
    baseSprite.height = 30;
    // sprite = new CSS3DSprite(img);
    // scene.add(sprite);
    // 加载完成
    baseSprite.onload = () => {
        createPDB();
    }

};
// 加载PDB文件
function createPDB() {
    new PDBLoader().load('./public/models/pdb/caffeine.pdb', (obj) => {

        // geometryAtoms:原子信息
        let geometryAtoms = obj.geometryAtoms;
        // geometryBonds：原子结构连接线
        let geometryBonds = obj.geometryBonds;
        // json:数据信息
        let jsons = obj.json;
        // 获取原子位置信息
        let positionAtoms = geometryAtoms.getAttribute('position');
        // 颜色信息
        let colorAtoms = geometryAtoms.getAttribute('color');
        // 定义变量，用来存储位置信息
        let positions = new THREE.Vector3();
        // 定义变量，用来存储颜色信息
        let colors = new THREE.Color();

        // 循环位置信息
        for (let i = 0; i < positionAtoms.count; i++) {
            /* fromBufferAttribute(attribute,iondex)
                    attribute：来源的attribute。
                    index：在attribute中的索引。
                把获取到的数据返回到调用属性里
            */

            positions.fromBufferAttribute(positionAtoms, i);
            colors.fromBufferAttribute(colorAtoms, i);

            let atomJson = jsons.atoms[i];
            // 获取元素名称
            let element = atomJson[4];

            // console.log(111, element)
            // 如果颜色不存在，话没有赋值
            if (!colorSpriteMap[element]) {
                // 赋值,通过canvas赋值
                let canvas = imageToCanvas(baseSprite);
                // 获取上下文对象
                let context = canvas.getContext('2d');

                colorify(context, canvas.width, canvas.height, colors);

            }
        }
    })
}

// 通过canvas赋值
function imageToCanvas(img) {
    let width = img.width;
    let height = img.height;

    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    // 2维下的绘图场景
    let context = canvas.getContext('2d');
    // 将图片绘制到canvas上
    context.drawImage(img, 0, 0, width, height);
    return canvas;
}


function colorify(context, width, height, color) {
    let r = color.r;
    let g = color.g;
    let b = color.b;
    // 获取像素数据
    let imageData = context.getImageData(0,0,width,height);
    console.log(imageData);
    // 颜色修改
    let data = imageData.data;
    context.putImageData(imageData,0,0);
}

function initGui() {
    gui = new GUI();
}


function initControls() {
    controls = new OrbitControls(camera, css3DRenderer.domElement);
};


window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    css3DRenderer.setSize(window.innerWidth, window.innerHeight);
}

function update() {
    controls.update();
};

function animate() {
    update();
    css3DRenderer.render(scene, camera);

    requestAnimationFrame(animate);

}

window.onload = function () {
    init();
    animate();

}
