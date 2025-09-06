// Fragment Shader
varying vec3 vPosition;
uniform vec3 uColor;

varying vec3 vNormal;

uniform float uTime;

void main() {
    //normal
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing)
        normal *= -1.0;

    float strips= mod((vPosition.y-uTime*0.05)*20.0, 1.0);
    strips =pow(strips, 3.0); // Adjust the intensity of the strips effect

    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnal = dot(viewDirection,normal)+1.0;
    fresnal = pow(fresnal,2.0);

      //FallOFF
    float FallOff=smoothstep(0.8,0.0,fresnal);

    float holograph = strips * fresnal;
    holograph += fresnal *1.25;
    holograph *=FallOff;

  

    gl_FragColor = vec4(uColor,holograph);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
