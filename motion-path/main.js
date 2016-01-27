/* Initialise variables */
var _screenWidth = 800;
var _screenHeight = 600;

/* Initialise Game Engine */
Crafty.init(_screenWidth, _screenHeight, document.getElementById('gamecanvas'));


var square = Crafty.e('2D, Canvas, Color, Motion, AngularMotion');
square.attr({ x: 10, y: 10, w: 30, h: 30 }).color('red');
square.origin("center");

var vel = square.velocity();
console.log("vel: "+vel);
vel.x = 100;
vel.y = 1;

var acc = square.acceleration(); //returns the acceleration object
acc.y += 5;   // add to the acceleration in the x direction
