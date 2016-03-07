Crafty.init(800, 600, document.getElementById('gamecanvas'));

Crafty.background( '#000000 url(img/background.png) no-repeat center center');

for(var i=0; i<3; i++){
    createGroundLayer(336 * i);
}

function createGroundLayer(offset){
    var ground = Crafty.e("2D, DOM, Image, Motion")
        .attr({x: offset, y: 488, z: 2, w: 336, h: 112})
        .image("img/ground.png", "repeat-x")
        .bind("EnterFrame", function(){
            if(Math.floor(this.x) === -100){
                createGroundLayer(this.x + (336*3));
            }
            if(Math.floor(this.x) === -337){
                this.destroy();
            }
        })
        .velocity().x = -50;
}







