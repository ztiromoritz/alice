(function(global) {

    var LINE_COLOR = "rgba(255, 0, 255, 0.4)";
    var MARKER_COLOR = "rgba(255, 100, 255, 0.4)";

    var Grid = function(game, parent, x, y, tilesize, width, height, toolbox) {
        var self = this;
        Phaser.Group.call(this, game, parent, 'Grid', false, false);
        this.x = x;
        this.y = y;
        this.tilesize = tilesize || {
            x: 32,
            y: 32
        };
        this.gridWidth = width;
        this.gridHeight = height;
        this.game = game;
        this.toolbox = toolbox;

        //Add Children here,
        var tileBMD = this.game.add.bitmapData(this.tilesize.x, this.tilesize.y);
        tileBMD.ctx.strokeStyle = LINE_COLOR;
        tileBMD.ctx.lineWidth = 1;
        //tileBMD.ctx.setLineDash([5, 15]);
        tileBMD.ctx.beginPath();
        tileBMD.ctx.moveTo(0, tilesize.y);
        tileBMD.ctx.lineTo(0, 0);
        tileBMD.ctx.lineTo(tilesize.x, 0);
        tileBMD.ctx.stroke();
        //Hack
        this.game.cache.addBitmapData('gridTile', tileBMD);



        var offsetY = 3 * tilesize.y
        this.tilesprite = game.add.tileSprite(0, 0 + offsetY, this.gridWidth + 1, this.gridHeight - offsetY + 1, tileBMD);
        this.add(this.tilesprite);
        this.tilesprite.inputEnabled = !toolbox.handIsSelected();
        this.toolbox.setHandCallback(function(hand) {
            if (hand) {
                self.tilesprite.inputEnabled = false;
            } else {
                self.tilesprite.inputEnabled = true;
            }
        });



        var markerBMD = this.game.add.bitmapData(this.tilesize.x, this.tilesize.y);
        markerBMD.ctx.fillStyle = MARKER_COLOR;
        markerBMD.ctx.fillRect(0, 0, this.tilesize.x, this.tilesize.y);
        this.markerSprite = this.game.add.sprite(0, 0, markerBMD);
        this.add(this.markerSprite);



        //var testSprite = game.add.sprite(0,0,tileBMD);

        //Sprites (x,y) is relative to (his.x,this.y)
        this.setAllChildren("x", this.x, false, false, 1 /**Add*/ );
        this.setAllChildren("y", this.y, false, false, 1 /**Add*/ );


    };


    Grid.prototype = Object.create(Phaser.Group.prototype);
    Grid.prototype.constructor = Grid;

    Grid.prototype.create = function() {

    };

    Grid.prototype.update = function() {
        var tilePos = this.getCurrentTilePos();
        if (tilePos) {
            this.markerSprite.x = tilePos.x * this.tilesize.x;
            this.markerSprite.y = tilePos.y * this.tilesize.y;

            if (this.game.input.mousePointer.isDown) {
                this.toolbox.activeToolAction(tilePos);
            }

        } else {
            this.markerSprite.x = -this.tilesize.x;
            this.markerSprite.y = -this.tilesize.y;
        }
    };

    Grid.prototype.getCurrentTilePos = function() {
        //FIX ME: pointerOver is buggy if you move faste over the edge.
        //Seems that the mouse has to be deteced once not over the sprite but over
        //any other part of the game. So something like a border could help.
        if (this.game.input.mousePointer && this.tilesprite.input && this.tilesprite.input.pointerOver()) {
            return {
                x: Math.floor(this.game.input.mousePointer.worldX / this.tilesize.x),
                y: Math.floor(this.game.input.mousePointer.worldY / this.tilesize.y)
            };
        }
        return null;
    }

    global.Grid = Grid;

})(this);
