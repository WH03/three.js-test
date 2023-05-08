let strafeFragment = /* glsl */ `
    precision mediump float;
    uniform float scale;
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 v_Uv;
    void main(){
        float dis = distance(v_Uv,vec2(0.5,0.5));
        float opacity = smoothstep(0.4*scale,0.5*scale,dis);
        // vec3 color = vec3(dis);
        // vec3 color = vec3(1.0)*opacity;
               // vec3 color = vec3(0.3,0.8,0.6)*opacity;
        vec3 disColor = color1 - color2;
        vec3 color = color2 + disColor * scale;
 

        if(dis>0.8*scale){
            discard;
        }
        gl_FragColor = vec4(color,dis);
    }

`
export default strafeFragment;