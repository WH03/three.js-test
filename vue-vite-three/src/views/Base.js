import * as THREE from "three";
export default class Base{
    constructor(canvas){
         this.scene = new THREE.Scene();
         this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,3000);
		 this.camera.position.y = 0.8;
		 this.camera.position.z = 4.5;
		 this.camera.updateProjectionMatrix();
         this.renderer = new THREE.WebGLRenderer({canvas,antilas:true});
        //  设置渲染器的范围
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        // 设置像素比
        this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.shadowMap.enabled = true;
		// this.renderer.outputEncoding = THREE.sRGBEncoding;
    }
    // update(){
    //     // 绑定this，指向当前对象
    //     requestAnimationFrame(this.update.bind(this));
    //     this.renderer.render(this.scene,this.camera);
    // }
}