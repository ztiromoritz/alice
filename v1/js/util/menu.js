(function(global){
    var Menu = {};

    Menu = function(game){
        this.game = game;
        $('#menu #start').on('click', function(){
            game.state.start("play");
            $('#menu').hide();
        })
    }

    Menu.prototype.show = function(){
        $('#menu').show();
    };

    Menu.prototype.hide = function(){
        $('#menu').hide();
    };

    global.Menu = Menu;

})(this)
