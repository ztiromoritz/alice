(function(global){

    var EventZones = function(game,group,player){
        this.zones = [];
        this.game = game;
        this.group = group;
        this.player = player;
    };

    /**
     * Performes a delta between currentZones the player collides with and the zones from step before to
     * call only once on enter and leave a specific zone.
     *
     * Assumes arcade physics to be enabled
     *
     * @param enterCallback
     * @param leaveCallback
     */
    EventZones.prototype.handle = function (enterCallback, leaveCallback){
        var currentZones = [];
        this.game.physics.arcade.overlap(this.player, this.group, function (player, event) {
            currentZones.push(event.userData);
        });

        if(leaveCallback) {
            _.forEach(_.difference(this.zones, currentZones), function (zone) {
                leaveCallback(zone);
            });
        }

        if(enterCallback){
            _.forEach(_.difference(currentZones, this.zones), function(zone){
                enterCallback(zone);
            });
        }
        this.zones = currentZones;
    };

    global.EventZones = EventZones;

})(this);
