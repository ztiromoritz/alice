(function(global) {

    var Checkpoint = function(game, x, y, gameObjects) {
        Phaser.Sprite.call(this, game, x, y, 'checkpoint', 0);
        this.game = game;
        this.gameObjects = gameObjects;
        this.mode = Checkpoint.MODES.IDLE;
        game.physics.arcade.enable(this);
        this.body.setSize(16, 16, 0, 0);
        this.body.bounce.y = 0.2;
        this.body.gravity.y = 600;
        this.anchor.setTo(0.5, 1); //so it flips around its middle
        this.animations.add('up', [1, 2, 3, 4, 5, 6, 7, 8, 9], 25, true);
        this.triggered = false;
        this.sound = game.add.audio('checkpoint');


        this.enableDrag();


    };

    Checkpoint.prototype = Object.create(Phaser.Sprite.prototype);
    Checkpoint.prototype.constructor = Checkpoint;
    ReproducerMixin.create(68, 220, 10).apply(Checkpoint);

    Checkpoint.prototype.create = function() {

    };

    Checkpoint.prototype.update = function() {
        this.body.setSize(16, 16, 0, 0);
        switch (this.mode) {
            case Checkpoint.MODES.TEMPLATE:
                {
                    this.body.immovable = false;
                    this.body.moves = false;
                    //fixedToCamera manually
                    this.x = this._xOffset + this.game.camera.x - this._cameraXOffset;

                    break;
                }
            case Checkpoint.MODES.DRAG:
                {
                    this.body.immovable = true;
                    this.body.moves = false;

                    break;
                }
            case Checkpoint.MODES.IDLE:{
                if (this.body.onFloor())
                {
                    this.body.setSize(16, this.y-100, 0, 0);
                }
            }
            default:
        }
    };

    Checkpoint.prototype.trigger = function() {
        if (!this.triggered) {
            this.triggered = true;
            this.sound.play();
            this.animations.play('up', null, false);
        }
    }

    Checkpoint.prototype.collideWithWorld = function() {
        this.storeAndReproduce();
    };

    global.Checkpoint = Checkpoint;

})(this);
