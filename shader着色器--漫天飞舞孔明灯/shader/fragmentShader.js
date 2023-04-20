let fragmentShader =/*glsl*/ `
precision mediump float;
varying vec4 v_vPosition;
varying vec4 v_gPosition;
void main() {
    vec4 redColor = vec4(1,0,0.0,1);
    vec4 yellowColor = vec4(1,1,0,1);
    vec4 mixColor = mix(yellowColor,redColor,v_gPosition.y/3.0);
    if(gl_FrontFacing){
        gl_FragColor = vec4(mixColor.xyz-(v_vPosition.y - 20.0)/80.0-0.1,1);
    }else{
        gl_FragColor = vec4(mixColor.xyz,1.0);

    }
}
`;
export default fragmentShader;
