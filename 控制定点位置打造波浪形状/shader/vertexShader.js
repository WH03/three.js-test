let vertexShader = `
precision mediump float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec2 v_uv;

varying float v_elevation;



void main(){
    v_uv = uv;
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    modelPosition.z = sin(modelPosition.x * 10.0)*0.1;
    modelPosition.z += sin(modelPosition.y * 10.0) * 0.1;

    v_elevation = modelPosition.z;
    
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
`
export default vertexShader;