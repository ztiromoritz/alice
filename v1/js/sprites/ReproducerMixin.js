(function(global) {


    var ReproducerMixin = {

        create: function(GID, startX, startY) {

            var mixin = {};
            var nextMode = 0;

            mixin.apply = function(constructor) {

                //StandardModes
                constructor.MODES = {};

                constructor.addMode = function(mode) {
                    constructor.MODES[mode] = nextMode++;
                }
                constructor.addMode('TEMPLATE');
                constructor.addMode('DRAG');
                constructor.addMode('IDLE');

                constructor.createNewTemplateMaster = function(game, group, gameObjects) {
                    var template = new constructor(game, startX + game.camera.x, startY, gameObjects);
                    template.templateMaster = true;

                    group.add(template);
                };

                constructor.prototype.storeAndReproduce = function() {
                    if (this.templateMaster) {
                        //first time
                        this.templateMaster = false;
                        this.constructor.createNewTemplateMaster(this.game, this.parent, this.gameObjects);
                        var gameObject = {
                            id : gameObjectId ++,
                            gid: GID,
                            x: this.x,
                            y: this.y,
                            properties: {
                                dialog: {
                                    text: 'TEXT'
                                }
                            }
                        };
                        this.gameObjects.push(gameObject);
                        this.gameObject = gameObject;
                    } else if (this.wasDragged) {
                        //every next time sprite was dragged
                        this.gameObject.x = this.x;
                        this.gameObject.y = this.y;
                    }
                    this.wasDragged = false;
                }



                constructor.prototype.collideWithToolbox = function() {
                    if (this.mode !== constructor.MODES.DRAG) {
                        if (this.mode !== constructor.MODES.TEMPLATE) {
                            this._xOffset = this.x;
                            this._cameraXOffset = this.game.camera.x;
                        }
                        this.mode = constructor.MODES.TEMPLATE;
                    }
                };

                constructor.prototype.enableDrag = function() {
                    // Also enable sprite for drag
                    this.inputEnabled = true;
                    this.input.enableDrag();
                    this.events.onDragStart.add(function() {
                        this.body.moves = false;
                        console.log('MODE:' + this.mode, constructor.MODES);
                        this.mode = constructor.MODES.DRAG;
                    }, this);
                    this.events.onDragStop.add(function() {
                        this.body.moves = true;
                        this.wasDragged = true;
                        this.mode = constructor.MODES.IDLE;
                    }, this);
                };

                constructor.prototype.checkDestroy = function() {
                    var self = this;
                    if (this.y > 1000) {


                        _.remove(this.gameObjects, function(value) {
                            return  (self.gameObject) && value.id === self.gameObject.id;
                        });

                        this.destroy();
                        return true;
                    }
                    return false;

                }




            };

            return mixin;
        }

    };


    global.ReproducerMixin = ReproducerMixin;

})(this)
