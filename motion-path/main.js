/* Initialise variables */
var _screenWidth = 800;
var _screenHeight = 600;
var points = [];
var loopDone = false;

/* Initialise Game Engine */
Crafty.init(_screenWidth, _screenHeight, document.getElementById('gamecanvas'));

var shipSpriteImages = {"sprites": {"img/galaga-ship.png": {tile: 47, tileh: 50, map: {ship_start: [0, 0]}}}};
Crafty.load(shipSpriteImages);

var ship = Crafty.e('2D, Canvas, ship_start, SpriteAnimation, Color, Motion, AngularMotion')  ;
ship.attr({ x: 300, y: 300, rotation: 180})
  .reel("thrust", 500, [[0, 0]])
  .animate("thrust", -1)
  .origin("center");

var plots = 300;
var increase = Math.PI * 2 / plots;
var angle = 0;
var x,y;

for( var i = 0; i < plots; i++ ) {
  x = 200 * Math.cos( angle ) + 200;
  y = 200 * Math.sin( angle ) + 200;
  r = Math.atan2( y - 200, x - 200 ) * 180/Math.PI;
  points.push([x, y, r]);
  angle += increase;
}
loopDone = true;
x = points[0][0];
y = points[0][1];

var j=points.length/2;
Crafty.bind("EnterFrame", function(){
  if(!loopDone)
    return;

  if(Crafty.frame() % 1 === 0 && j > 10){
    ship.attr({ x: points[j][0], y: points[j][1], rotation: points[j][2] /*+ 180*/ });
    j--;
  }
});







// var v = ship.velocity();
// v.x=50;
// v.y=25;
// var counter = 0;
// var increase = Math.PI * 2 / 400;

// for ( i=0, j=0; i <= 2; i += 0.01, j++ ) {
//   var x = i;
//   var y = Math.sin( counter ) / 2 + 0.5;
//   //var y = Math.pow(counter,3)*2 + (3*counter);
//   var r = 0;
//   if (i > 0){
//     r = Math.atan((y - points[j-1][1])/(x - points[j-1][0])) * 180/Math.PI;
//     r += 90;
//   }
//   points.push([x, y, r]);
//   console.log("Added "+counter+" points.");
//   counter += increase;
// }
// loopDone = true;

// var j=0;
// Crafty.bind("EnterFrame", function(){
//   if(!loopDone)
//     return;

//   if(Crafty.frame() % 2 === 0 && j < 300){
//     console.log("x: "+Math.ceil(points[j][0]*1) + ", y: "+Math.ceil(points[j][1] * 1) + ", r: "+ points[j][2]);
//     ship.attr({ x: points[j][0] * 200, y: points[j][1] * 200  , rotation: points[j][2] });
//     j++;
//   }
//});
