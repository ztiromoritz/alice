(function(global){



    var NPC = function(game, x , y, gameObjects, gameObject){
        var self = this;
        Phaser.Sprite.call(this, game, x, y, 'npc');
        this.gameObjects = gameObjects;

        this.gameObject = gameObject ;



        this.mode = NPC.MODES.IDLE;

        game.physics.arcade.enable(this);
        this.enableBody = true;
        this.body.gravity.y = 600;
        this.body.bounce.y = 0.2;
        this.body.setSize(100,76,-60,21);
        this.animations.add('idle', [0, 1], 3.5, true);
        this.animations.add('talky', [8, 9, 10, 11], 3.5, true);
        this.animations.add('talk', [2, 3], 3.5, true);
        this.anchor.setTo(0, 0);

        this.enableDrag();
    };

    NPC.prototype = Object.create(Phaser.Sprite.prototype);
    NPC.prototype.constructor = NPC;
    ReproducerMixin.create(66,140,-20).apply(NPC);
    NPC.addMode('TALKY');
    NPC.addMode('TALK');

    NPC.prototype.update = function () {
        if(this.checkDestroy()){
            return;
        }
        switch (this.mode) {
            case NPC.MODES.TEMPLATE:{
                this.body.immovable = false;
                this.body.moves = false;
                //fixedToCamera manually
                this.x = this._xOffset + this.game.camera.x  - this._cameraXOffset;
                this.animations.play('idle');
                break;
            }
            case NPC.MODES.DRAG:{
                this.body.immovable = true;
                this.body.moves = false;
                this.animations.play('idle');
                break;
            }
            case NPC.MODES.IDLE:{
                this.body.immovable = false;
                this.body.moves = true;
                this.animations.play('idle');
                break;
            }
            case NPC.MODES.TALKY:{
                this.body.immovable = false;
                this.body.moves = true;
                this.animations.play('talky');
                break;
            }
            case NPC.MODES.TALK:{
                this.body.immovable = false;
                this.body.moves = true;
                this.animations.play('talk');
                break;
            }
            default:
        }
    };

    NPC.prototype.modeClear = function(){
        if(this.mode == NPC.MODES.TALKY){
            this.mode = NPC.MODES.IDLE;
        }
    };

    NPC.prototype.playerIsNear = function(){
        if(this.mode == NPC.MODES.IDLE){
            this.mode = NPC.MODES.TALKY;
        }
    };

    NPC.prototype.startTalk = function() {
        console.log("start talk npc");
        if(this.mode == NPC.MODES.TALKY){
            this.mode = NPC.MODES.TALK;
            return this.gameObject.properties.dialog;
        }
    };

    NPC.prototype.stopTalk = function() {
        console.log("stop talk npc");
        if(this.mode == NPC.MODES.TALK){
            this.mode = NPC.MODES.TALKY;
        }
    };


    NPC.prototype.collideWithWorld = function(){
      this.storeAndReproduce();
    };



    global.NPC = NPC;

})(this);
