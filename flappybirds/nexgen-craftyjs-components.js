/**
 * SideScrollPlatform is a component that turns part of an image into a scrolling
 * background.
 *
 */
Crafty.c("SideScrollPlatform", {
    /* Create an options object in 'init' to prevent it from being a shared object */
    options: null,

    /**
     * This function will be called when the component is added to an entity
     * So it sets up the things that both our entities had in common
     */
    init: function() {
        Crafty.loggingEnabled = true;
        Crafty.log("initialised component....");
        this.options = {};
    },

    /**
     *   This function will be called when the component is removed from an entity
     *   or right before entity is destroyed.
     *   Useful for doing custom cleanup.
     */
    remove: function() {
        Crafty.log('Scroll was removed!');
    },

    /**
     * setOptions should be the first method called on the component and
     * does what it says on the tin.
     * @param {Object} o - the initial set of options
     */
    setOptions: function(o){
        this.options.n = o.n;
        this.options.x = o.x;
        this.options.y = o.y;
        this.options.z = o.z;
        this.options.w = o.w;
        this.options.h = o.h;
        this.options.img = o.img;
        this.options.createNewComponentOffset = o.createNewComponentOffset;
        this.options.speed = o.speed;

        /* Remember to return this so that the client can 'chain' methods together */
        return this;
    },

    /**
     * Stitches together the component image in the x-axis
     * @return {Object}  return 'this' for chaining purposes
     */
    createComponents: function(){
        for(var i = 0; i < this.options.n; i++){
            this.__createGroundLayer(this.options.w * i);
        }
        return this;
    },

    /**
     * __createGroundLayer creates the entities needed to piece together the scrolling
     * background. When an entity goes offscreen stage left, it is destroyed. Entities
     * are generated stage right so there is a constant stream of them
     * @param  {Number} offset - the starting x position of the entity
     * @return {[type]}        [description]
     */
    __createGroundLayer: function(offset){
        var that=this;
        var ground = Crafty.e("2D, DOM, Image, Motion")
            .attr({ x: offset, y: that.options.y, z: that.options.z, w: that.options.w, h: that.options.h })
            .image(that.options.img, 'repeat-x')
            .bind("EnterFrame", function(){
                if(Math.floor(this.x) === that.options.createNewComponentOffset){
                    Crafty.log("calling __createGroundLayer()...");
                    that.__createGroundLayer(this.x + (that.options.w * that.options.n));
                }
                if(Math.floor(this.x) === -that.options.w - 1){
                    Crafty.log("Destroying entity...");
                    this.destroy();
                }
            })
            .velocity().x = that.options.speed;
    }
});
