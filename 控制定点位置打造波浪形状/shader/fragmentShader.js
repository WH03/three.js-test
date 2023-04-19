let fragmentShader = `
precision mediump float;

varying vec2 v_uv;
varying float v_elevation;

void main() {
    float height = v_elevation+0.05*10.0;
    gl_FragColor = vec4(1.0*height, 0.0,0.0, 1.0);
}
`
export default fragmentShader;
