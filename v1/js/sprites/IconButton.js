(function (global) {

    var IconButton = function (game,x, y, callback, context, iconSprite, iconFrame, group ){
        var self = this;

        Phaser.Group.call(this, game, null,'Button', false, false);
        this.game = game;

        this.background = this.game.add.sprite(x,y, iconSprite, iconFrame);
        this.button = this.game.add.button(x, y, "controls", callback, context, 0, 1, 2);
        this.button.forceOut = true;
        this.button.setSelected = function (selected){
            self.selected = selected;
            if(selected){
                    self.button.setFrames(4,5,6);
            }else{
                    self.button.setFrames(0,1,2);
self.button.forceOut = true;
            }
        }
        this.add(this.background);
        this.add(this.button);

        this.selected = false;

        this.setAllChildren("x",this.x,false,false,1 /**Add*/);
        this.setAllChildren("y",this.y,false,false,1 /**Add*/);

    };


    IconButton.prototype = Object.create(Phaser.Group.prototype);
    IconButton.prototype.constructor = IconButton;

    IconButton.prototype.create = function () {

    };

    IconButton.prototype.setSelected = function(selected){
        this.button.setSelected(selected);
    }

    IconButton.prototype.update = function () {

    };

    global.IconButton = IconButton;

})(this);
