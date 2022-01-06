precision mediump float;

attribute vec3 vVertex;
attribute vec3 vNormal;

uniform mat4 modelMatrix; // model matrix
uniform mat4 cameraMatrix; // camera matrix
uniform mat4 projectionMatrix; // projection matrix

uniform mat4 normalMatrix;


varying vec3 var_normal;


varying vec3 var_pos;



void main(void)
{
	mat4 MVP = projectionMatrix * cameraMatrix * modelMatrix;
	gl_Position = MVP * vec4(vVertex, 1);

	vec4 normal_hom = normalize(normalMatrix * vec4(vNormal, 0.0));
	var_normal = vec3(normal_hom);

	var_pos = vec3(modelMatrix * vec4(vVertex, 1.0));
	
}