precision mediump float;


varying vec3 color;

void main(void)
{

	float epsilon = 0.01;
	gl_FragColor = vec4(color, 1.0);
	
	bool distanceGreaterThanEpsilon = color.x > epsilon && color.y > epsilon && color.z > epsilon;
	if(distanceGreaterThanEpsilon){
		discard;
	}
	
}