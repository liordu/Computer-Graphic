"use strict"

var darkgreen = [0, 127, 0, 255];
var lightgreen = [0, 255, 0, 255];
var white = [255, 255, 255, 255];

// n sets the number of angles theta used for discretizing the circle
var n = 1000;

function drawPixelwiseCircle(canvas) {
    let context = canvas.getContext("2d");
    let img = context.createImageData(200, 200);

	for (let r = 0; r <= 50; r += 1) {
	    for( let theta = 0; theta < 2 * Math.PI; theta += 2*Math.PI/n ){
	    	let [x, y] = convertPolorToCartesian(r, theta);
	    
	    	let point = (x+y*200)*4;
	    	setColor(img, point, lightgreen[0], lightgreen[1], lightgreen[2], lightgreen[3]);
	    
	    }
	}
	   
    context.putImageData(img, 0, 0);
}

function drawContourCircle(canvas) {
    let context = canvas.getContext("2d");
    let img = context.createImageData(200, 200);

	// basic circle
	for (let r = 0; r <= 50; r += 1) {
	    for( let theta = 0; theta < 2 * Math.PI; theta += 2*Math.PI/n ){
	    	let [x, y] = convertPolorToCartesian(r, theta);
	    
	    	let point = (x+y*200)*4;
	    	setColor(img, point, lightgreen[0], lightgreen[1], lightgreen[2], lightgreen[3]);
	    
	    }
	}
	
	// dark contour
	for (let r = 45; r <= 55; r += 1) {
	    for( let theta = 0; theta < 2 * Math.PI; theta += 2*Math.PI/n ){
	    	let [x, y] = convertPolorToCartesian(r, theta);
	    
	    	let point = (x+y*200)*4;
	    	setColor(img, point, darkgreen[0], darkgreen[1], darkgreen[2], darkgreen[3]);
	    
	    }
	}

    context.putImageData(img, 0, 0);
}

function drawSmoothCircle(canvas) {
    let context = canvas.getContext("2d");
    let img = context.createImageData(200, 200);
	
	// basic circle
	for (let r = 0; r <= 50; r += 1) {
	    for( let theta = 0; theta < 2 * Math.PI; theta += 2*Math.PI/n ){
	    	let [x, y] = convertPolorToCartesian(r, theta);
	    
	    	let point = (x+y*200)*4;
			setColor(img, point, lightgreen[0], lightgreen[1], lightgreen[2], lightgreen[3]);
	    
	    }
	}
	
	// dark contour
	for (let r = 45; r <= 55; r += 1) {
	    for( let theta = 0; theta < 2 * Math.PI; theta += 2*Math.PI/n ){
	    	let [x, y] = convertPolorToCartesian(r, theta);
	    
	    	let point = (x+y*200)*4;
			setColor(img, point, darkgreen[0], darkgreen[1], darkgreen[2], darkgreen[3]);
	    }
	}

	// inner antialiasing
	let new_color = new Array(4);
	for (let r = 44; r <= 45; r += 1) {
	    for( let theta = 0; theta < 2 * Math.PI; theta += 2*Math.PI/n ){
	    	let [x, y] = convertPolorToCartesian(r, theta);

			// compute actual distance of discrete pixel to center (not equal to radius)
	    	let dist = Math.sqrt((100-x)**2 + (100-y)**2);

			// compute relative normalized distance to the start of the transition border
			// values less than 0 or greater than 1 (these pixels lie outside of the transition border) will be set to the respective border value (0 or 1) to achieve the expected (non-transition) color
			let relative_dist = dist-44;
			relative_dist = relative_dist >= 0 ? relative_dist : 0;
			relative_dist = relative_dist <= 1 ? relative_dist : 1;

			// mix the colors dependent on the relative distance
	    	for(var i = 0; i < lightgreen.length; i++){
	    		new_color[i] = lightgreen[i] + (darkgreen[i] - lightgreen[i]) * relative_dist;
	    	}
	    
	    	let point = (x+y*200)*4;
	    	setColor(img, point, new_color[0], new_color[1], new_color[2], new_color[3]);
	    }
	}

	// outer antialiasing
	for (let r = 55; r <= 56; r += 1) {
	    for( let theta = 0; theta < 2 * Math.PI; theta += 2*Math.PI/n ){
	    	let [x, y] = convertPolorToCartesian(r, theta);

			// compute actual distance of discrete pixel to center (not equal to radius)
	    	let dist = Math.sqrt((100-x)**2 + (100-y)**2);

			// compute relative normalized distance to the start of the transition border
			// values less than 0 or greater than 1 (these pixels lie outside of the transition border) will be set to the respective border value (0 or 1) to achieve the expected (non-transition) color
			let relative_dist = dist-55;
			relative_dist = relative_dist >= 0 ? relative_dist : 0;
			relative_dist = relative_dist <= 1 ? relative_dist : 1;
	    
			// mix the colors dependent on the relative distance
	    	for(var i = 0; i < darkgreen.length; i++){
	    		new_color[i] = darkgreen[i] + (white[i] - darkgreen[i]) * relative_dist;
	    	}
	    
	    	let point = (x+y*200)*4;
	    	setColor(img, point, new_color[0], new_color[1], new_color[2], new_color[3]);
	    }
	}

    context.putImageData(img, 0, 0);
}


function setColor(img, point, red, blue, green, alpha){
	img.data[point] = red;
	img.data[point + 1] = blue;
	img.data[point + 2] = green;
	img.data[point + 3] = alpha;
}

function convertPolorToCartesian(r, theta){
	let x = Math.round(100 + Math.cos(theta)*r);
	let y = Math.round(100 + Math.sin(theta)*r);
	return [x, y];
}