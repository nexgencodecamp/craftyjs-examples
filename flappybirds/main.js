/**
 * Concepts to teach
 *     Recursion
 *     for..loops
 *     components
 *     parameters
 */
var groundLayers = [];
var skyLayers = [];
var currentGroundLayer = 0;
var currentSkyLayer = 0;

Crafty.init(800, 600, document.getElementById('gamecanvas'));

Crafty.background( '#000000 url(img/background.png) no-repeat center center');

/* Create all the layers on top of the background */
createGroundLayer(0);
createGroundLayer(1008);
createSkyLayer(0);
createSkyLayer(1104);

/* Kick it off! */
startBackground();
window.setInterval(checkBackground, 1000);

function startBackground(){
    for(var i=0; i < groundLayers.length; i++){
        groundLayers[i].velocity().x = -50;
    }
    for(var j=0; j < skyLayers.length; j++){
        skyLayers[j].velocity().x = -20;
    }
}

function checkBackground(){
    if(groundLayers[currentGroundLayer].x < -1008){
        console.log("Move Layer...");
        /* Move the layer */
        //groundLayers[currentGroundLayer].velocity().x = 0;
        groundLayers[currentGroundLayer].x = groundLayers[currentGroundLayer == 0 ? 1 : 0].x + 1008;
        /* Change the current layer */
        currentGroundLayer = currentGroundLayer == 0 ? 1 : 0 ;
    }
    if(skyLayers[currentSkyLayer].x < -1104){
        //skyLayers[currentSkyLayer].velocity().x = 0;
        skyLayers[currentSkyLayer].x = skyLayers[currentSkyLayer == 0 ? 1 : 0].x + 1104;
        currentSkyLayer = currentSkyLayer == 0 ? 1 : 0 ;
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
