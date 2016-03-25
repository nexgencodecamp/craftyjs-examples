/**
 * Concepts to teach
 *     Recursion
 *     for..loops
 *     components
 *     parameters
 */

/* GLOBAL STATE VARIABLES START WITH A __ */
var __gamePaused = false;
var __gameEnded = false;
var __gameHolding = true; /* The state before anything happens  */

var groundLayers = [];
var skyLayers = [];
var ceilingLayers = [];
var currentGroundLayer = 0;
var currentSkyLayer = 0;
var currentCeilingLayer = 0;
var _upperPipe, _lowerPipe, _upperPipeColumn, _lowerPipeColumn;
var _splash, _gameOverBoard, _replayButton;

var birdSpriteImages = {"sprites": {"img/bird.png": {tile: 34, tileh: 24, map: { bird_start: [0, 0], bird_end: [0, 3]}}}};
Crafty.load(birdSpriteImages);
Crafty.init(800, 600, document.getElementById('gamecanvas'));

Crafty.scene('Publisher', function() {
    Crafty.e("2D, Canvas, Image").image("img/publisher.png");
});

Crafty.defineScene("loading", function() {
    //Crafty.background("#000");
    Crafty.e("2D, DOM, Text")
          .attr({ w: 100, h: 20, x: 150, y: 120 })
          .text("Loading")
          .css({ "text-align": "center"})
          .textColor("#FFFFFF");
});

function load_scene(scene, duration) {
    Crafty.e("2D, Canvas, Tween, Color")
        .attr({alpha:0.0, x:0, y:0, w:800, h:600})
        .tween({alpha: 1.0}, duration)
        .bind("TweenEnd", function() {
            Crafty.scene(scene);
            Crafty.e("2D, Canvas, Tween, Color")
                 .attr({alpha:1.0, x:0, y:0, w:800, h:600})
                 .color("#000")
                 .tween({alpha: 0.0}, 4000)
                 .bind("TweenEnd", function(){

                    Crafty.e("2D, Canvas, Image").image("img/background.png");
                    Crafty.scene("square");
                 });
        });
}

Crafty.defineScene("square", function(attributes) {
    Crafty.background( 'url(img/background.png) no-repeat center center');
    /* Create all the layers on top of the background */
    createGroundLayer(0);
    createGroundLayer(1008);
    createSkyLayer(0);
    createSkyLayer(1104);
    createCeilingLayer(0);
    createCeilingLayer(928);

    /*Add player*/
    spawnBird();

    /* Kick it off! */
    startBackground();
    window.setInterval(checkBackground, 1000);

    /* Set Splash */
    setSplash();

    window.setInterval(createPipes, 3000);
});

load_scene('Publisher', 1000);

function setSplash(){
    _splash = Crafty.e("2D, Canvas, Image")
        .attr({x: 150, y: 200 })
        .image("img/splash.png");
}

function startBackground(){
    for(var i=0; i < groundLayers.length; i++){
        groundLayers[i].velocity().x = -50;
    }
    for(var j=0; j < skyLayers.length; j++){
        skyLayers[j].velocity().x = -20;
    }
    for(var k=0; k < ceilingLayers.length; k++){
        ceilingLayers[k].velocity().x = -50;
    }
}

function stopBackground(){
    for(var i=0; i < groundLayers.length; i++){
        groundLayers[i].velocity().x = 0;
    }
    for(var j=0; j < skyLayers.length; j++){
        skyLayers[j].velocity().x = 0;
    }
    for(var k=0; k < ceilingLayers.length; k++){
        ceilingLayers[k].velocity().x = 0;
    }
}

function stopPipeProduction(){
    Crafty.trigger("halt-pipe");
}

function checkBackground(){
    if(__gamePaused){
        return;
    }

    if(groundLayers[currentGroundLayer].x < -1008){
        /* Move the layer */
        groundLayers[currentGroundLayer].x = groundLayers[currentGroundLayer == 0 ? 1 : 0].x + 1008;
        /* Change the current layer */
        currentGroundLayer = currentGroundLayer == 0 ? 1 : 0 ;
    }
    if(skyLayers[currentSkyLayer].x < -1104){
        skyLayers[currentSkyLayer].x = skyLayers[currentSkyLayer == 0 ? 1 : 0].x + 1104;
        currentSkyLayer = currentSkyLayer == 0 ? 1 : 0 ;
    }
    if(ceilingLayers[currentCeilingLayer].x < -864){
        ceilingLayers[currentCeilingLayer].x = ceilingLayers[currentCeilingLayer == 0 ? 1 : 0].x + 864;
        currentCeilingLayer = currentCeilingLayer == 0 ? 1 : 0 ;
    }
}

function createGroundLayer(offset){
    var ground = Crafty.e("Ground, 2D, DOM, Image, Motion")
        .attr({x: offset, y: 488, z: 0, w: 1008, h: 112})
        .image("img/ground.png", "repeat-x");
    groundLayers.push(ground);
}

function createSkyLayer(offset){
    var sky = Crafty.e("2D, DOM, Image, Motion")
        .attr({x: offset, y: 379, z: 0, w: 1104, h: 109})
        .image("img/sky.png", "repeat-x");
    skyLayers.push(sky);
}

function createCeilingLayer(offset){
    var ceiling = Crafty.e("2D, DOM, Image, Motion")
        .attr({x: offset, y: 84, z: 0, w: 928, h: 16})
        .image("img/ceiling.png", "repeat-x");
    ceilingLayers.push(ceiling);
}

function spawnBird() {
    var currentYValue = 0;
    var bird = Crafty.e('2D, DOM, bird_start, AngularMotion, SpriteAnimation, Jumper, Gravity, Collision, Solid')
      .attr({x: 100, y: 300, z: 10 })
      .reel("fly", 500, [[0, 0], [0, 1], [0, 2], [0, 3]])
      .animate("fly", -1)
      .jumper(75, ['SPACE'])
      .bind("CheckJumping", function(ground){
        /* We do this because it would be false as the bird is 'jumping' in mid-air */
        if(__gameEnded){
            bird.canJump = false;
        }
        else if(__gameHolding){
            bird.canJump = false;
            /* Remove splash */
            _splash.destroy();

            /* Set gravitational const for bird */
            this.gravityConst(300);

            /* Set holding to false - will start pipe production */
            __gameHolding = false;
        }
        else{
            bird.canJump = true;
            bird.rotation = -30 ;
        }
      })
      .bind("Moved", function(o){
        if(o.oldValue > 435){
            bird.rotation = 90;
            bird.vrotation = 0;
            return;
        }
        bird.vrotation = 130;
      })
      .bind("reset-bird", function(){
        this.attr({x: 100, y: 300, z: 10 })
        .gravityConst(0);
        this.rotation = 0;
      })
      .gravity("Ground")
      .gravityConst(0)
      .onHit("Ground", function(o){
        haltGame();
      });
}

function createPipes(){
    if(__gamePaused || __gameEnded || __gameHolding)
        return;

    var heightOfUpperPipe = Math.floor(Math.random() * 100) + 30;
    var heightOfLowerPipe = Math.floor(Math.random() * 100) + 30;

    /* Create upper pipe */
    _upperPipe = Crafty.e("2D, DOM, Image, Motion")
        .attr({x: 450, y: 488 - heightOfUpperPipe - 26, z: 2, w: 52, h: 26})
        .image("img/pipe-up.png")
        .bind("EnterFrame", function(){
            if(this.x < -52)
                this.destroy();
        })
        .bind('halt-pipe', function(){
            this.velocity().x = 0;
        })
        .bind('clear-pipe', function(){
            this.destroy();
        })
        _upperPipe.velocity().x = -50;

    /* Create pipe in between */
    _upperPipeColumn = Crafty.e("2D, DOM, Image, Motion")
        .attr({x: 450, y: 488 - heightOfUpperPipe, z: 2, w: 52, h: heightOfUpperPipe})
        .image("img/pipe.png", "repeat-y")
        .bind("EnterFrame", function(){
            if(this.x < -52)
                this.destroy();
        })
        .bind('halt-pipe', function(){
            this.velocity().x = 0;
        })
        .bind('clear-pipe', function(){
            this.destroy();
        })
        _upperPipeColumn.velocity().x = -50;

    /* Create lower pipe */
    _lowerPipe = Crafty.e("2D, DOM, Image, Motion")
        .attr({x: 450, y: 100 + heightOfLowerPipe, z: 2, w: 52, h: 26})
        .image("img/pipe-down.png")
        .bind("EnterFrame", function(){
            if(this.x < -52)
                this.destroy();
        })
        .bind('halt-pipe', function(){
            this.velocity().x = 0;
        })
        .bind('clear-pipe', function(){
            this.destroy();
        })
        _lowerPipe.velocity().x = -50;

    /* Create pipe in between */
    _lowerPipeColumn = Crafty.e("2D, DOM, Image, Motion")
        .attr({x: 450, y: 100, z: 2, w: 52, h: heightOfLowerPipe})
        .image("img/pipe.png", "repeat-y")
        .bind("EnterFrame", function(){
            if(this.x < -52)
                this.destroy();
        })
        .bind('halt-pipe', function(){
            this.velocity().x = 0;
        })
        .bind('clear-pipe', function(){
            this.destroy();
        })
        _lowerPipeColumn.velocity().x = -50;
}

function haltGame(){
    if(__gameEnded)
        return;

    __gameEnded = true;
    stopBackground();
    stopPipeProduction();
    showGameOver();
    showReplay();
}

function showGameOver(){
    _gameOverBoard = Crafty.e("2D, DOM, Image")
        .attr({ x: 50, y: 150, z: 10})
        .image("img/scoreboard.png");
}

function showReplay(){
    _replayButton = Crafty.e("2D, DOM, Image")
        .attr({ x: 110, y: 360, z: 10 })
        .image("img/replay.png")
        .bind("KeyDown", function(event){
            if(event.keyCode === Crafty.keys.SPACE){
                /* We know that this is a game restart so... */
                restartGame();
            }
        });
}

function restartGame(){
    /* Remove the game over sign */
    _gameOverBoard.destroy();
    _replayButton.destroy();

    /* Flip the _gameEnded state */
    __gameEnded = false;
    __gameHolding = true;

    /* Reset Bird */
    Crafty.trigger('reset-bird');
    Crafty.trigger('clear-pipe');

    /* Set splash screen */
    setSplash();
}

/* Global KEY EVENTS */
Crafty.bind('KeyDown', function(event) {
    if(event.keyCode === Crafty.keys.P){
        __gamePaused = !__gamePaused;
        if(__gamePaused){
            stopBackground();
        }
        else{
            startBackground();
        }
    }
});
