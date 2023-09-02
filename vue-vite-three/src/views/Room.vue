<script setup>
import { ref, reactive, onMounted } from "vue";
import * as THREE from "three";
import Base from "./base.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PointLight, Texture } from "three";
import gsap from "gsap";

console.log(gsap);

const canvasDom = ref(null);
let base = reactive(null);
const imgsrc = ref("images/太阳.png");
const imgdom = ref(null);

const titlebg = ref(null);
// 光线投射
const raycaster = new THREE.Raycaster();
// 设置层级
raycaster.layers.set(1);
const pointer = new THREE.Vector2();
let door = null,
  book = null;

let pinkLight = {
    light: null,
    isClose: false,
  },
  yellowLight = {
    light: null,
    isClose: false,
  };

const raycaster1 = new THREE.Raycaster();
raycaster1.layers.set(2);
const pointer1 = new THREE.Vector2();

let isClickLight = false;
let isClickScreen = false;

let roomObj = null;
let directionalLight;
onMounted(() => {
  base = new Base(canvasDom.value);
  loadGltf();
  initControls();
  addLight();
  update();

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("click", onPointerdown);

  imgdom.value.addEventListener("click", () => {
    if (
      !gsap.isTweening(directionalLight) &&
      !gsap.isTweening(directionalLight.position)
    ) {
      imgsrc.value == "images/太阳.png"
        ? (imgsrc.value = "images/月亮.png")
        : (imgsrc.value = "images/太阳.png");
      if (imgsrc.value == "images/月亮.png") {
        gsap.to(directionalLight.position, {
          x: -5,
          y: -6,
          z: 0,
          duration: 3,
        });
        gsap.to(directionalLight, {
          intensity: 0,
          duration: 1,
        });
      } else {
        gsap.to(directionalLight.position, {
          x: -10,
          y: 50,
          z: 10,
          duration: 1.5,
        });
        gsap.to(directionalLight, {
          intensity: 1,
          duration: 1,
        });
      }
    }
  });

  gsap.from(".title", {
    duration: 3.5,
    scale: 0.5,
    rotation: 360,
    opacity: 0,
    delay: 0.2,
    stagger: 0.2,
    ease: "elastic",
  });
});

function loadGltf() {
  new GLTFLoader().load("gltf/bedroom10.glb", (gltf) => {
    let obj1 = gltf.scene.children[1];
    obj1.rotation.x = 0.4;
    obj1.rotation.y = -1;
    addObj(obj1.children);
    roomObj = obj1;
    base.scene.add(obj1);
  });
}

function addLight() {
  let ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  base.scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight();
  directionalLight.castShadow = true;
  // 值越大，边缘越平滑
  directionalLight.shadow.mapSize.set(2048, 2048);
  base.scene.add(directionalLight);
}

function initControls() {
  let controls = new OrbitControls(base.camera, base.renderer.domElement);
}

let texture = new THREE.TextureLoader();

function addObj(obj) {
  obj.forEach((val) => {
    if (val instanceof THREE.Mesh) {
      val.castShadow = true;
      val.receiveShadow = true;
      // 设置贴图
      if (val.name.includes("pic")) {
        val.material.map = texture.load(`images/${val.name}.jpg`);
      }
      // 添加视频
      if (val.name.includes("screen")) {
        let video = document.createElement("video");
        video.src = "videos/1.mp4";
        // 循环播放
        video.loop = true;
        // 是否静音
        video.muted = true;
        video.play();
        let videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.NearestFilter;
        videoTexture.magFilter = THREE.NearestFilter;
        videoTexture.generateMipmaps = false;
        videoTexture.encoding = THREE.sRGBEncoding;
        // 修改方向
        videoTexture.center = new THREE.Vector2(0.5, 0.5);
        videoTexture.rotation = Math.PI / 2;
        val.layers.enable(2);
        val.material.map = videoTexture;
      }
      if (val.name == "cup1") {
        let colors = new THREE.Color(1, 0.54, 0.54);
        let pointLight = new THREE.PointLight(colors.getHex(), 1, 1);
        pointLight.matrixWorld = val.matrixWorld;
        pinkLight.light = pointLight;
        val.layers.enable(2);
        base.scene.add(pointLight);
      } else if (val.name == "cup2") {
        let colors = new THREE.Color(1, 1, 0);
        let pointLight = new THREE.PointLight(colors.getHex(), 1, 1);
        pointLight.matrixWorld = val.matrixWorld;
        yellowLight.light = pointLight;
        val.layers.enable(2);
        base.scene.add(pointLight);
      }
      if (val.name == "door") {
        // 添加层级
        val.layers.enable(1);
        door = val;
      }
      if (val.name == "book") {
        val.layers.enable(1);
        book = val;
      }
    } else {
      addObj(val.children);
    }
  });
}

function update() {
  // 绑定this，指向当前对象
  requestAnimationFrame(update);

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(pointer, base.camera);
  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(base.scene.children);
  if (intersects.length > 0) {
    if (intersects[0].object.name == "door" && door) {
      // 使用gsap插件设置动画
      gsap.to(door.rotation, {
        y: -0.5,
        duration: 0.5,
      });
    } else if (intersects[0].object.name == "book" && book) {
      gsap.to(book.position, {
        x: 1.5,
        duration: 0.5,
      });
    }
  } else {
    gsap.to(door?.rotation, {
      y: 0,
      duration: 0.5,
    });
    gsap.to(book?.position, {
      x: 0,
      duration: 0.5,
    });
  }

  //射线2
  raycaster1.setFromCamera(pointer1, base.camera);

  // 计算物体和射线的焦点
  const intersects1 = raycaster1.intersectObjects(base.scene.children);
  if (intersects1.length > 0) {
    if (intersects1[0].object.name == "cup1" && isClickLight) {
      pinkLight.isClose ? (pinkLight.isClose = false) : (pinkLight.isClose = true);
      isClickLight = false;
      if (pinkLight.isClose) {
        pinkLight.light.intensity = 0;
      } else {
        pinkLight.light.intensity = 1;
      }
    } else if (intersects1[0].object.name == "cup2" && isClickLight) {
      yellowLight.isClose ? (yellowLight.isClose = false) : (yellowLight.isClose = true);
      isClickLight = false;
      if (yellowLight.isClose) {
        yellowLight.light.intensity = 0;
      } else {
        yellowLight.light.intensity = 1;
      }
    } else if (intersects1[0].object.name == "screen") {
      if (!isClickScreen && !gsap.isTweening(base.camera.position)) {
        isClickScreen = true;
        gsap.to(base.camera.position, {
          x: 0.8,
          y: 0.8,
          z: 0.7,
          duration: 1,
          ease: "power2",
        });
      } else if (!gsap.isTweening(base.camera.position)) {
        isClickScreen = false;
        gsap.to(base.camera.position, {
          x: 0,
          y: 0.8,
          z: 4.5,
          duration: 1,
          ease: "power2",
        });
      }
    }
  }

  base.renderer.render(base.scene, base.camera);
}
// 添加鼠标移动射线
function onPointerMove(event) {
  // isClickLight = true;
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 删除之前的动画
  gsap.killTweensOf(roomObj.rotation);
  gsap.to(roomObj?.rotation, {
    y: pointer.x * 0.11 - 1,
    duration: 1,
  });
}

// 添加点击射线
function onPointerdown(event) {
  console.log("点击了");
  isClickLight = true;
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
  pointer1.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer1.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
</script>
<template>
  <div>
    <div ref="titlebg">
      <div class="titlebg">
        <img :src="imgsrc" class="title" ref="imgdom" alt="" />
        <span class="title">T</span>
        <span class="title">h</span>
        <span class="title">r</span>
        <span class="title">e</span>
        <span class="title">e</span>
      </div>
      <div class="titlebg1">
        <span class="title">房</span>
        <span class="title">间</span>
      </div>
    </div>
    <canvas id="canvasDom" ref="canvasDom"></canvas>
  </div>
</template>

<style scoped>
#canvasDom {
  width: 100vw;
  height: 100vh;
}

.titlebg,
.titlebg1 {
  position: fixed;
  z-index: 99999;
  display: inline-block;
  left: 24%;
  top: 40%;
  display: flex;
  font-size: 30px;
  color: white;
}

.titlebg1 {
  left: 71%;
}

img {
  width: 40px;
  height: 40px;
}
</style>
