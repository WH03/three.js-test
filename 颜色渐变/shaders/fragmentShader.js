let fragmentShader =`
	varying vec3 vColor;
	void main(){
		  // gl_FragColor = vec4(0.3,0.3,0.5, 1.0);
		  gl_FragColor = vec4(vColor, 1.0);
	}
`
export default fragmentShader;