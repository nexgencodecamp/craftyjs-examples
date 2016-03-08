/**
 * Concepts to teach
 *     Recursion
 *     for..loops
 *     components
 *     parameters
 */
Crafty.init(800, 600, document.getElementById('gamecanvas'));

Crafty.background( '#000000 url(img/background.png) no-repeat center center');

/* Create the scrolling ground */
Crafty.e("SideScrollPlatform")
    .setOptions({
        n: 3, x: 336, y: 488, z: 2, w: 336, h: 112,
        img: "img/ground.png",
        createNewComponentOffset: -100,
        speed: -60
    })
    .createComponents();

/* Create the scrolling sky */
Crafty.e("SideScrollPlatform")
    .setOptions({
        n: 3, x: 276, y: 379, z: 2, w: 276, h: 109,
        img: "img/sky.png",
        createNewComponentOffset: -10,
        speed: -20
    })
    .createComponents();


