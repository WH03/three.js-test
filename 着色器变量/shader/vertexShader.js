let vertexShader = `
void main(){
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
}
`
export default vertexShader;