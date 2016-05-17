(function(global) {

    var BG_COLOR = "rgba(33, 0, 0, 1)";
    var CAGE_BG_COLOR = '#0aafe3';
    var SPRITE_OFFSET = 0;
    var SPRITE_COUNT = 16;
    var SPRITE_BREAK_AT = 8;
    var SPRITE_GAP = 2;

    var CAGE_WIDTH = 350;
    var CAGE_HEIGHT = 80;

    var MODES = {
        PEN: 0,
        ERASER: 1,
        HAND: 2
    };

    var Toolbox = function(game, parent, x, y, tilesize, width, height, map, gameObjects) {
        var self = this;
        var editMode = URL_PARAMS['edit'] === 'true';
        Phaser.Group.call(this, game, parent, 'Toolbox', false, false);
        this.x = x;
        this.y = y;
        this.game = game;
        this.tilesize = tilesize || {
            x: 32,
            y: 32
        };
        this.map = map;
        this.gameObjects = gameObjects;

        this.fixedToCamera = true;
        this.mode = MODES.HAND;
        this.currentTile = 8;

        //Background Box
        var box = this.game.add.bitmapData(width, height);
        box.ctx.fillStyle = BG_COLOR;
        box.ctx.fillRect(0, 0, width, height);

        this.boxSprite = game.add.sprite(0, 0, box);
        this.add(this.boxSprite);


        //Storage
        if(editMode){
            setInterval(function() {
                if (self.map) {
                    storage.storeMap(self.map, self.gameObjects);
                }
            }, 1500);
        }

        //
        //Tiles & Tools
        //
        this.allButtons = [];
        var maxX = 0;
        for (var i = SPRITE_OFFSET; i < SPRITE_OFFSET + SPRITE_COUNT; i++) {
            var x = 420 + tilesize.x + SPRITE_GAP * 4 + (i % SPRITE_BREAK_AT) * (this.tilesize.x + SPRITE_GAP);
            var y = 10 + Math.floor(i / SPRITE_BREAK_AT) * (this.tilesize.y + SPRITE_GAP);
            maxX = Math.max(maxX, x);
            var callback = function(index) {
                return function() {
                    var toolbox = self;
                    var button = this;
                    toolbox.clickSprite(index);
                    toolbox.resetButtons();
                    button.setSelected(true);
                };
            };
            var button = new IconButton(game, x, y, callback(i), null /*context is button itself*/ , "tileset", i);

            this.allButtons.push(button);
        }

        var clickHand = function() {
            return function() {
                var toolbox = self;
                var button = this;
                toolbox.mode = MODES.HAND;
                if (toolbox.handCallback) {
                    toolbox.handCallback(true);
                }
                toolbox.resetButtons();
                button.setSelected(true);
            }
        }();
        var hand = new IconButton(game, 10, 10, clickHand, null, "controls", 9);
        if (this.mode === MODES.HAND) {
            clickHand.apply(hand);
        }

        var clickEraser = function() {
            return function() {
                var toolbox = self;
                var button = this;
                toolbox.mode = MODES.ERASER;
                if (toolbox.handCallback) {
                    toolbox.handCallback(false);
                }
                toolbox.resetButtons();
                button.setSelected(true);
            }
        }();
        var eraser = new IconButton(game, 422, 10, clickEraser, null, "controls", 8);
        if (this.mode === MODES.ERASER) {
            clickEraser.apply(hand);
        }
        this.allButtons.push(eraser);
        this.allButtons.push(hand);


        //Play + EDIT
        var clickPlay = function() {
            console.log("click play");
            console.log(replaceQueryParam('edit', 'false', window.location.search));
            window.location.search = replaceQueryParam('edit', 'false', window.location.search);
            storage.storeMap(self.map, self.gameObjects);
          //  window.location.reload();
        }
        var play = new IconButton(game,
            750,
            10,
            clickPlay, null,
            "controls", 10);

        var clickEdit = function() {
            console.log("click edit");
          window.location.search = replaceQueryParam('edit', 'true', window.location.search);
          storage.storeMap(self.map, self.gameObjects);
          //window.location.reload();
        }
        var edit = new IconButton(game,
            750,
            10,
            clickEdit, null,
            "controls", 11);




        //The Cage
        /*░░░░░░░░░▄▄▄▄▄▄▄▄▄▄▄▄░░░░░░░░░░
        ░░░░░░░▄████████████████▄░░░░░░
        ░░░░░▄██▀░░░░░░░▀▀████████▄░░░░
        ░░░░▄█▀░░░░░░░░░░░░░▀▀██████▄░░
        ░░░░███▄░░░░░░░░░░░░░░░▀██████░
        ░░░▄░░▀▀█░░░░░░░░░░░░░░░░██████
        ░░█▄██▀▄░░░░░▄███▄▄░░░░░░██████
        ░▄▀▀▀██▀░░░░░▄▄▄░░▀█░░░░███████
        ▄▀░░░░▄▀░▄░░█▄██▀▄░░░░░████████
        █░░░░▀░░░█░░░▀▀▀▀▀░░░░░████████
        █░▄█▄░░░░░▄░░░░░░░░░░░░████████
        ██▀░░░░▀▀░░░░░░░░░░░░░███▀█████
        █▀░▄░░░░░░░░░░░░░░░░░░▀░░░█████
        █░░█▄█▀░▄░░██░░░░░░░░░░░█▄█████
        █░░░▀████▀░▀░░░░░░░░░░░▄▀██████
        █░░░░░░░░░░░░░░░░░░░░▀▄████████
        █░░▄░░░░░░░░░░░░░▄░░░██████████
        █░░░░░░░░░░░░░▄█▀░░▄███████████
        ██▄▄░░░░░░░░░▀░░░▄▀▄███████████*/
        (function(x, y) {
            var cageBackgroundBMD = self.game.add.bitmapData(CAGE_WIDTH, CAGE_HEIGHT);
            cageBackgroundBMD.ctx.fillStyle = CAGE_BG_COLOR;
            cageBackgroundBMD.ctx.fillRect(0, 0, CAGE_WIDTH, CAGE_HEIGHT);

            self.cageBGSprite = self.game.add.sprite(x, y, cageBackgroundBMD);


            self.cagefloor = self.game.add.tileSprite(x, y + CAGE_HEIGHT, CAGE_WIDTH, 4, "grey");
            self.game.physics.arcade.enable(self.cagefloor);
            self.cagefloor.body.setSize(CAGE_WIDTH, 4, 0, 0);
            self.cagefloor.body.moves = false;
            self.cagefloor.body.immovable = true;

        })(10 + 32 + SPRITE_GAP * 2, 10);



        if(editMode){
          _.forEach(this.allButtons, function(button){
            self.add(button);
          })
          this.add(play);
          this.add(this.cageBGSprite);
          this.add(this.cagefloor);

        }else{
          this.add(edit);
        }

        //Sprites (x,y) is relative to (his.x,this.y)
        this.setAllChildren("x", this.x, false, false, 1 /**Add*/ );
        this.setAllChildren("y", this.y, false, false, 1 /**Add*/ );
    };


    Toolbox.prototype = Object.create(Phaser.Group.prototype);
    Toolbox.prototype.constructor = Toolbox;

    Toolbox.prototype.activeToolAction = function(tilePos) {
        switch (this.mode) {
            case MODES.PEN:
                {
                    this.map.putTile(this.currentTile + 1, tilePos.x, tilePos.y, 0);
                    break;
                }
            case MODES.ERASER:
                {
                    this.map.putTile(null, tilePos.x, tilePos.y, 0);
                    break;
                }

            default:

        }

    };

    Toolbox.prototype.clickSprite = function(index) {
        this.mode = MODES.PEN;
        this.currentTile = index;
        if (this.handCallback) {
            this.handCallback(false);
        }
    }

    Toolbox.prototype.setHandCallback = function(callback) {
        this.handCallback = callback;
    }

    Toolbox.prototype.create = function() {

    };

    Toolbox.prototype.resetButtons = function() {
        _.forEach(this.allButtons, function(button) {
            button.setSelected(false);
        });
    };

    Toolbox.prototype.update = function() {
        this.debugInfo();
    };

    Toolbox.prototype.handIsSelected = function() {
        return (this.mode === MODES.HAND);
    }


    Toolbox.prototype.debugInfo = function() {
        if (this.game.config.enableDebug) {
            this.game.debug.body(this.cagefloor, 'rgba(255,255,0,0.6)');
        }
    };

    global.Toolbox = Toolbox;

})(this);
