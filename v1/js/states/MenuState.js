(function(global){
    var MenuState = function(game){
        Phaser.State.call(this);
        this.menu = new Menu(game);
    };


    MenuState.prototype = Object.create(Phaser.State.prototype);

    MenuState.prototype.create = function(game){

        this.menu.show();
        /*
        this.game.stage.backgroundColor = '#0aafe3';
        var playButton = this.game.add.button(120,100,"startButton",this.startPlay,this,1,0);
        playButton.anchor.setTo(0.5,0.5);

        var creditsButton = this.game.add.button(120,170,"startButton",this.showCredits,this,3,2);
        creditsButton.anchor.setTo(0.5,0.5);

        new LabelButton(this.game,160,130,"largeButton","SETTINGS",null,this,1,0);
        */
    };

    MenuState.prototype.startPlay = function(){
        //this.game.state.start("play");
    };

    MenuState.prototype.showCredits = function(){
        //game.state.start("");
    };

    global.MenuState = MenuState;
})(this);
