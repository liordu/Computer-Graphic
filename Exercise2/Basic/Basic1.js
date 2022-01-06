"use strict";

///////////////////////////
//// global variables  ////
///////////////////////////

// pixel scale
let pixelScale = 10;

// line
let line = new Line(    new Point( 10 / pixelScale,  10 / pixelScale),
                        new Point(180 / pixelScale, 180 / pixelScale),
                        new Color(0, 0, 0));

//////////////
//// gui  ////
//////////////

// event listener for gui
function onChangePixelScale(value) {
    // rescale line
    let s = pixelScale / value;
    line.startPoint.x = line.startPoint.x * s;
    line.startPoint.y = line.startPoint.y * s;
    line.endPoint.x = line.endPoint.x * s;
    line.endPoint.y = line.endPoint.y * s;
    // set new scaling factor
    pixelScale = value;
    // rerender scene
    RenderCanvas1();
}

function onMouseDownCanvas1(e) {
    let rect = document.getElementById("canvas1").getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    console.log("onMouseDownCanvas1: " + x + " " + y);

    // set new points
    if (e.ctrlKey) {
        line.endPoint.x = x / pixelScale;
        line.endPoint.y = y / pixelScale;
    } else {
        line.startPoint.x = x / pixelScale;
        line.startPoint.y = y / pixelScale;
    }

    // rerender image
    RenderCanvas1();
}


//////////////////////////////
//// bresenham algorithm  ////
//////////////////////////////

function bresenham(image, line) {
	// ensure integer coordinates
	let x0 = Math.floor(line.startPoint.x);
	let y0 = Math.floor(line.startPoint.y);
	let x1 = Math.floor(line.endPoint.x);
	let y1 = Math.floor(line.endPoint.y);

    customBresenham(image, x0, y0, x1, y1, false, 1);
}

function customBresenham(image, x0, y0, x1, y1, swapped, yStep){
    // custom function that can be used for recursive calls with extra parameters

    // in case x0 > x1
	if(x0 > x1){
        // recursive call with swapped start and end points
        customBresenham(image, x1, y1, x0, y0, swapped, yStep);
        return;
    }
    
    let m = (y1 - y0)/(x1 - x0);
    // in case |m| > 1
    if(Math.abs(m) > 1){
        // recursive call with swapped x and y
        customBresenham(image, y0, x0, y1, x1, true, yStep);
        return;
    }
    
    // in case m < 0
    if(m < 0){
        yStep = -yStep;      
    }
    simpleBresenham(image, x0, y0, x1, y1, swapped, yStep);
}

function simpleBresenham(image, x0, y0, x1, y1, swapped, yStep){
    // performs a simple bresenham algorithm with only minor adjustments for other octants
    // for standard octant use swapped=false, yStep=1

    // compute deltas and update directions
    let Dx = x1 - x0;
	let Dy = Math.abs(y1 - y0);
    let DDE = -2*Dy;
	let DDNE = 2*(Dx - Dy);

    // set initial coordinates
    let x = x0;
	let y = y0;

    // start loop to set nPixels
    let nPixels = Math.abs(x1-x0);
    let error = Dx - 2*Dy;
	for (let i = 0; i < nPixels; ++i) {
        // set pixel using the helper function setPixelS()
        if(!swapped){
            setPixelS(image, new Point(x, y), new Color(0, 0, 0), pixelScale);
        }else{
            setPixelS(image, new Point(y, x), new Color(0, 0, 0), pixelScale);
        }

        x = x + 1;
        
        // update error and coordinates depending on the error
        if(error < 0) {
            y = y + yStep;
            error = error + DDNE;
        }
        else{
            error = error + DDE; 
        }

	}
}


//////////////////////////
//// render function  ////
//////////////////////////

function RenderCanvas1() {
    // get canvas handle
    let context = document.getElementById("canvas1").getContext("2d");
    let canvas = context.createImageData(200, 200);

    // clear canvas
    clearImage(canvas, new Color(255, 255, 255));

    // draw line
    bresenham(canvas, line);

    // draw start and end point with different colors
    setPixelS(canvas, line.startPoint, new Color(255, 0, 0), pixelScale);
    setPixelS(canvas, line.endPoint, new Color(0, 255, 0), pixelScale);

    // show image
    context.putImageData(canvas, 0, 0);
}


function setupBresenham(canvas) {
    // execute rendering
    RenderCanvas1();
    // add event listener
    document.getElementById("canvas1").addEventListener('mousedown', onMouseDownCanvas1, false);
}
