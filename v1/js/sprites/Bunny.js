(function (global) {
    var LEFT = true;
    var RIGHT = false;



    var Bunny = function (game, x, y, gameObjects) {
        y -= 1; //Hack Collision vs Tiled drop above the ground
        Phaser.Sprite.call(this, game, x, y, 'bunny');
        this.mode = Bunny.MODES.IDLE;
        this.gameObjects = gameObjects;


        this.animations.add('idle', [0], 4, true);
        this.animations.add('walk', [0, 1, 2, 3], 14, true);


        game.physics.arcade.enable(this);
        this.body.bounce.y = 0.2;
        this.body.gravity.y = 600;
        this.body.setSize(32, 32, 0, 0);

        this.scale.x = -1; //flipped
        this.anchor.setTo(0.5, 0);

        this.direction = RIGHT;
        this.game = game;

        // Also enable sprite for drag

        this.enableDrag();


    };

    Bunny.prototype = Object.create(Phaser.Sprite.prototype);
    Bunny.prototype.constructor = Bunny;
    ReproducerMixin.create(69,180,10).apply(Bunny);
    Bunny.addMode('WALK');

    Bunny.prototype.update = function () {
      switch(this.mode){
        case Bunny.MODES.TEMPLATE:{
          this.body.immovable = false;
          this.body.moves = false;
          //fixedToCamera manually
          this.x = this._xOffset + this.game.camera.x  - this._cameraXOffset;
          this.animations.play('idle');
          break;
        }
        case Bunny.MODES.DRAG:{
          this.body.immovable = true;
          this.body.moves = false;
          this.animations.play('idle');
          break;
        }
        case Bunny.MODES.IDLE: {
          this.body.immovable = false;
          this.body.moves = true;
          this.animations.play('idle');
          break;
        }
        case Bunny.MODES.WALK:{
          this.body.immovable = false;
          this.body.moves = true;
          this.animations.play('walk');
          if(this.direction === LEFT){
              this.body.velocity.x = -100;
              this.animations.play('walk');
              flipLeft(this);
          }else{
              this.body.velocity.x = 100;
              this.animations.play('walk');
              flipRight(this);
          }

          if(this.body.blocked.left) {
              this.direction = RIGHT;
          }else if(this.body.blocked.right){
              this.direction = LEFT;
          }
          break;
        }
      }
    };

    Bunny.prototype.collideWithWorld = function(){

      this.storeAndReproduce();

      if(this.mode !== Bunny.MODES.WALK){
        this.mode = Bunny.MODES.WALK;
      }
    };




    global.Bunny = Bunny;

})(this);
