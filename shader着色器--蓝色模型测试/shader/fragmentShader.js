let fragmentShader = /*glsl*/ `
precision mediump float;
varying vec4 v_vPosition;
varying vec4 v_gPosition;
void main() {
    vec4 blueColor = vec4(0,0,0.8,1);
    vec4 blueColor2 = vec4(0,0.8,0.9,0.5);
    vec4 mixColor = mix(blueColor2,blueColor,v_gPosition.y/3.0);
        // gl_FragColor = vec4(mixColor.xyz,1.0);
        gl_FragColor= vec4(mixColor.xyz-(v_vPosition.y - 10.0)/100.0-0.1,1);
}
`;
export default fragmentShader;
