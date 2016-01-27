/* Initialise variables */
var _screenWidth = 800;
var _screenHeight = 600;

/* Initialise Game Engine */
Crafty.init(_screenWidth, _screenHeight, document.getElementById('gamecanvas'));

/* Create assets */
var runningManSpriteImages = {"sprites": {"img/runningman.png": {tile: 108, tileh: 134, map: {man_start: [0, 0], man_end: [7, 0]}}}};

/* Initialise Game Engine */
Crafty.init(_screenWidth, _screenHeight, document.getElementById('gamecanvas'));

/* Load Assets */
Crafty.background('rgb(255,255,255)');
Crafty.load(runningManSpriteImages, spawnRunningMan);

function spawnRunningMan() {
    var ship = Crafty.e('2D, Canvas, man_start, SpriteAnimation, Multiway, Collision, Solid')
      .attr({x: 364, y: 300 })
      .reel("moveRight", 600, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]])
      .reel("moveLeft", 600, [[7, 1], [6, 1], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1], [0, 1]])
      .multiway(3, { RIGHT_ARROW: 0, LEFT_ARROW: 180 })
      .bind("KeyDown",
          function(e) {
              if (e.key == Crafty.keys.RIGHT_ARROW) {
                this.animate("moveRight", -1);
              }
              if (e.key == Crafty.keys.LEFT_ARROW) {
                this.animate("moveLeft", -1);
              }
          }
      )
      .bind("KeyUp",
        function(e){
          this.pauseAnimation();
          this.resetAnimation();
        }
      );
}

