/**
 * Concepts to teach
 *     Recursion
 *     for..loops
 *     components
 *     parameters
 */
var groundLayers = [];
var skyLayers = [];
var ceilingLayers = [];
var currentGroundLayer = 0;
var currentSkyLayer = 0;
var currentCeilingLayer = 0;

var birdSpriteImages = {"sprites": {"img/bird.png": {tile: 34, tileh: 24, map: { bird_start: [0, 0], bird_end: [0, 3]}}}};

Crafty.init(800, 600, document.getElementById('gamecanvas'));

Crafty.background( '#000000 url(img/background.png) no-repeat center center');

/* Create all the layers on top of the background */
createGroundLayer(0);
createGroundLayer(1008);
createSkyLayer(0);
createSkyLayer(1104);
createCeilingLayer(0);
createCeilingLayer(928);

/* Kick it off! */
startBackground();
window.setInterval(checkBackground, 1000);
window.setInterval(createPipes, 3000);

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

function checkBackground(){
    if(groundLayers[currentGroundLayer].x < -1008){
        console.log("Move Layer...");
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
    var ground = Crafty.e("2D, DOM, Image, Motion")
        .attr({x: offset, y: 488, z: 2, w: 1008, h: 112})
        .image("img/ground.png", "repeat-x");
    groundLayers.push(ground);
}

function createSkyLayer(offset){
    var sky = Crafty.e("2D, DOM, Image, Motion")
        .attr({x: offset, y: 379, z: 2, w: 1104, h: 109})
        .image("img/sky.png", "repeat-x");
    skyLayers.push(sky);
}

function createCeilingLayer(offset){
    var ceiling = Crafty.e("2D, DOM, Image, Motion")
        .attr({x: offset, y: 84, z: 2, w: 928, h: 16})
        .image("img/ceiling.png", "repeat-x");
    ceilingLayers.push(ceiling);
}

function spawnBird() {
    var bird = Crafty.e('2D, Canvas, bird_start, SpriteAnimation, Multiway, Collision, Solid')
      .attr({x: 100, y: 300 })
      .reel("fly", 500, [[0, 0], [0, 1], [0, 2], [0, 3]])
      .animate("thrust", -1)
      .multiway(3, {SPACE: -90 })
      .bind("KeyDown",
          function(e) {
              if (e.key == Crafty.keys["SPACE"]) {}
          }
      );
}

function createPipes(){
    var heightOfUpperPipe = Math.floor(Math.random() * 100) + 30;
    var heightOfLowerPipe = Math.floor(Math.random() * 100) + 30;

    /* Create upper pipe */
    var upperPipe = Crafty.e("2D, DOM, Image, Motion")
        .attr({x: 450, y: 488 - heightOfUpperPipe - 26, z: 2, w: 52, h: 26})
        .image("img/pipe-up.png")
        .bind("EnterFrame", function(){
            if(this.x < -52)
                this.destroy();
        })
        .velocity().x = -50;

    /* Create pipe in between */
    var upperPipeColumn = Crafty.e("2D, DOM, Image, Motion")
        .attr({x: 450, y: 488 - heightOfUpperPipe, z: 2, w: 52, h: heightOfUpperPipe})
        .image("img/pipe.png", "repeat-y")
        .bind("EnterFrame", function(){
            if(this.x < -52)
                this.destroy();
        })
        .velocity().x = -50;

    /* Create lower pipe */
    var lowerPipe = Crafty.e("2D, DOM, Image, Motion")
        .attr({x: 450, y: 100 + heightOfLowerPipe, z: 2, w: 52, h: 26})
        .image("img/pipe-down.png")
        .bind("EnterFrame", function(){
            if(this.x < -52)
                this.destroy();
        })
        .velocity().x = -50;

    /* Create pipe in between */
    var lowerPipeColumn = Crafty.e("2D, DOM, Image, Motion")
        .attr({x: 450, y: 100, z: 2, w: 52, h: heightOfLowerPipe})
        .image("img/pipe.png", "repeat-y")
        .bind("EnterFrame", function(){
            if(this.x < -52)
                this.destroy();
        })
        .velocity().x = -50;
}
