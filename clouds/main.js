/* Initialise variables */
var _screenWidth = 800;
var _screenHeight = 600;

/* Initialise Game Engine */
Crafty.init(_screenWidth, _screenHeight, document.getElementById('gamecanvas'));

/* Create assets */
var cloudSprite1 = {"sprites": {"img/cloud.png": {tile: 48, tileh: 26, map: {cloud1_start: [0, 0]}}}};
var cloudSprite2 = {"sprites": {"img/cloud2.png": {tile: 48, tileh: 26, map: {cloud2_start: [0, 0]}}}};
var cloudSprite3 = {"sprites": {"img/cloud1-big.png": {tile: 96, tileh: 52, map: {cloud3_start: [0, 0]}}}};

/* Load Assets */
Crafty.background('rgb(135, 206, 250)');
Crafty.load(cloudSprite1);
Crafty.load(cloudSprite2);
Crafty.load(cloudSprite3);


function spawnClouds(){
    var random_x = Math.floor((Math.random() * _screenWidth));
    Crafty.e('2D, Canvas, cloud'+Math.ceil(Math.random() * 3)+'_start, Gravity')
        .attr({x: random_x, y: -50 })
        .gravity()
        .gravityConst(Math.ceil(Math.random()*5));
}

Crafty.bind("EnterFrame", function() {
    if (Crafty.frame() % 25 === 0) {
        spawnClouds();
    }
});
