import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, controls, renderer;

// 场景
function initScene() {
  scene = new THREE.Scene();
  //   const axesHelper = new THREE.AxesHelper(500);
  //   scene.add(axesHelper);
}

// 相机
function initCamera() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(10, 10, 10);
  camera.lookAt(0, 0, 0);
}
// 渲染器
function initRender() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    side: THREE.DoubleSide,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.setClearColor("#add8e6");
  document.body.appendChild(renderer.domElement);
}

// 灯光
function initLight() {
  let ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(-20, 20, 35);
}

function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
}

function initContent() {
  /**
   * 创建流体墙体材质
   * option =>
   * params bgUrl flowUrl
   * **/
  const createFlowWallMat = ({ bgUrl, flowUrl }) => {
    // 顶点着色器
    const vertexShader = `
              varying vec2 vUv;
              varying vec3 fNormal;
              varying vec3 vPosition;
              void main(){
                      vUv = uv;
                      vPosition = position;
                      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                      gl_Position = projectionMatrix * mvPosition;
              }
          `;
    // 片元着色器
    const fragmentShader = `
              uniform float time;
              varying vec2 vUv;
              uniform sampler2D flowTexture;
              uniform sampler2D bgTexture;
              void main( void ) {
                  vec2 position = vUv;
                  vec4 colora = texture2D( flowTexture, vec2( vUv.x, fract(vUv.y - time )));
                  vec4 colorb = texture2D( bgTexture , position.xy);
                  gl_FragColor = colorb + colorb * colora;
              }
          `;
    const bgTexture = new THREE.TextureLoader().load(
      bgUrl || "./img/opacityWall.png"
    );
    const flowTexture = new THREE.TextureLoader().load(
      flowUrl ||
        "https://model.3dmomoda.com/models/da5e99c0be934db7a42208d5d466fd33/0/gltf/F3E2E977BDB335778301D9A1FA4A4415.png"
      // "https://model.3dmomoda.com/models/47007127aaf1489fb54fa816a15551cd/0/gltf/116802027AC38C3EFC940622BC1632BA.jpg"
    );
    // 允许平铺
    flowTexture.wrapS = THREE.RepeatWrapping;
    return new THREE.ShaderMaterial({
      uniforms: {
        time: {
          value: 0,
        },
        flowTexture: {
          value: flowTexture,
        },
        bgTexture: {
          value: bgTexture,
        },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
  };

  const path = [
    [80, 0, -40],
    [10, 0, 0],
    [60, 0, 50],
    [0, 10, 0],
    [10, 10, 10],
    [-60, 0, 50],
    [-50, 0, -30],
    [80, 0, -40],
  ];
  const wallMat = createFlowWallMat({});
  const wallMesh = creatWallByPath({
    material: wallMat,
    path,
    height: 20,
  });
}

// 窗口变动触发
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.update.projectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function update() {
  controls.update();
}

// 初始化
function init() {
  initScene();
  initCamera();
  initRender();
  initLight();
  initContent();
  initControls();

  window.addEventListener("resize", onWindowResize, false);
}

// animateList.push(() => {
//   wallMat.uniforms.time.value += 0.01;
// });
// scene.add(wallMesh);

// 循环渲染
function animate() {
  // 一定要在此函数中调用

  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);

  wallMat.uniforms.time.value += 0.01;
}

// 初始化加载
window.onload = function () {
  init();
  animate();
};
