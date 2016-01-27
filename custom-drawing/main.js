/* Initialise variables */
var _screenWidth = 800;
var _screenHeight = 600;

/* Initialise Game Engine */
Crafty.init(_screenWidth, _screenHeight, document.getElementById('gamecanvas'));

/* Initialise Game Engine */
Crafty.init(_screenWidth, _screenHeight, document.getElementById('gamecanvas'));

/* Load Assets */
Crafty.background('rgb(0,0,0)');

Crafty.c("Cloud", {
    init: function () {
        this.requires("2D, Canvas");
        this.bind("Draw", this._draw_me);
        this.ready = true;
    },
    _draw_me: function (e) {
        var ctx = e.ctx;
        ctx.beginPath();
        ctx.moveTo(e.pos._x, e.pos._y);
        ctx.bezierCurveTo(e.pos._x-40, e.pos._y+20, e.pos._x-40, e.pos._y+70, e.pos._x+60, e.pos._y+70);
        ctx.bezierCurveTo(e.pos._x+80, e.pos._y+100, e.pos._x+150, e.pos._y+100, e.pos._x+170, e.pos._y+70);
        ctx.bezierCurveTo(e.pos._x+250, e.pos._y+70, e.pos._x+250, e.pos._y+40, e.pos._x+220, e.pos._y+20);
        ctx.bezierCurveTo(e.pos._x+260, e.pos._y-40, e.pos._x+200, e.pos._y-50, e.pos._x+170, e.pos._y-50);
        ctx.bezierCurveTo(e.pos._x+150, e.pos._y-75, e.pos._x+80, e.pos._y-60, e.pos._x+80, e.pos._y-30);
        ctx.bezierCurveTo(e.pos._x+30, e.pos._y-75, e.pos._x-20, e.pos._y-60, e.pos._x, e.pos._y);
        ctx.closePath();
        ctx.lineWidth = 3;
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = '#FFCCCC';
        ctx.stroke();
    }
});

var cloud = Crafty.e("Cloud, Motion").attr({x: 70, y: 50 });
cloud.velocity().y = 10;
var cloud2 = Crafty.e("Cloud, Motion").attr({x: 270, y: 50 });
cloud2.velocity().y = 20;
var cloud3 = Crafty.e("Cloud, Motion").attr({x: 470, y: 50 });
cloud3.velocity().y = 30;
