precision mediump float;

// TODO 3.3)	Define a constant variable (uniform) to 
//              "send" the canvas size to all fragments.
uniform vec2 canvasSize;

void main(void)
{ 
	float smoothMargin = 0.01;  
	float r = 0.8;         
	 
	vec2 coord = 2.0 * gl_FragCoord.xy / canvasSize - 1.0;
	float distance = sqrt(pow(coord.x, 2.0) + pow(coord.y, 2.0));
	
	bool outsideCircle = distance > r;
	if(outsideCircle){
		discard;
	}
	
	
	if(distance > r-smoothMargin && distance < r){
		gl_FragColor = vec4(1.0, 85.0 / 255.0, 0.0, clamp(1.0 - (distance - r + smoothMargin)/smoothMargin, 0.0, 1.0));
	}else{
		gl_FragColor = vec4(1.0, 85.0 / 255.0, 0.0, 1.0);
	}
	
	
	
}