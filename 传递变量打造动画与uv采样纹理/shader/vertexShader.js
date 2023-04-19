let vertexShader = `
precision mediump float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec2 v_uv;

varying float v_elevation;
//获取时间
uniform float u_time;



void main(){
    v_uv = uv;
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    modelPosition.z = sin((modelPosition.x+u_time) * 10.0)*0.1;
    modelPosition.z += sin((modelPosition.y+u_time) * 10.0) * 0.1;

    v_elevation = modelPosition.z;
    
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
`
export default vertexShader;