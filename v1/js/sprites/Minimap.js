(function(global) {

    var DEFAULT_COLOR = 'rgba(255, 255, 255, 0.1)';
    var CAMERA_COLOR = 'rgba(255,100,30,0.3)';
    var PLAYER_COLOR = '#31a2f2';
    var NPC_COLOR = 'rgba(0,0,200,1.0)';
    var BG_COLOR = "rgba(33, 0, 0, 1)";

    var DRAG_MODE = {
        PLAYER_BECOME_MASTER: 0,
        PLAYER_IS_MASTER: 1,
        DRAG_IS_MASTER: 2,
    }

    var Minimap = function(game, parent, x, y, tilesize, minisize, map, layer, groups, player, camera) {
        Phaser.Group.call(this, game, parent, 'Minimap', false, false);
        var self = this;
        var editMode = URL_PARAMS['edit'] === 'true';
        this.x = x;
        this.y = y;
        this.counter = 0;
        this.tilesize = tilesize || {
            x: 16,
            y: 16
        };
        this.minisize = minisize || {
            x: 1,
            y: 2
        };
        this.ratio = {
            x: minisize.x / tilesize.x,
            y: minisize.y / tilesize.y
        };
        this.map = map;
        this.layer = layer;
        this.groups = groups;
        this.player = player;
        this.game = game;
        this.camera = camera;
        this.dragMode = DRAG_MODE.PLAYER_IS_MASTER;
        this.fixedToCamera = true;


        this.backgroundBMD = this.game.add.bitmapData(this.game.width, this.map.height * this.minisize.y);
        this.backgroundBMD.ctx.fillStyle = BG_COLOR;
        this.backgroundBMD.ctx.fillRect(0, 0, this.game.width, this.map.height * this.minisize.y);
        this.backgroundSprite = new Phaser.Sprite(this.game, 0, 0, this.backgroundBMD);

        //Add Children here,
        this.tileBMD = this.game.add.bitmapData(this.map.width * this.minisize.x, this.map.height * this.minisize.y);
        this.tileSprite = new Phaser.Sprite(this.game, 0, 0, this.tileBMD);
        this.redrawMap()

        this.dynamicBMD = this.game.add.bitmapData(this.map.width * this.minisize.x, this.map.height * this.minisize.y);
        this.dynamicSprite = new Phaser.Sprite(this.game, 0, 0, this.dynamicBMD);

        var cameraBMD = this.game.add.bitmapData(this.camera.width * this.ratio.x, this.camera.height * this.ratio.y);
        cameraBMD.ctx.fillStyle = CAMERA_COLOR;
        cameraBMD.ctx.fillRect(0, 0, this.camera.width * this.ratio.x, this.camera.height * this.ratio.y);
        this.cameraSprite = new Phaser.Sprite(this.game, 0, 0, cameraBMD);
        this.cameraSprite.inputEnabled = true;
        this.cameraSprite.input.allowVerticalDrag = false;
        this.cameraSprite.input.enableDrag();
        this.cameraSprite.events.onDragStart.add(function() {
            this.dragMode = DRAG_MODE.DRAG_IS_MASTER;
        }, this);
        this.player.onMoveByKeys(function() {
            //console.log("onMoveByKeys",self.dragMode);
            if (self.dragMode === DRAG_MODE.DRAG_IS_MASTER) {
                self.dragMode = DRAG_MODE.PLAYER_BECOME_MASTER;
            }
        });
        this.player.onMoveByMouse(function() {
            self.dragMode = DRAG_MODE.DRAG_IS_MASTER;
        });



        this.add(this.backgroundSprite);
        if (editMode) {

            this.add(this.tileSprite);
            this.add(this.dynamicSprite);
            this.add(this.cameraSprite);
        }

        //Sprites (x,y) is relative to (his.x,this.y)
        this.setAllChildren("x", this.x, false, false, 1 /**Add*/ );
        this.setAllChildren("y", this.y, false, false, 1 /**Add*/ );

    };


    Minimap.prototype = Object.create(Phaser.Group.prototype);
    Minimap.prototype.constructor = Minimap;

    Minimap.prototype.create = function() {

    };

    Minimap.prototype.drawSprite = function(sprite, color) {
        this.dynamicBMD.ctx.fillStyle = color || NPC_COLOR;
        this.dynamicBMD.ctx.fillRect(
            Math.floor(sprite.x * this.ratio.x),
            Math.floor(sprite.y * this.ratio.y),
            this.minisize.x,
            this.minisize.y
        );
    };

    Minimap.prototype.redrawMap = function() {
        this.tileBMD.ctx.clearRect(0, 0, this.tileBMD.width, this.tileBMD.height);
        for (y = 0; y < this.map.height; y++) {
            for (x = 0; x < this.map.width; x++) {
                var tile = this.map.getTile(x, y, this.layer);
                if (tile) {
                    //var properties = getTileProperties(tile.index,this.map);
                    if (tile.properties.color) {

                        this.tileBMD.ctx.fillStyle = tile.properties.color;
                    } else {
                        this.tileBMD.ctx.fillStyle = DEFAULT_COLOR;
                    }
                    this.tileBMD.ctx.fillRect(x * this.minisize.x, y * this.minisize.y, this.minisize.x, this.minisize.y);
                }
            }
        }
        this.tileBMD.dirty = true;
    }



    Minimap.prototype.update = function() {
        var self = this;
        //Update Camera
        switch (this.dragMode) {

            case DRAG_MODE.DRAG_IS_MASTER:
                this.game.camera.target = null;
                //this.game.camera.reset();

                this.camera.x = this.cameraSprite.x / this.ratio.x;
                break;

            case DRAG_MODE.PLAYER_BECOME_MASTER:
                var target = Math.max(0, this.player.x - (this.camera.width / 2));
                var distance = this.camera.x - target;
                var abs = Math.abs(distance);
                var sign = Math.sign(distance);
                if (abs < 30) {
                    this.dragMode = DRAG_MODE.PLAYER_IS_MASTER;
                } else {
                    this.camera.x = this.camera.x - sign * abs / 5;
                    this.cameraSprite.x = this.camera.x * this.ratio.x;
                }
                break;
            case DRAG_MODE.PLAYER_IS_MASTER:
                this.game.camera.follow(this.player);
                this.cameraSprite.x = this.camera.x * this.ratio.x;
                break;
            default:
        }

        //Update dynamic
        this.dynamicBMD.ctx.clearRect(0, 0, this.dynamicBMD.width, this.dynamicBMD.height);
        this.drawSprite(this.player, PLAYER_COLOR);
        _.forEach(this.groups, function(group) {
            group.forEach(function(sprite) {
                self.drawSprite(sprite, sprite.minimapColor);
            });
        });
        this.dynamicBMD.dirty = true;

        this.counter = (this.counter + 1) % 60

        if (this.counter === 0) {
            this.redrawMap();
        }

    };

    global.Minimap = Minimap;

})(this);
