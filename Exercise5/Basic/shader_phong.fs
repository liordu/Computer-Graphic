precision mediump float;

uniform mat4 cameraMatrixInverse;

uniform vec3 color;
uniform vec3 lightPosition;
uniform float shiny;

uniform bool ambient;
uniform bool diffuse;
uniform bool specular;


varying vec3 var_normal;
varying vec3 var_pos;


void main(void)
{

	// I_in and I_amb are white, so you can ignore them!
	vec3 k_amb = 0.3 * color;
	vec3 k_diff = 0.5 * color;
	vec3 k_spec = 0.4 * vec3(1, 1, 1);
	
	vec3 color_ambient, color_diffuse, color_specular;
	

	////////////////////////////////
    ////////  ambient term  ////////
    ////////////////////////////////
	color_ambient = k_amb;

	////////////////////////////////
	////////  diffuse term  ////////
	////////////////////////////////

	vec3 l = normalize(lightPosition - var_pos);
	color_diffuse = k_diff * clamp(dot(normalize(var_normal), l), 0.0, 1.0);
	
	/////////////////////////////////
	////////  specular term  ////////
	/////////////////////////////////
	
	
	vec4 camPosHom = cameraMatrixInverse * vec4(0.0, 0.0, 0.0, 1.0);
	vec3 camPos = vec3(camPosHom);

	vec3 v = normalize(camPos - var_pos);
	vec3 r = reflect(-v, normalize(var_normal));
	color_specular = k_spec * pow(clamp(dot(r, l), 0.0, 1.0), shiny);
	

	///////////////////////////////////
    ////////  resulting color  ////////
    ///////////////////////////////////
	vec3 color_result = vec3(0);
    if(ambient) color_result += color_ambient;
    if(diffuse) color_result += color_diffuse;
    if(specular) color_result += color_specular;
	gl_FragColor = vec4(color_result, 1.0);
}
