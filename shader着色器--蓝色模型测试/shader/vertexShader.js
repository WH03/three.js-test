let vertexShader = /*glsl*/ `
precision mediump float;
varying vec4 v_vPosition;
varying vec4 v_gPosition;
varying vec2 v_Uv;
void main(){
    v_Uv = uv;
    vec4 modelPosition = modelMatrix * vec4(position,1.0 );
    v_vPosition = modelPosition;
    v_gPosition = vec4(position,1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
`

export default vertexShader;