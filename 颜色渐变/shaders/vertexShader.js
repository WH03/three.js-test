let vertexShader = `
	varying vec3 vColor;
	// 接收传递的参数
	uniform vec3 upColor;
	uniform vec3 upColor2;
	uniform vec3 downColor;
	// 时间参数
	uniform float time;
	// 接收速度参数
	uniform float speed;
	void main(){
		  // vColor = vec3(0.8667,0.1529,0.1529);
		  // 计算颜色差值
		  vec3 dissColor = upColor2 - upColor;
		  // 修改立方体高度
		  vec3 transformed = position;
		  
		  vColor = downColor;
		  if(position.y>0.0){
			// vColor = vec3(0.9569,0.9541,0.945);
			// vColor = upColor;
			// vColor = upColor + dissColor * abs(cos(time));
			vColor = upColor + dissColor * sin(time);
			transformed.y -= cos(time)*speed;
		  }
		  // vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
		  vec4 viewPosition = modelViewMatrix * vec4(transformed, 1.0);
		  gl_Position = projectionMatrix * viewPosition;

	}
`
export default vertexShader;