
attribute vec2 vVertex;
attribute vec3 vColor;

varying vec3 color;

void main(void)
{
	gl_Position = vec4(vVertex, 0.0, 1.0);
	color = vColor;

}