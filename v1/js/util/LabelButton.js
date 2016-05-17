(function(global){

    var LabelButton = function(game, x, y, key, label, callback,
        callbackContext, overFrame, outFrame, downFrame, upFrame){
            Phaser.Button.call(this, game, x, y, key, callback,
            callbackContext, overFrame, outFrame, downFrame, upFrame);
            //Style how you wish...
            this.style = {
                'font': '20px PressStart2P',
                'fill': 'black' };
            this.anchor.setTo( 0.5, 0.5 );
            this.label = new Phaser.Text(game, 0, 0, label, this.style);
            //puts the label in the center of the button
            this.label.anchor.setTo( 0.5, 0.5 );
            this.addChild(this.label);
            this.setLabel( label );
            //adds button to game
            game.add.existing( this );};

    LabelButton.prototype = Object.create(Phaser.Button.prototype);

    LabelButton.prototype.constructor = LabelButton;

    LabelButton.prototype.setLabel = function( label ) {
        this.label.setText(label);
    };

    global.LabelButton = LabelButton;

})(this);
