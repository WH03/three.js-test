let strafeVertex = /*glsl*/ `
precision mediump float;
varying vec2 v_Uv;
void main(){
    v_Uv = uv;
    vec4 viewPosition = modelViewMatrix * vec4(position,1.0 );
    gl_Position = projectionMatrix * viewPosition;
}
`

export default strafeVertex;