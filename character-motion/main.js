/* Initialise variables */
var _screenWidth = 800;
var _screenHeight = 600;
var _interval;
var _brakeFactor = 1.5;

/* Initialise Game Engine */
Crafty.init(_screenWidth, _screenHeight, document.getElementById('gamecanvas'));
Crafty.background('#000000');

var ship = Crafty.e('2D, Canvas, Color, Solid, Motion, AngularMotion')
            .attr({ x: 380, y: 560, w: 40, h: 40})
            .origin("center")
            .color("#00EE00")
            .bind("KeyDown", function(e){
              if(e.key === Crafty.keys.DOWN_ARROW){   /** BRAKE **/
                if(ship.isMoving){
                  _brakeFactor *= 3;
                }
              }
              if(e.key === Crafty.keys.UP_ARROW){ /** THRUST **/
                if(ship.isMoving){
                  ship.acceleration().y = 0;
                  ship.velocity().y = 0;
                  ship.isMoving = false;
                  if(_interval) window.clearInterval(_interval);
                }
                /* Work out acceleration vector from angle */
                ship.acceleration().y = -25
                ship.acceleration().x = 25 / (Math.tan((90-ship.rotation) * (Math.PI / 180)));
                ship.isMoving = true;
              }
              if(e.key === Crafty.keys.LEFT_ARROW){ ship.vrotation = -25; }
              if(e.key === Crafty.keys.RIGHT_ARROW){ ship.vrotation = 25; }
            })
            .bind("KeyUp", function(e){
              if(e.key === Crafty.keys.LEFT_ARROW || e.key === Crafty.keys.RIGHT_ARROW){
                console.log("Current rotation = "+this.rotation);
                ship.vrotation = 0;
              }
              if(e.key === Crafty.keys.UP_ARROW){
                _interval = window.setInterval(
                  function(){
                    slowToStop();
                  }, 1000);
              }
            })
            .bind("EnterFrame", function(e){
              if(this.y < -40){ this.y = 601; }
              if(this.y > 602){ this.y = -40; }
            });

function slowToStop(){
  console.log("velocity = "+ship.velocity().y);
  ship.acceleration().y = Math.abs(ship.acceleration().y / 2);
  ship.velocity().y = ship.velocity().y / _brakeFactor;
  if(ship.acceleration().y < 1){
    ship.acceleration().y = 0;
  }
  if(ship.velocity().y > -1 && ship.acceleration().y === 0){
    ship.velocity().y = 0;
    console.log("Stopping!")
    window.clearInterval(_interval);
    ship.isMoving = false;
  }
}





