
/////////////////////////
////////   4.3   ////////
/////////////////////////

/**
 * @param {number} index - linearized image index 
 * @param {number[][]} images - array of circle images
 * @param {number[]} alphas - respective alpha values
 * @returns {number[]} - triple [r,g,b] of resulting color, each in range [0,255]
 */
 function doAlphaBlending(index, images, alphas) {

    let color = [255, 255, 255];

    for(let i = 0; i < 4; i++){
        if(images[i][index+3] != 0){
            color[0] = (1-alphas[i])*color[0] + alphas[i] * images[i][index];
            color[1] = (1-alphas[i])*color[1] + alphas[i] * images[i][index+1];
            color[2] = (1-alphas[i])*color[2] + alphas[i] * images[i][index+2];
        }
        
    }
        
    return color;
}


function Basic3(canvas) {
    let alphas = [0.5, 0.5, 0.5, 0.5];

    // setup default values and event listeners
    let sliders = document.getElementsByName("alpha");
    for (let slider of sliders) {
        slider.addEventListener("change",onChangeAlpha);
        slider.value = 0.5;
    }
    let srcImages = document.getElementsByName("srcImage");
    for (let img of srcImages) {
        img.addEventListener("drop",drop);
        img.addEventListener("dragover",allowDrop);
        img.children[0].addEventListener("dragstart",drag);
    }

    // render
    render();

    function render() {
        let context = canvas.getContext("2d");
        let img = context.createImageData(canvas.width, canvas.height);

        let images = [getImageInContainer("div0"),
                      getImageInContainer("div1"),
                      getImageInContainer("div2"),
                      getImageInContainer("div3")];

        // walk over the canvas image and set the blended color for each pixel
        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                // compute the linearized index for the image data array
                let i = 4 * (x + canvas.width * y);
                // compute the blended color using the index, the four circle images and the alpha values
                let color = doAlphaBlending(i, images, alphas);
                // set the color accordingly, alpha value is always 255
                img.data[i] = color[0];
                img.data[i + 1] = color[1];
                img.data[i + 2] = color[2];
                img.data[i + 3] = 255;
            }
        }

        context.putImageData(img, 0, 0);
    }

    function getImageInContainer(container) {
        let image = document.getElementById(container).children[0];
        let c = document.createElement('canvas');
        c.width = canvas.width;
        c.height = canvas.height;
        canvas.getContext('2d').clearRect(0, 0, c.width, c.height);
        canvas.getContext('2d').drawImage(image, 0, 0, c.width, c.height);
        let data = canvas.getContext('2d').getImageData(0, 0, c.width, c.height).data;
        return data;
    }


    //////////////////////////
    ///// Event Listener /////
    //////////////////////////

    /**
     * @param {string} id - id ending in a single digit decimal number
     * @returns {number} single digit decimal number
     */
    function getIndex(id){ return -(-id[id.length-1]);  }

    function onChangeAlpha() {
        // expecting id "alpha0" to "alpha3"
        alphas[getIndex(this.id)] = this.value;
        render();
    }

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        ev.dataTransfer.setData("src", ev.target.id);
    }

    function drop(ev) {
        ev.preventDefault();
        let id = ev.dataTransfer.getData("src");

        let src = document.getElementById( id );
        let srcParent = src.parentNode;
        let tgt = ev.currentTarget.firstElementChild;

        // expecting id "div0" to "div4"
        let a = getIndex(srcParent.id);
        let b = getIndex(tgt.parentNode.id);

        let sliders = document.getElementsByName("alpha");
        let tmp = alphas[a];
        alphas[a] = alphas[b];
        sliders[a].value = sliders[b].value;
        alphas[b] = tmp;
        sliders[b].value = tmp;

        ev.currentTarget.replaceChild(src, tgt);
        srcParent.appendChild(tgt);

        render();
    }
}
