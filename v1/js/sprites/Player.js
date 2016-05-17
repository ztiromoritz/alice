(function(global) {

    var Vect = Garfunkel.Vect;

    var SPEED = 300;
    var JUMP = 600;
    var LADDER = 5;
    var GRAVITY = 1200;

    var MODES = {
        PLAY: 0,
        TALKY: 1,
        TALK: 2,
        RESPAWN: 3,
        DRAG: 4,
        LADDER: 5,
        BUNNY: 6
    };

    var Player = function(game, x, y, tileCollState) {
        Phaser.Sprite.call(this, game, x, y - 120, 'player');

        this.respawnPoint = new Vect(x, y);
        this.respawnMove = null;
        this.tileCollState = tileCollState || {};
        game.physics.arcade.enable(this);
        this.scale.x = 1; //flipped
        this.scale.y = 1;

        this.isBig = false;
        this.anchor.setTo(0.5, 0); //so it flips around its middle
        this.body.setSize(28, 80, 0, 12);
        this.body.bounce.y = 0.0;
        this.body.gravity.y = GRAVITY;
        this.body.collideWorldBounds = true;
        this.throwBunny = 0;

        //this.animations.add('walk', [0, 3], 10, true);
        /*this.animations.add('idle', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4], 10, true);
        this.animations.add('respawn', [2, 15], 10, true);
        this.animations.add('wiggle', [8,9,10,11],10,true);
        */
        this.animations.add('walk', [4,5], 10, true);
        this.animations.add('idle', [6,6,6,6,6,6,6,6,6,6,6,6,6,6,2], 10, true);
        this.animations.add('jump', [7], 10, true);
        this.animations.add('respawn', [0,15], 10, true);
        this.animations.add('wiggle', [0,], 10, true);
        this.body.mass = 1;
        this.game = game;

        this.cursors = game.input.keyboard.createCursorKeys();
        this.enableNormalControls();


        this.movementEnabled = true;
        this.mode = MODES.PLAY;
        this.canJump = true;
        this.currentNPC = null;

        //Up key must be released to re-jump
        this.cursors.up.onUp.add(function() {
            this.canJump = true;
        }, this);

        this.wasd.up.onUp.add(function() {
            this.canJump = true;
        }, this);

        //Dialog handling

        talk.init().onClose(this.stopTalk, this);

        this.hit = game.add.audio('hit');
        this.jump = game.add.audio('jump');


        // Also enable sprite for drag
        this.inputEnabled = true;
        this.input.enableDrag();

        this.events.onDragStart.add(function() {
            this.body.moves = false;
            this.mode = MODES.DRAG;
            this.movedByeMouse();
        }, this);
        this.events.onDragStop.add(function() {
            this.body.moves = true;
            this.mode = MODES.PLAY;
            this.movedByKey();
        }, this);


    };


    Player.prototype = Object.create(Phaser.Sprite.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.create = function() {

    };

    Player.prototype.enableNormalControls = function() {
        this.wasd = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
        };

        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.space.onDown.add(this.startTalk, this);

        this.game.input.keyboard.removeKey(Phaser.Keyboard.ESC);

    };

    Player.prototype.enableTalkControls = function() {

        this.game.input.keyboard.removeKey(Phaser.Keyboard.W);
        this.game.input.keyboard.removeKey(Phaser.Keyboard.S);
        this.game.input.keyboard.removeKey(Phaser.Keyboard.A);
        this.game.input.keyboard.removeKey(Phaser.Keyboard.D);
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);

        var esc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        esc.onDown.add(this.stopTalk, this);


    };


    Player.prototype.enableSPACE = function() {

    }

    Player.prototype.disableSpace = function() {}



    Player.prototype.onMoveByKeys = function(callback) {
        this.onMoveByKeysCallback = callback;
    };

    Player.prototype.movedByKey = function() {
        if (this.onMoveByKeysCallback) {
            this.onMoveByKeysCallback();
        }
    };

    Player.prototype.onMoveByMouse = function(callback) {
        this.onMoveByMouseCallback = callback;
    };

    Player.prototype.movedByeMouse = function() {
        if (this.onMoveByMouseCallback) {
            this.onMoveByMouseCallback();
        }
    };

    Player.prototype.update = function() {


        var idle = true;
        this.throwBunny = Math.max(0,this.throwBunny - 1)
        this.body.velocity.x = 0;
        this.body.immovable = false;
        this.body.move = true;
        this.body.gravity.y = GRAVITY;


        var ladderJump = this.wasLadder;
        this.wasLadder = false;

        if(this.space.isDown && this.currentBunny && this.throwBunny === 0 ){
            if(this.mode !== MODES.TALK){
                this.currentBunny.mode = Bunny.MODES.IDLE;
                this.currentBunny.body.velocity.x = -500 * -this.scale.x;
                this.currentBunny.body.velocity.y = -200;
                this.currentBunny.isBullet = true;
                this.currentBunny = null;
                this.throwBunny = 80;

            }
        }

        if(this.currentBunny){
            this.currentBunny.x = this.x + 30 * this.scale.x;
            this.currentBunny.y = this.y + 30;
            this.currentBunny.scale.x = Math.abs(this.currentBunny.scale.x) * Math.sign(this.scale.x);
        }

        switch (this.mode) {
            case MODES.PLAY:
                {

                    this.body.enable = true;
                    if (this.cursors.left.isDown || this.wasd.left.isDown) {
                        this.body.velocity.x = -SPEED;
                        if(this.body.onFloor() || this.body.touching.down) {
                            this.animations.play('walk');
                        }else{
                            this.animations.play('jump');
                        }

                        flipLeft(this);
                        idle = false;
                        this.movedByKey();
                    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
                        this.body.velocity.x = SPEED;
                        if(this.body.onFloor() || this.body.touching.down) {
                            this.animations.play('walk');
                        }else{
                            this.animations.play('jump');
                        }
                        flipRight(this);
                        idle = false;
                        this.movedByKey();

                    }
                    if ((this.cursors.up.isDown || this.wasd.up.isDown)) {

                        if (this.tileCollState.ladder) {
                            this.mode = MODES.LADDER;
                        } else if ((this.body.onFloor() || this.body.touching.down || ladderJump) && this.canJump) {
                            this.body.velocity.y = (!ladderJump) ? -JUMP : -JUMP / 3;
                            this.canJump = false;
                            this.jump.play();
                            idle = false;
                            this.movedByKey();
                        }
                    }
                    if(this.space.isDown && this.tileCollState.bunny && this.throwBunny === 0){
                        this.throwBunny = 30;
                        this.currentBunny = this.tileCollState.bunny;
                        this.currentBunny.mode = Bunny.MODES.TAKEN_BY_PLAYER;
                    }

                    break;

                }


            case MODES.TALK:
                {

                    this.body.enable = false;
                    //Nothing to move here
                    break;

                }

            case MODES.RESPAWN:
                {

                    this.body.enable = false;
                    this.animations.play('respawn');
                    idle = false;
                    if (this.respawnPoint.distance(new Vect(this.x, this.y)) < 30) {
                        this.mode = MODES.PLAY;
                        this.respawnMove = null;
                    } else {
                        if (!this.respawnMove) {
                            this.respawnMove = new Vect(this.x, this.y).sub(this.respawnPoint).normalize(10);
                        }
                        this.x -= this.respawnMove.x;
                        this.y -= this.respawnMove.y;
                    }
                    break;
                }

            case MODES.DRAG:
                {

                    this.animations.play('wiggle');
                    idle = false;
                    break;

                }

            case MODES.LADDER:
                {
                    this.body.enable = true;
                    this.body.immovable = true;
                    this.body.move = false;
                    this.body.gravity.y = 0;
                    this.wasLadder = true;

                    if (!this.tileCollState.ladder) {
                        this.mode = MODES.PLAY;
                    }

                    this.animations.play('idle');

                    if (this.cursors.left.isDown || this.wasd.left.isDown) {
                        this.x = this.x - LADDER;
                    }

                    if (this.cursors.right.isDown || this.wasd.right.isDown) {
                        this.x = this.x + LADDER;
                    }

                    if (this.cursors.up.isDown || this.wasd.up.isDown) {
                        this.y = this.y - LADDER;
                    }

                    if (this.cursors.down.isDown || this.wasd.down.isDown) {
                        this.y = this.y + LADDER;
                    }

                    break;
                }


            default:
                {
                    //noop

                }

        }

        //  Stand still
        if (idle ){
            if(this.body.onFloor() || this.body.touching.down) {
                this.animations.play('idle');
            }else{
                this.animations.play('jump');
            }
        }
    };

    /**Player.prototype.postUpdate = function(){
    console.log('player postUpdate');
};**/


    //var disableRestartTalk = false; //helper variable for timing
    Player.prototype.startTalk = function() {
        if (this.currentNPC && this.mode == MODES.PLAY) {


            //  this.input.enabled = false;
            var dialog = this.currentNPC.startTalk();
            if (dialog){
              this.mode = MODES.TALK;
              this.enableTalkControls();
              talk.show(dialog);
            }else{
              console.error('No dialog found for ID ' + dialog);
            }
        }
    };

    Player.prototype.stopTalk = function() {
        //  this.input.enabled = false;
        this.enableNormalControls();
        this.mode = MODES.PLAY;
        talk.hide();
        if (this.currentNPC) {
            this.currentNPC.stopTalk();
        }

        console.log('close callback', this.currentNPC);
    };

    Player.prototype.modeClear = function() {
        if (this.mode == MODES.PLAY) {
            this.currentNPC = null;
        }
    };

    Player.prototype.setCurrentNPC = function(npc) {
        this.currentNPC = npc;
    };

    Player.prototype.killMe = function() {
        this.hit.play();
        this.mode = MODES.RESPAWN;
    };

    Player.prototype.setRespawnPoint = function() {
        if (this.respawnPoint.x < this.x)
            this.respawnPoint.set(this.x, this.y-5);
    };



    global.Player = Player;

})(this);
