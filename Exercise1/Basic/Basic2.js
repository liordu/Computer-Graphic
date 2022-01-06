"use strict"

function drawArcCircle(canvas) {
  let context = canvas.getContext("2d");
   
  context.beginPath();
  context.arc(60, 60, 50, 0, 2 * Math.PI);
  context.fillStyle = 'rgb(0,255, 0)';
  context.fill();

  context.beginPath();
  context.arc(140, 140, 55, 0, 2 * Math.PI);

  context.fillStyle = 'rgb(0,127, 0)';
  context.fill();

  context.beginPath();
  context.arc(140, 140, 45, 0, 2 * Math.PI);
  context.fillStyle = 'rgb(0,255, 0)';
  context.fill();

}
