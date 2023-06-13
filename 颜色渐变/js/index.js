import * as THREE from 'three';
import {
	OrbitControls
} from 'three/addons/controls/OrbitControls.js';

import vertexShader from '../shaders/vertexShader.js';
import fragmentShader from '../shaders/fragmentShader.js';

let scene, camera, renderer;
let axesHelper;
let controls;
let ambientLight, hemisPhereLight, directionalLight;

let box, floor;
let shaderMaterial, shaderArr;

function init() {
	initScene();
	initCamera();
	initLight();
	initAxesHelper();
	initRenderer();

	initContent();
	initControls();
}

function initScene() {
	scene = new THREE.Scene();

};

function initCamera() {
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 3000);
	camera.position.set(10, 10, 10);
	camera.lookAt(0, 0, 0);
};

function initRenderer() {
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	// 曝光程度，环境光亮度
	renderer.toneMappingExposure = 0.5;
	// renderer.setClearColor('#add8e6', 1);
	document.body.appendChild(renderer.domElement);
};

function initAxesHelper() {
	axesHelper = new THREE.AxesHelper(50);
	scene.add(axesHelper);
}

function initLight() {
	// 环境光
	ambientLight = new THREE.AmbientLight(0xffffff, 1);
	scene.add(ambientLight);
	// 平行光
	directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(20, 20, 35);
	scene.add(directionalLight);

	// const directionalLightHelp = new THREE.DirectionalLightHelper(directionalLight, 5);
	// scene.add(directionalLightHelp);
}


function initContent() {
	shaderMaterial = new THREE.ShaderMaterial({
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		// uniforms:传递参数
		uniforms: {
			upColor: {
				value: new THREE.Color("#00FFFF")
			},
			upColor2: {
				// value: new THREE.Color("#EEEE00")
				value: new THREE.Color("#e51015")
			},
			downColor: {
				value: new THREE.Color("#000080")
			},
			// 添加动画
			time: {
				value: 0
			},
			//立方体高度变化速度
			speed: {
				value: 1
			}
		}
	});

	//批量创建立方体并添加动画	
	// 创建shader数组
	shaderArr = [];
	// 创建随机数，0~1之间
	const {
		random
	} = Math;
	for (let i = 0; i < 100; i++) {
		const height = random() * 10;
		// 克隆，用来设置每一个立方体的颜色
		const itemShaderMaterial = shaderMaterial.clone();
		shaderArr.push(itemShaderMaterial);
		// console.log(333, shaderArr);
		const box = new THREE.Mesh(
			new THREE.BoxGeometry(random(), height, random()),
			// shaderMaterial
			itemShaderMaterial
		);

		//更改颜色值  更改r、b、g都可以
		itemShaderMaterial.uniforms.upColor.value.b = random();
		itemShaderMaterial.uniforms.upColor2.value.b = random();
		itemShaderMaterial.uniforms.speed.value = (0.5 - random()) * 5;

		box.position.x = (0.5 - random()) * 40;
		// 将立方体设置到坐标轴之上
		box.position.y = height / 2;
		box.position.z = (0.5 - random()) * 40;

		scene.add(box);
	}

	//添加地面
	floor = new THREE.Mesh(
		new THREE.BoxGeometry(100, 0.1, 100),
		new THREE.MeshStandardMaterial({
			color: '#030303'
		})
	);
	scene.add(floor);

}

function initControls() {
	controls = new OrbitControls(camera, renderer.domElement);
};

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function update() {
	controls.update();
};

function animate() {
	renderer.render(scene, camera);

	requestAnimationFrame(animate);
	update();

	shaderArr.forEach(shader => {
		shader.uniforms.time.value += 0.01;
	});

}

window.onload = function() {
	init();

	animate();
}