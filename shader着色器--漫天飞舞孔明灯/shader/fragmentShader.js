let fragmentShader = `
precision mediump float;
varying vec4 v_vPosition;
varying vec4 v_gPosition;
void main() {
    // vec4 redColor = vec4(0,0,0.7,1);
    // vec4 yellowColor = vec4(0,0,1,1);

    vec4 blueColor = vec4(0,0,0.78,1);
    vec4 blueColor2 = vec4(0,0,0.9,1);
    // vec4 mixColor = mix(blueColor2,blueColor,v_gPosition.y/3.0);
    vec4 mixColor = mix(blueColor2,blueColor,v_gPosition.y/3.0);

    // gl_FragColor = vec4(mixColor.rbg,1.0);
    gl_FragColor = vec4(mixColor.xyz,1.0);
}
`;
export default fragmentShader;
