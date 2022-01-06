"use strict";

/////////////////////////////
//////////   helper   ///////
/////////////////////////////
function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Triangle(pointA, pointB, pointC) {
    this.a = pointA;
    this.b = pointB;
    this.c = pointC;
}

function Viewport(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
}

function RenderTriangle(context, viewport, triangle, clear) {
    if (clear == undefined) clear = true;
    if (clear) {
        context.rect(viewport.x, viewport.y, viewport.width, viewport.height);
        context.stroke();
    }

    context.beginPath();
    context.moveTo(viewport.width * triangle.a.x + viewport.x, viewport.height * triangle.a.y + viewport.y);
    context.lineTo(viewport.width * triangle.b.x + viewport.x, viewport.height * triangle.b.y + viewport.y);
    context.lineTo(viewport.width * triangle.c.x + viewport.x, viewport.height * triangle.c.y + viewport.y);
    context.lineTo(viewport.width * triangle.a.x + viewport.x, viewport.height * triangle.a.y + viewport.y);
    context.fill();
}

function LinearTransformation(linearPart) {
    this.A = linearPart;
}

function ApplyLinearTransformation(linearTransf, point) {
    return new Point(linearTransf.A[0] * point.x + linearTransf.A[1] * point.y,
                     linearTransf.A[2] * point.x + linearTransf.A[3] * point.y)
}

function CompositeLinearTransformations(linearTransf2, linearTransf1) {
    return new LinearTransformation([linearTransf2.A[0] * linearTransf1.A[0] + linearTransf2.A[1] * linearTransf1.A[2], linearTransf2.A[0] * linearTransf1.A[1] + linearTransf2.A[1] * linearTransf1.A[3],
                                     linearTransf2.A[2] * linearTransf1.A[0] + linearTransf2.A[3] * linearTransf1.A[2], linearTransf2.A[2] * linearTransf1.A[1] + linearTransf2.A[3] * linearTransf1.A[3]]);
}

function AffineTransformation(linearPart, translPart) {
    this.A = linearPart;
    this.t = translPart;
}

function ApplyAffineTransformation(affineTransf, point) {
    return new Point(affineTransf.A[0] * point.x + affineTransf.A[1] * point.y + affineTransf.t[0],
                     affineTransf.A[2] * point.x + affineTransf.A[3] * point.y + affineTransf.t[1])
}


////////////////////////////
//////////   4a   //////////
////////////////////////////

function Basic4_1(canvas) {

    function Rotation(alpha) {
        return new LinearTransformation([Math.cos(alpha), - Math.sin(alpha), Math.sin(alpha), Math.cos(alpha)]);
    }

    function Scaling(scale) {
        return new LinearTransformation([scale, 0, 0, scale]);
    }

    function ShearingX(shearX) {
        return new LinearTransformation([1, shearX, 0, 1]);
    }

    let context = canvas.getContext("2d");
    context.clearRect(0, 0, 600, 150);
    context.font = "18px Arial";
    context.textAlign = "center";
    context.fillText("input triangle", 75, 140);
    let triangle = new Triangle(new Point(0.2, 0.2), new Point(0.8, 0.2), new Point(0.2, 0.8));
    RenderTriangle(context, new Viewport(150, 150, 0, 0), triangle, 'red');

    context.fillText("rotated triangle", 225, 140);
    let rot = Rotation(0.2);
    let triangleRot = new Triangle(ApplyLinearTransformation(rot, triangle.a),
                                    ApplyLinearTransformation(rot, triangle.b),
                                    ApplyLinearTransformation(rot, triangle.c));
    RenderTriangle(context, new Viewport(150, 150, 150, 0), triangleRot);

    context.fillText("scaled triangle", 375, 140);
    let scaling = Scaling(0.5);
    let triangleScaling = new Triangle(ApplyLinearTransformation(scaling, triangle.a),
                                        ApplyLinearTransformation(scaling, triangle.b),
                                        ApplyLinearTransformation(scaling, triangle.c));
    RenderTriangle(context, new Viewport(150, 150, 300, 0), triangleScaling);

    context.fillText("sheared triangle", 525, 140);
    let shearing = ShearingX(0.4);
    let triangleShearing = new Triangle(ApplyLinearTransformation(shearing, triangle.a),
                                        ApplyLinearTransformation(shearing, triangle.b),
                                        ApplyLinearTransformation(shearing, triangle.c));
    RenderTriangle(context, new Viewport(150, 150, 450, 0), triangleShearing);
}


////////////////////////////
//////////   4b   //////////
////////////////////////////

function Basic4_2(canvas) {

    function ShearingX(shearX) {
        return new LinearTransformation([1, shearX, 0, 1]);
    }

    function ShearingY(shearY) {
        return new LinearTransformation([1, 0, shearY, 1]);
    }

    let context = canvas.getContext("2d");
    context.clearRect(0, 0, 600, 150);
    context.font = "18px Arial";
    context.textAlign = "center";

    context.fillText("input triangle", 75, 140);
    let triangle = new Triangle(new Point(0.2, 0.2), new Point(0.8, 0.2), new Point(0.2, 0.8));
    RenderTriangle(context, new Viewport(150, 150, 0, 0), triangle);
    let alpha = 0.2;

    context.fillText("1. shearing", 225, 140);
    let triangle1a = ApplyLinearTransformation(ShearingX(- Math.tan(alpha/2)), triangle.a);
    let triangle1b = ApplyLinearTransformation(ShearingX(- Math.tan(alpha/2)), triangle.b);
    let triangle1c = ApplyLinearTransformation(ShearingX(- Math.tan(alpha/2)), triangle.c);
    let triangle1 = new Triangle(triangle1a, triangle1b, triangle1c);

    RenderTriangle(context, new Viewport(150, 150, 150, 0), triangle1);

    context.fillText("2. shearing", 375, 140);
    let triangle2a = ApplyLinearTransformation(ShearingY(Math.sin(alpha)), triangle1.a);
    let triangle2b = ApplyLinearTransformation(ShearingY(Math.sin(alpha)), triangle1.b);
    let triangle2c = ApplyLinearTransformation(ShearingY(Math.sin(alpha)), triangle1.c);
    let triangle2 = new Triangle(triangle2a, triangle2b, triangle2c);

    RenderTriangle(context, new Viewport(150, 150, 300, 0), triangle2);

    context.fillText("3. shearing", 525, 140);
    let triangle3a = ApplyLinearTransformation(ShearingX(- Math.tan(alpha/2)), triangle2.a);
    let triangle3b = ApplyLinearTransformation(ShearingX(- Math.tan(alpha/2)), triangle2.b);
    let triangle3c = ApplyLinearTransformation(ShearingX(- Math.tan(alpha/2)), triangle2.c);
    let triangle3 = new Triangle(triangle3a, triangle3b, triangle3c);

    RenderTriangle(context, new Viewport(150, 150, 450, 0), triangle3);
}


////////////////////////////
//////////   4c   //////////
////////////////////////////

function Basic4_3(canvas) {

    function CompositeAffineTransformations(affineTransf2, affineTransf1) {
        let newA = CompositeLinearTransformations(new LinearTransformation(affineTransf1.A), new LinearTransformation(affineTransf2.A));
        let newt = ApplyLinearTransformation(new LinearTransformation(affineTransf2.A), new Point(affineTransf1.t[0], affineTransf1.t[1]));
        return new AffineTransformation(newA.A, [newt.x + affineTransf2.t[0], newt.y + affineTransf2.t[1]]);

    }

    let context = canvas.getContext("2d");
    context.clearRect(0, 0, 600, 150);
    context.font = "18px Arial";
    context.textAlign = "center";

    let affineTransformation1 = new AffineTransformation([Math.cos(Math.PI / 12), -Math.sin(Math.PI / 12), Math.sin(Math.PI / 12), Math.cos(Math.PI / 12)], [0.3, 0.0]);
    let affineTransformation2 = new AffineTransformation([Math.cos(-Math.PI / 8), -Math.sin(-Math.PI / 8), Math.sin(-Math.PI / 8), Math.cos(-Math.PI / 8)], [0.0, 0.1]);
    let affineTransformation3 = CompositeAffineTransformations(affineTransformation2, affineTransformation1);

    context.fillText("input triangle", 75, 140);
    let triangle = new Triangle(new Point(0.05, 0.2), new Point(0.65, 0.2), new Point(0.05, 0.8));
    RenderTriangle(context, new Viewport(150, 150, 0, 0), triangle);

    context.fillText("1. transf.", 225, 140);
    let triangle1 = new Triangle(   ApplyAffineTransformation(affineTransformation1, triangle.a), 
                                    ApplyAffineTransformation(affineTransformation1, triangle.b), 
                                    ApplyAffineTransformation(affineTransformation1, triangle.c));
    RenderTriangle(context, new Viewport(150, 150, 150, 0), triangle1);

    context.fillText("1. then 2. transf.", 375, 140);
    let triangle2 = new Triangle(   ApplyAffineTransformation(affineTransformation2, triangle1.a), 
                                    ApplyAffineTransformation(affineTransformation2, triangle1.b), 
                                    ApplyAffineTransformation(affineTransformation2, triangle1.c));
    RenderTriangle(context, new Viewport(150, 150, 300, 0), triangle2);

    context.fillText("composite transf.", 525, 140);
    let triangle3 = new Triangle(   ApplyAffineTransformation(affineTransformation3, triangle.a), 
                                    ApplyAffineTransformation(affineTransformation3, triangle.b), 
                                    ApplyAffineTransformation(affineTransformation3, triangle.c));
    RenderTriangle(context, new Viewport(150, 150, 450, 0), triangle3);
}

