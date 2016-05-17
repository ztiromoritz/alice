(function (global) {

    var Background = function (game, parent, x, y) {
        Phaser.Group.call(this, game, parent,'Background', false, false);
        this.x = x;
        this.y = y;
        this.game = game;




        //==========
        //  Create our bitmapData which we'll use as our particle texture
/*
        var bmd = this.game.add.bitmapData(10, 10);

        var radgrad = bmd.ctx.createRadialGradient(5, 5, 1, 5, 5, 5);

        radgrad.addColorStop(0, 'rgba(1, 159, 98, 1)');
        radgrad.addColorStop(1, 'rgba(1, 159, 98, 0)');

        bmd.context.fillStyle = radgrad;
        bmd.context.fillRect(0, 0, 10, 10);

        //  Put the bitmapData into the cache
        this.game.cache.addBitmapData('particleShade', bmd);

        //  Create our emitter

        var emitter = this.game.add.emitter(this.game.world.centerX, 0, 5000);

        emitter.width =  360*32;

        //  Here is the important line. This will tell the Emitter to emit our custom MonsterParticle class instead of a normal Particle object.
        emitter.particleClass = MonsterParticle;

        emitter.makeParticles();

        emitter.minParticleSpeed.set(0, 50);
        emitter.maxParticleSpeed.set(0, 100);

        emitter.setRotation(0, 0);
        emitter.setScale(0.1, 1, 0.1, 1, 12000, Phaser.Easing.Quintic.Out);
        emitter.gravity = -200;

        emitter.angle =0;

        emitter.start(false, 5000, 100);*/
        //this.game.input.onDown.add(updateBitmapDataTexture, this);

        //=============


        //Add Children here,
        this.bg1 = this.game.add.tileSprite(0, 0, 11520, 512, 'bg1');
        this.bg2 = this.game.add.tileSprite(0, 0, 11520, 512, 'bg2');
        this.bg3 = this.game.add.tileSprite(0, 0, 11520, 512, 'bg3');

        this.add(this.bg1);
        //this.add(emitter);
        this.add(this.bg2);
        this.add(this.bg3);


        //Sprites (x,y) is relative to (his.x,this.y)
        this.setAllChildren("x",this.x,false,false,1 /**Add*/);
        this.setAllChildren("y",this.y,false,false,1 /**Add*/);

    };


    Background.prototype = Object.create(Phaser.Group.prototype);
    Background.prototype.constructor = Background;

    Background.prototype.create = function () {

    };

    Background.prototype.update = function () {
        this.bg1.x = Math.floor(this.game.camera.x / 10);
        this.bg2.x = Math.floor(this.game.camera.x / 50);
        this.bg3.x = Math.floor(this.game.camera.x / 1000);
    };

    global.Background = Background;

})(this);
