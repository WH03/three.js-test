let vertexShader = `
precision mediump float;
varying vec4 v_vPosition;
varying vec4 v_gPosition;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0 );
    v_vPosition = modelPosition;
    v_gPosition = vec4(position,1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
`

export default vertexShader;