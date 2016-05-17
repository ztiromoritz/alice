(function (global) {



    var startPhaser = function() {
        var game = new Phaser.Game(800, 512 /*MAP*/ + 80 /*MINIMAP*/,
            Phaser.AUTO,
            'game',
            null,  //{preload: preload, create: create, update: update}
            false, //transparent
            false   //antialias
        );

        game.state.add("preload", PreloadState);
        game.state.add("menu", MenuState);
        game.state.add("play", PlayState);
        game.state.start("preload");
    };





    $.getJSON( "assets/tilemaps/32x32.json" , function( data ) {
        storage.decorateMap(data);
        global.JSON_MAP = data;
        startPhaser();
    });


})(this);
