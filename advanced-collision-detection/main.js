/* Initialise variables */
var _screenWidth = 800;
var _screenHeight = 600;

/* Initialise Game Engine */
Crafty.init(_screenWidth, _screenHeight, document.getElementById('gamecanvas'));

/* Create assets */
var supertuxSpriteImages = {"sprites": {"img/tux.png": {tile: 46, tileh: 66, map: {tux_start: [0, 0]}}}};

/* Initialise Game Engine */
Crafty.init(_screenWidth, _screenHeight, document.getElementById('gamecanvas'));

/* Load Assets */
Crafty.background('rgb(255,255,255)');
Crafty.load(supertuxSpriteImages, spawnTux);

function spawnTux(){
  var tux = Crafty.e('2D, DOM, tux_start, SpriteAnimation, WiredHitBox, Collision')
    .attr({x: 364, y: 300 })
    .collision(new Crafty.polygon([16,4,30,4,45,65,10,65,10,40,15,20,3,18,3,15,13,12]))
    .onHit("Player", function(o){
      console.log("Tux was hit!");
      o[0].obj.color('#FF0000');
      //this.collision(new Crafty.polygon([10,10,30,10,30,30,10,30]));
    });

  console.log(tux.map.points);

  Crafty.e("2D, DOM, Color, Player, Fourway, Collision")
    .attr({w:10, h:10, x:300, y:300})
    .color("green")
    .fourway(40)
    .collision()
    .bind("HitOn", function(hitData) {
      Crafty.log("Collision with Solid entity occurred for the first time.");
    })
    .bind("HitOff", function(comp) {
      Crafty.log("Collision with Solid entity ended.");
    });

}


