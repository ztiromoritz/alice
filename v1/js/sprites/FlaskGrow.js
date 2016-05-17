(function(global) {

    var FlaskGrow = function(game, x, y, gameObjects, grow) {
        Phaser.Sprite.call(this, game, x, y, 'flask', (grow)?0:1);
        this.game = game;
        this.gameObjects = gameObjects;
        this.mode = FlaskGrow.MODES.IDLE;
        game.physics.arcade.enable(this);
        this.body.setSize(16, 16, 0, 0);
        this.body.bounce.y = 0.2;
        this.body.gravity.y = 600;
        this.anchor.setTo(0.5, 1); //so it flips around its middle
        this.animations.add('up', [1, 2, 3, 4, 5, 6, 7, 8, 9], 25, true);
        this.triggered = false;
        this.sound = game.add.audio('FlaskGrow');


        this.enableDrag();


    };

    FlaskGrow.prototype = Object.create(Phaser.Sprite.prototype);
    FlaskGrow.prototype.constructor = FlaskGrow;
    ReproducerMixin.create(68, 280, 10).apply(FlaskGrow);

    FlaskGrow.prototype.create = function() {

    };

    FlaskGrow.prototype.update = function() {
        if(this.checkDestroy()){
            return;
        }
        this.body.setSize(16, 16, 0, 0);
        switch (this.mode) {
            case FlaskGrow.MODES.TEMPLATE:
                {
                    this.body.immovable = false;
                    this.body.moves = false;
                    //fixedToCamera manually
                    this.x = this._xOffset + this.game.camera.x - this._cameraXOffset;

                    break;
                }
            case FlaskGrow.MODES.DRAG:
                {
                    this.body.immovable = true;
                    this.body.moves = false;

                    break;
                }
            case FlaskGrow.MODES.IDLE:{
                if (this.body.onFloor())
                {
                    this.body.setSize(16, this.y-100, 0, 0);
                }
                break;
            }
            default:
        }
    };

    FlaskGrow.prototype.trigger = function() {
        if (!this.triggered) {
            this.triggered = true;
            this.sound.play();
            this.animations.play('up', null, false);
        }
    }

    FlaskGrow.prototype.collideWithWorld = function() {
        this.storeAndReproduce();
    };

    global.FlaskGrow = FlaskGrow;

})(this);
