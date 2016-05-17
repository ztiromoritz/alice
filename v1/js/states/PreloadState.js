(function(global){
    var PreloadState = function(game){
        Phaser.State.call(this);
    };

    PreloadState.prototype = Object.create(Phaser.State.prototype);

    PreloadState.prototype.preload = function(){
        //Settings
        this.game.stage.smoothed = false;
        this.game.config.enableDebug = URL_PARAMS['debug'];
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale(1, 1);
        this.game.time.advancedTiming = true;
        this.game.sound.mute = true;

        //Helper
        this.game.load.spritesheet('none', 'assets/1px.png', 1, 1);

        //Sprites
        this.game.load.spritesheet('player',        'assets/characters/alice/Alice.png', 92, 92);
        //this.game.load.spritesheet('player',        'assets/characters/player/charSprite.png', 32, 32);
        //this.game.load.spritesheet('enemy1',        'assets/characters/enemy1/enemy1.png', 32, 32);
        this.game.load.spritesheet('enemy1',        'assets/characters/enemy1/cards.png', 92, 92);
        this.game.load.spritesheet('bunny',        'assets/characters/bunny/bunny2.png', 32, 32);
        this.game.load.spritesheet('npc',           'assets/characters/npc/npcSprite.png', 64,96);
        this.game.load.spritesheet('checkpoint',    'assets/characters/checkpoint/checkpoint.png', 32, 32);

        this.game.load.image('grey', 'assets/buttons/grey.png');
        this.game.load.image('bg1', 'assets/background/bg1.png');
        this.game.load.image('bg2', 'assets/background/bg2.png');
        this.game.load.image('bg3', 'assets/background/bg3.png');

        //this.game.load.spritesheet('player',        'assets/characters/player/dummy.png', 16, 16);
        //this.game.load.spritesheet('enemy1',        'assets/characters/enemy1/dummy.png', 16, 16);
        //this.game.load.spritesheet('npc',           'assets/characters/npc/dummy.png', 16, 16);
        //this.game.load.spritesheet('checkpoint',    'assets/characters/checkpoint/dummy.png', 16, 16);


        //Buttons
        //this.game.load.spritesheet("startButton","assets/buttons/StartButton.png",128,40);
        //this.game.load.spritesheet("largeButton","assets/buttons/LargeButton.png",256,40);

        this.game.load.spritesheet("controls","assets/buttons/controls.png",32,32);

        //Map: Level und Tiles
        this.game.load.tilemap('map', null, JSON_MAP, Phaser.Tilemap.TILED_JSON);
        this.game.load.spritesheet('tileset', 'assets/tilemaps/tileset.png', 32, 32);
        //this.game.load.spritesheet('background_tiles2', 'assets/tilemaps/dummy.png', 16, 16);

        //Sounds & Music
        this.game.load.audio('jump',        'assets/sounds/jump.wav');
        this.game.load.audio('hit',         'assets/sounds/hit.wav');
        this.game.load.audio('checkpoint',  'assets/sounds/checkpoint.wav');

        //Fonts

        //font load hack!!
        this.game.add.text(0, 0, "fix", {font:"1px PressStart2P", fill:"#FFFFFF"});
        //this.game.load.bitmapFont('Parvas', 'assets/fonts/parvas_medium_12.PNG', 'assets/fonts/parvas_medium_12.xml');

        //Dialogs
        this.game.load.text('dialog1', 'assets/dialogs/dialog.twee');


        //Add Children here+
        var LINE_COLOR = "rgba(0, 0, 0, 0.3)";
        var tileBMD = this.game.add.bitmapData( 16, 16);
        tileBMD.ctx.fillStyle = LINE_COLOR;
        tileBMD.ctx.lineWidth = 3;
        tileBMD.ctx.moveTo(0,15);
        tileBMD.ctx.lineTo(0,0);
        tileBMD.ctx.lineTo(15,0);
        this.game.cache.addBitmapData('gridTile', tileBMD);


        this.game.load.onFileComplete.add(function (progress, key, success) {
            console.log(progress + '%', key + ' loaded', success);
        }, game);

        this.game.load.onLoadComplete.add(function(){
            //Post processing
            tweepee.addDialog("test", this.game.cache.getText('dialog1'));
        }, this);
    };

    PreloadState.prototype.create = function(){
        //this.game.state.start("play");


        this.game.state.start("play");
    };

    global.PreloadState = PreloadState;
})(this);
