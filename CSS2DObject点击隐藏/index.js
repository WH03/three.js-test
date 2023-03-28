import * as THREE from 'three';
import { OrbitControls } from '../three.js-dev150/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from '../three.js-dev150/examples/jsm/renderers/CSS2DRenderer.js';
import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from '../three.js-dev150/examples/jsm/renderers/CSS3DRenderer.js';

let camera, scene, renderer, labelRenderer, labeltext, labelRenderer3d;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(5, 5, 5);
    scene = new THREE.Scene();

    // const dirLight = new THREE.DirectionalLight(0xffffff);
    // dirLight.position.set(0, 0, 5);
    // scene.add(dirLight);

    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    // let zjPos = { x: 0, y: 1, z: 0 };
    // createLabel('矿院主井', zjPos, visibleLabel);

    function createLabel(textContent, pos, callback) {
        labeltext = document.createElement('p');
        labeltext.style.pointerEvents = 'auto';
        labeltext.className = 'textLabel';
        labeltext.textContent = textContent;
        const textLabel1 = new CSS2DObject(labeltext);
        textLabel1.position.set(pos.x, pos.y, pos.z);
        scene.add(textLabel1);
        labeltext.addEventListener("click", function (e) {
            callback(e);

        });
    };
    createLabel("矿院主井", { x: 0, y: 2, z: 0 }, visibleLabel);
    
    createLabel3d("222222", { x: 0, y: 5, z: 0 }, visibleLabel);
    createLabel3d2("11111", { x: 0, y: 0, z: 0 }, visibleLabel);

    function createLabel3d(textContent, pos, callback) {
        labeltext = document.createElement('p');
        labeltext.style.pointerEvents = 'auto';
        labeltext.className = 'textLabel3d';
        labeltext.textContent = textContent;
        const textLabel2 = new CSS3DObject(labeltext);
        textLabel2.position.set(pos.x, pos.y, pos.z);
        scene.add(textLabel2);
        labeltext.addEventListener("click", function (e) {
            callback(e);
        });
    };

    function createLabel3d2(textContent, pos, callback) {
        labeltext = document.createElement('p');
        labeltext.style.pointerEvents = 'auto';
        labeltext.className = 'textLabel3d';
        labeltext.textContent = textContent;
        const textLabel3 = new CSS3DSprite(labeltext);
        textLabel3.position.set(pos.x, pos.y, pos.z);
        scene.add(textLabel3);
        labeltext.addEventListener("click", function (e) {
            callback(e);
        });
    }


    function visibleLabel(e) {
        console.log(e.target.innerHTML);
    }
    //
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    labelRenderer = new CSS2DRenderer();
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);




    labelRenderer3d = new CSS3DRenderer();
    labelRenderer3d.domElement.style.pointerEvents = 'none';
    labelRenderer3d.setSize(window.innerWidth, window.innerHeight);
    labelRenderer3d.domElement.style.position = 'absolute';
    labelRenderer3d.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer3d.domElement);



    const controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', onWindowResize);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer3d.setSize(window.innerWidth, window.innerHeight);
};


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    labelRenderer3d.render(scene, camera);
};