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
var __score = 0;
var __scoreImage, __scoreUnitsImage, __scoreTensImage, __scoreUnitsImageSmall, __scoreTensImageSmall;
var __hiScore;
var __HI_SCORE_KEY__ = 'nexgen::flappybirds::hiscore';

var groundLayers = [];
var ceilingLayers = [];
var skyLayers = [];
var currentGroundLayer = 0;
var currentSkyLayer = 0;
var currentCeilingLayer = 0;
var _upperPipe, _lowerPipe, _upperPipeColumn, _lowerPipeColumn;
var _splash, _gameOverBoard, _replayButton, _medal;
var _vxBackground = -100;
var _vxSky = -40;
var _bird;
var _hundredsSprite, _tensSprite, _unitsSprite;

var _medals = {
    BRONZE: 0,
    SILVER: 1,
    GOLD: 2,
    PLATINUM: 3
}

/* Load Sprites */
var birdSpriteImages = {"sprites": {"img/Penguin34px.png": {tile: 34, tileh: 34, map: { bird_start: [0, 0], bird_end: [3, 0]}}}};
Crafty.load(birdSpriteImages);

/* Load Sounds */
Crafty.audio.add("bird-jump", "sounds/sfx_wing.ogg");
Crafty.audio.add("pipe-hit", "sounds/sfx_hit.ogg");
Crafty.audio.add("bird-point", "sounds/sfx_point.ogg");
//Crafty.audio.add("bird-jump", "sounds/sfx_swooshing.ogg");
//Crafty.audio.add("bird-jump", "sounds/sfx_die.ogg");

Crafty.init(800, 600, document.getElementById('gamecanvas'));

Crafty.scene('Publisher', function() {
    Crafty.e("2D, Canvas, Image").image("img/publisher.png");
});

Crafty.defineScene("loading", function() {
    Crafty.background("#7e8dd5");
    Crafty.e("2D, DOM, Text")
          .attr({ w: 100, h: 20, x: 350, y: 500 })
          .text("Loading...")
          .css({ "text-align": "center"})
          .textColor("#3f62a1")
          .textFont({ size: '12px', weight: 'bold', family: 'Courier New' })
});

function load_scene(scene, duration) {
    Crafty.e("2D, Canvas, Tween, Color")
        .attr({alpha:1.0, x:0, y:0, w:800, h:600})
        .tween({alpha: 1.0}, duration)
        .bind("TweenEnd", function() {
            Crafty.scene(scene);
            Crafty.e("2D, Canvas, Tween, Color")
                 .attr({alpha:1.0, x:0, y:0, w:800, h:600})
                 .color("#000")
                 .tween({alpha: 0.0}, 3000)
                 .bind("TweenEnd", function(){
                    Crafty.enterScene("loading");
                    Crafty.e("2D, Canvas, Image,Tween, Color").image("img/ppSplashB.png")
                        .attr({alpha:0, x:0, y:0, w:800, h:600})
                        .tween({alpha: 1.0}, 4000)
                        .bind("TweenEnd", function(){
                            Crafty.enterScene("square");
                        });
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
    createCeilingLayer(0)
    createCeilingLayer(1008);
    createHiScore(fetchHiScore());

    /*Add player*/
    spawnBird();

    /* Kick it off! */
    startBackground();
    window.setInterval(checkBackground, 1000);

    /* Set Splash */
    setSplash();

    window.setInterval(createPipes, 1500);
});

load_scene('Publisher', 1000);

function setSplash(){
    _splash = Crafty.e("2D, DOM, Image")
        .attr({x: 150, y: 200, z: 20 })
        .image("img/splash.png");
}

function startBackground(){
    for(var i=0; i < groundLayers.length; i++){
        groundLayers[i].velocity().x = _vxBackground;
    }
    for(var j=0; j < skyLayers.length; j++){
        skyLayers[j].velocity().x = _vxSky;
    }
    for(var i=0; i < ceilingLayers.length; i++){
        ceilingLayers[i].velocity().x = _vxBackground;
    }
}

function stopBackground(){
    for(var i=0; i < groundLayers.length; i++){
        groundLayers[i].velocity().x = 0;
    }
    for(var j=0; j < skyLayers.length; j++){
        skyLayers[j].velocity().x = 0;
    }
    for(var i=0; i < ceilingLayers.length; i++){
        ceilingLayers[i].velocity().x = 0;
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
    if(ceilingLayers[currentCeilingLayer].x < -1008){
        /* Move the layer */
        ceilingLayers[currentCeilingLayer].x = ceilingLayers[currentCeilingLayer == 0 ? 1 : 0].x + 1008;
        /* Change the current layer */
        currentCeilingLayer = currentCeilingLayer == 0 ? 1 : 0 ;
    }
}

function createGroundLayer(offset){
    var ground = Crafty.e("Ground, 2D, DOM, Image, Motion")
        .attr({x: offset, y: 488, z: 9, w: 1008, h: 112})
        .image("img/groundCave.png", "repeat-x");
    groundLayers.push(ground);
}

function createSkyLayer(offset){
    var sky = Crafty.e("2D, DOM, Image, Motion")
        .attr({x: offset, y: 205, z: 0, w: 1104, h: 316})
        .image("img/sky404.png", "repeat-x");
    skyLayers.push(sky);
}

function createCeilingLayer(offset){
    var ceiling = Crafty.e("2D, DOM, Image, Motion, Solid")
        .attr({x: offset, y: 0, z: 9, w: 1008, h: 124})
        .image("img/ceilingCave.png", "repeat-x");
    ceilingLayers.push(ceiling);
}

function fetchHiScore(){
    /* Fetch Hi-Score */
    var hiScore = Crafty.storage(__HI_SCORE_KEY__);
    if(!hiScore){
        return -1;
    }
    else{
        return hiScore
    }
}

function createHiScore(hiScore){
    /* Delete previous hiscore if the images exist */
    if(_hundredsSprite)
        _hundredsSprite.destroy();
    if(_tensSprite)
        _tensSprite.destroy();
    if(_unitsSprite)
        _unitsSprite.destroy();

    var result;
    if(!hiScore){
        result = 0;
    }
    else{
        result = hiScore;
    }
    updateHiScoreOnGameBoard(result);
}

function spawnBird() {
    _bird = Crafty.e('2D, DOM, bird_start, AngularMotion, SpriteAnimation, Jumper, Gravity, Collision, Solid')
      .attr({x: 100, y: 300, z: 10 })
      .reel("fly", 500, [[0, 0], [1, 0], [2, 0], [3, 0]])
      .animate("fly", -1)
      .jumper(100, ['SPACE'])
      .bind("CheckJumping", function(ground){
        /* We do this because it would be false as the bird is 'jumping' in mid-air */
        if(__gameEnded){
            _bird.canJump = false;
        }
        else if(__gameHolding){
            _bird.canJump = false;
            /* Remove splash */
            _splash.destroy();

            /* Set gravitational const for bird */
            this.gravityConst(300);

            /* Set holding to false - will start pipe production */
            __gameHolding = false;

            /* Update the score as this is the beginning */
            updateScore(0);
        }
        else{
            _bird.canJump = true;
            _bird.rotation = -30 ;
            Crafty.audio.play('bird-jump',1,1);
        }
      })
      .bind("Moved", function(o){
        /* Make sure bird does not overrotate*/
        if(_bird._rotation >= 90)
            _bird.rotation = 90;
        _bird.vrotation = 60;

        /* Prevent bird moving past top of screen */
        if(_bird.y < 8)
            _bird.y = 8;
      })
      .bind("reset-bird", function(){
        this.attr({x: 100, y: 300, z: 10 })
        .gravityConst(0);
        this.rotation = 0;
        this.enableControl();
        this.wasHit = false;
      })
      .gravity("Ground")
      .gravityConst(0)
      .collision(new Crafty.polygon([9,9,  25,9,  25,25,  9,25]))
      .onHit("Ground", function(o){
        /* We do this because otherwise this event will be called again and again */
        if(__gameEnded)
            return;
        Crafty.audio.play('pipe-hit', 1, 1);
        this.vrotation = 0;
        this.velocity().x = 0;
        haltGame();
      })
      .checkHits('Solid')
      .bind("HitOn", function(hitData) {
        /* We hit something - death sequence follows */
        if(this.wasHit)
            return;

        stopPipeProduction();
        Crafty.audio.play('pipe-hit', 1, 1);
        this.disableControl();
        this.gravityConst(1000);
        this.vrotation = -90
        this.velocity().x = -100;
        this.velocity().y = -100;
        this.wasHit = true;
      });
}

function createPipes(){
    var pipeX = 850;
    var upperPipeY = 520
    var lowerPipeY = 100;

    if(__gamePaused || __gameEnded || __gameHolding || _bird.wasHit)
        return;

    var heightOfUpperPipe = Math.floor(Math.random() * 100) + 40;
    var heightOfLowerPipe = Math.floor(Math.random() * 100) + 40;

    /* Create upper pipe */
    _upperPipe = Crafty.e("PipeU, 2D, DOM, Image, Motion, Solid, Collision")
        .attr({x: pipeX, y: upperPipeY - heightOfUpperPipe - 67, z: 2, w: 98, h: 67})
        .image("img/column_up1.png")
        .collision(new Crafty.polygon([20,10,  50,5,  75,25,  97,75,  0,75]))
        .bind("EnterFrame", function(){
            /* Check if the pipe is offscreen and destroy it */
            if(this.x < -100)
                this.destroy();
            /* Check if the bird has caught up with this pipe */
            if(this.x <= 100 && this.pipePassed === undefined){
                updateScore(1);
                this.pipePassed = true;
                Crafty.audio.play('bird-point',1,1);
            }
        })
        .bind('halt-pipe', function(){
            this.velocity().x = 0;
        })
        .bind('clear-pipe', function(){
            this.destroy();
        })
        _upperPipe.velocity().x = _vxBackground;

    /* Create pipe in between */
    _upperPipeColumn = Crafty.e("PipeUC, 2D, DOM, Image, Motion, Solid")
        .attr({x: pipeX, y: upperPipeY - heightOfUpperPipe, z: 0, w: 98, h: heightOfUpperPipe})
        .image("img/column1.png", "repeat-y")
        .bind("EnterFrame", function(){
            if(this.x < -100)
                this.destroy();
        })
        .bind('halt-pipe', function(){
            this.velocity().x = 0;
        })
        .bind('clear-pipe', function(){
            this.destroy();
        })
        _upperPipeColumn.velocity().x = _vxBackground;

    /* Create lower pipe */
    _lowerPipe = Crafty.e("PipeL, 2D, DOM, Image, Motion, Solid, Collision")
        .attr({x: pipeX, y: _upperPipe.y - 175, z: 2, w: 98, h: 67})
        .image("img/column_down1.png")
        .collision(new Crafty.polygon([0,0,  97,0,  78,58,  50,65,  30,52]))
        .bind("EnterFrame", function(){
            if(this.x < -100)
                this.destroy();
        })
        .bind('halt-pipe', function(){
            this.velocity().x = 0;
        })
        .bind('clear-pipe', function(){
            this.destroy();
        })
        _lowerPipe.velocity().x = _vxBackground;

    /* Create pipe in between */
    _lowerPipeColumn = Crafty.e("PipeLC, 2D, DOM, Image, Motion, Solid")
        .attr({x: pipeX, y: lowerPipeY, z: 0, w: 98, h: _lowerPipe.y - 100})
        .image("img/column1.png", "repeat-y")
        .bind("EnterFrame", function(){
            if(this.x < -100)
                this.destroy();
        })
        .bind('halt-pipe', function(){
            this.velocity().x = 0;
        })
        .bind('clear-pipe', function(){
            this.destroy();
        })
        _lowerPipeColumn.velocity().x = _vxBackground;
}

function haltGame(){
    if(__gameEnded)
        return;

    __gameEnded = true;
    stopBackground();
    stopPipeProduction();
    showGameOver();
    showReplay();
    var hiScore = fetchHiScore();
    if(__score > hiScore){
        Crafty.storage(__HI_SCORE_KEY__, __score);
    }
}

function showGameOver(){
    var medal;
    _gameOverBoard = Crafty.e("2D, DOM, Image")
        .attr({ x: 50, y: 150, z: 10})
        .image("img/scoreboard.png");

    /* Give the user a medal if score warrants it */
    if(__score > 9 && __score < 20){
        medal = _medals.BRONZE;
    }
    else if(__score > 19 && __score < 31){
        medal = _medals.SILVER;
    }
    else if(__score > 30 && __score < 40){
        medal = _medals.GOLD;
    }
    else if(__score > 39){
        medal = _medals.PLATINUM;
    }

    if(medal !== undefined && medal > -1){
        _medal = Crafty.e("2D, DOM, Image")
            .attr({ x: 83, y: 265, z: 20})
            .image("img/medal_"+medal+".png");

    }
    updateScoreOnGameBoard();
}

function showReplay(){
    _replayButton = Crafty.e("btnReploy, 2D, DOM, Image, Mouse")
        .attr({ x: 110, y: 360, z: 10 })
        .image("img/replay.png")
        .css('cursor', 'pointer')
        .bind("Click", function(event){
            //if(event.keyCode === Crafty.keys.SPACE){
                /* We know that this is a game restart so... */
                restartGame();
            //}
        });
}

function restartGame(){
    /* Reset score */
    __score = 0;
    if(__scoreTensImage)
        __scoreTensImage.destroy();
    if(__scoreUnitsImage)
        __scoreUnitsImage.destroy();
    if(__scoreTensImageSmall)
        __scoreTensImageSmall.destroy();
    if(__scoreUnitsImageSmall)
        __scoreUnitsImageSmall.destroy();

    /* Remove the game over sign */
    _gameOverBoard.destroy();
    if(_medal) _medal.destroy();
    _replayButton.destroy();

    /* Flip the _gameEnded state */
    __gameEnded = false;
    __gameHolding = true;

    /* Reset Bird */
    Crafty.trigger('reset-bird');
    Crafty.trigger('clear-pipe');

    /* Set splash screen */
    setSplash();

    /* Reset Hi-Score */
    createHiScore(fetchHiScore());

    /* Start the background */
    startBackground();
}

function updateScoreOnGameBoard(){
    var tens = updateTens();
    var units = updateUnits();

    if(__scoreTensImageSmall)
        __scoreTensImageSmall.destroy();
    if(__scoreUnitsImageSmall)
        __scoreUnitsImageSmall.destroy();

    if(tens)
        __scoreTensImageSmall = Crafty.e("2D, DOM, Image").attr({x: 230, y: 256, z: 20}).image("img/font_small_"+ tens +".png");
    if(units >= 0)
        __scoreUnitsImageSmall = Crafty.e("2D, DOM, Image").attr({x: 246, y: 256, z: 20}).image("img/font_small_"+ units +".png");
}

function updateHiScoreOnGameBoard(hs){
    var hundreds, tens, units;
    hundreds = Math.floor(hs / 100);
    tens = (Math.floor(hs / 10) % 10);
    units = hs % 10;

    if(hundreds === 0 && tens === 0 && units === 0)
        return;

    if(hundreds > 0)
        _hundredsSprite = Crafty.e("Hundred, 2D, DOM, Image").attr({x: 10, y: 6, z: 20 }).image("img/font_big_"+hundreds+".png");
    if(hundreds > 0 || (hundreds === 0 && tens > 0))
        _tensSprite = Crafty.e("Ten, 2D, DOM, Image").attr({x: 35, y: 6, z: 20 }).image("img/font_big_"+tens+".png");

    _unitsSprite = Crafty.e("Unit, 2D, DOM, Image").attr({x: 60, y: 6, z: 20 }).image("img/font_big_"+units+".png");
}

function updateScore(delta){
    __score += delta;

    if(__scoreUnitsImage)
        __scoreUnitsImage.destroy();
    if(__scoreTensImage)
        __scoreTensImage.destroy();

    var tens = updateTens();
    var units = updateUnits();

    if(tens)
        __scoreTensImage = Crafty.e("2D, DOM, Image").attr({ x: 742, y: 6, z: 20 }).image("img/font_big_"+ tens +".png");
    if(units >= 0)
        __scoreUnitsImage = Crafty.e("2D, DOM, Image").attr({ x: 770, y: 6, z: 20 }).image("img/font_big_"+ units +".png");
};

function updateTens(){
    if(__score >= 10)
        return Math.floor(__score / 10 );
}

function updateUnits(){
    return __score % 10;
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

    /* Restart the game */
    if(event.keyCode === Crafty.keys.SPACE){
        if(!__gameEnded)
            return;

        /* The game has ended - restart it! */
        restartGame();
    }
});
