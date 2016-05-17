(function(global) {
    var LEFT = true;
    var RIGHT = false;










    var Enemy1 = function(game, x, y, gameObjects) {
        y -= 1; //Hack Collision vs Tiled drop above the ground
        Phaser.Sprite.call(this, game, x, y, 'enemy1');
        this.mode = Enemy1.MODES.IDLE;
        this.gameObjects = gameObjects;

        this.animations.add('idle', [4], 4, true);
        this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7], 14, true);


        game.physics.arcade.enable(this);
        this.body.bounce.y = 0.2;
        this.body.gravity.y = 600;
        //this.body.setSize(32, 32, 0, 0);
        this.body.setSize(32, 67, 0, 25);

        //this.scale.x = -1; //flipped
        this.anchor.setTo(0.5, 0);

        this.direction = RIGHT;
        this.game = game;

        this.enableDrag();
    };

    Enemy1.prototype = Object.create(Phaser.Sprite.prototype);
    Enemy1.prototype.constructor = Enemy1;
    ReproducerMixin.create(67, 90, -20).apply(Enemy1);
    Enemy1.addMode('WALK');

    Enemy1.prototype.update = function() {
        if (this.checkDestroy()) {
            return;
        }
        switch (this.mode) {
            case Enemy1.MODES.TEMPLATE:
                {
                    this.body.immovable = false;
                    this.body.moves = false;
                    //fixedToCamera manually
                    this.x = this._xOffset + this.game.camera.x - this._cameraXOffset;
                    this.animations.play('idle');
                    break;
                }
            case Enemy1.MODES.DRAG:
                {
                    this.body.immovable = true;
                    this.body.moves = false;
                    this.animations.play('idle');
                    break;
                }
            case Enemy1.MODES.IDLE:
                {
                    this.body.immovable = false;
                    this.body.moves = true;
                    this.animations.play('idle');
                    break;
                }
            case Enemy1.MODES.WALK:
                {
                    this.body.immovable = false;
                    this.body.moves = true;
                    this.animations.play('walk');
                    if (this.direction === LEFT) {
                        this.body.velocity.x = -50;
                        this.animations.play('walk');
                        flipLeft(this);
                    } else {
                        this.body.velocity.x = 50;
                        this.animations.play('walk');
                        flipRight(this);
                    }

                    if (this.body.blocked.left) {
                        this.direction = RIGHT;
                    } else if (this.body.blocked.right) {
                        this.direction = LEFT;
                    }
                    break;
                }
        }
    };


    Enemy1.prototype.collideWithWorld = function() {

        this.storeAndReproduce();

        if (this.mode !== Enemy1.MODES.WALK) {
            this.mode = Enemy1.MODES.WALK;
        }
    };






    global.Enemy1 = Enemy1;

})(this);
