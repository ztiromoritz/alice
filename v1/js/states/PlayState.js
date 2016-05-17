(function(global) {


    var explosionParticle = function(game, x, y, key, frame) {
        Phaser.Particle.call(this, game, x, y, key, frame);
    }

    explosionParticle.prototype = Object.create(Phaser.Particle.prototype);
    explosionParticle.prototype.constructor = explosionParticle;
    explosionParticle.prototype.onEmit = function() {
        this.animations.add('explsion', Phaser.Animation.generateFrameNames("explosion_", 1, 11, ".png", 10));
        this.animations.play('explosion', 20, false, true);
    }

    //  Player explosion
    var playExplosionAdvanced = function(game,x, y) {
        emitter = game.add.emitter(x, y, 3);
        emitter.particleClass = explosionParticle;
        emitter.makeParticles('enemy1');
        emitter.width = 20;
        emitter.height = 20;
        emitter.minParticleScale = 0.2;
        emitter.maxParticleScale = 0.4;
        emitter.minParticleSpeed.set(0, 2);
        emitter.maxParticleSpeed.set(0, 6);
        emitter.gravity = -100;
        emitter.start(false, 2000, 50, 6);
    }


    var EVENT_TYPES = {
        dialog: "dialog",
        respawn: "respawn"
    };


    var TILESIZE = {
        x: 32,
        y: 32
    };

    var PlayState = function() {
        Phaser.State.call(this);
        this.dialog = {
            reset: function() {
                this.name = null;
                this.npcId = null;
                this.currentNode = null;
            }
        };
        this.dialog.reset();

        this.map = null; //The tiled Map
        this.tileLayer = null; //TileLayer
        this.platforms = null; //Group for Platform Objects
        this.npcs = null; //Group for NPC Sprites
        this.enemies = null; //Group for Enemy Sprites
        this.checkpoints = null; //Group for Checkoints
        this.player = null; //The Player sprite
        this.eventZones = null;

        this.tileCollState = {
            ladder: false,
            bunny: false
        };

    };

    PlayState.prototype = Object.create(Phaser.State.prototype);

    PlayState.prototype.create = function() {
        var self = this;
        var editMode = URL_PARAMS['edit'] === 'true';
        //config/gloabl stuff
        this.game.stage.backgroundColor = '#111111'; /*'#0aafe3'*/
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.map = this.game.add.tilemap('map');

        if (URL_PARAMS.test) {
            _runTest(this.map);
        }

        if(editMode){
            $('#help').show();
        }else{
            $('#help').hide();
        }

        this.background = new Background(this.game, null,0,0);
        this.game.add.existing(this.background);



        this.map.addTilesetImage('tileset');
        this.tileLayer = this.map.createLayer('Tiles');
        this.tileLayer.resizeWorld();
        this.map.setCollision(getGIDs('solid', this.map), true, this.tileLayer);

        console.log(getGIDs('ladder', this.map));
        this.map.setTileIndexCallback(getGIDs('ladder', this.map), function(sprite, tile) {
            if (sprite instanceof Player) {
                this.tileCollState.ladder = true;
            }
        }, this, this.tileLayer);

        //List of added objects
        this.gameObjects = [];
        this.toolbox = new Toolbox(this.game, null, 0, 0, TILESIZE, this.camera.width, 96, this.map, this.gameObjects);
        this.game.add.existing(this.toolbox);

        this.npcs = this.game.add.group();
        this.enemies = this.game.add.group();
        this.checkpoints = this.game.add.group();
        this.bunnies = this.game.add.group();

        this.reproducers = this.game.add.group();
        this.reproducers.add(this.npcs);
        this.reproducers.add(this.enemies);
        this.reproducers.add(this.checkpoints);
        this.reproducers.add(this.bunnies);

        this.map.objects.Objects.forEach(function(char) {
            var properties = getTileProperties(char.gid, self.map);
            var gameObject = {
                id: gameObjectId ++,
                gid: char.gid,
                x: char.x,
                y: char.y,
                properties: char.properties || {
                    dialog: {
                        text: 'Texttttt'
                    }
                }
            };
            self.gameObjects.push(gameObject);
            if (properties.type === 'player') {
                self.player = new Player(self.game, char.x, char.y, self.tileCollState);
                self.game.add.existing(self.player);
                self.player.gameObject = gameObject;
                self.player.setRespawnPoint();
            } else if (properties.type === 'npc') {
                var npc = new NPC(self.game, char.x, char.y, self.gameObjects, gameObject);
                npc.gameObject = gameObject;
                self.npcs.add(npc);
            } else if (properties.type === 'enemy') {
                var enemy1 = new Enemy1(self.game, char.x, char.y, self.gameObjects);
                enemy1.gameObject = gameObject;
                self.enemies.add(enemy1);
            } else if (properties.type === 'checkpoint') {
                var checkpoint = new Checkpoint(self.game, char.x, char.y, self.gameObjects);
                checkpoint.gameObject = gameObject;
                self.checkpoints.add(checkpoint);
            } else if (properties.type === 'bunny') {
                var bunny = new Bunny(self.game, char.x, char.y, self.gameObjects);
                bunny.gameObject = gameObject;
                bunny.minimapColor = '#ffffff';
                self.bunnies.add(bunny);
            }
        });



        this.minimap = new Minimap(this.game, null, 0, 512, TILESIZE, {
            x: 2,
            y: 5
        }, this.map, this.tileLayer, [this.npcs, this.enemies, this.bunnies], this.player, this.game.camera);
        this.grid = new Grid(this.game, null, 0, 0, TILESIZE, this.map.width * 32, this.map.height * 32, this.toolbox);





        this.game.add.existing(this.minimap);
        if (editMode) {
            this.game.add.existing(this.grid);
            NPC.createNewTemplateMaster(this.game, this.npcs, this.gameObjects);
            Enemy1.createNewTemplateMaster(this.game, this.enemies, this.gameObjects);
            Bunny.createNewTemplateMaster(this.game, this.bunnies, this.gameObjects);
            Checkpoint.createNewTemplateMaster(this.game, this.checkpoints, this.gameObjects);
        }







    };


    MonsterParticle = function(game, x, y) {

        Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleShade'));

    };

    MonsterParticle.prototype = Object.create(Phaser.Particle.prototype);
    MonsterParticle.prototype.constructor = MonsterParticle;


    PlayState.prototype.update = function() {
        var self = this;
        this.debugInfo();


        this.clearTileCollState();

        this.physics.arcade.collide(this.player, this.tileLayer);


        this.physics.arcade.collide(this.player, this.checkpoints, null, function(player, checkpoint) {
            player.setRespawnPoint();
            checkpoint.trigger();
            return false;
        });

        this.physics.arcade.collide(this.player, this.bunnies, null, function(player, bunny) {
            self.tileCollState.bunny = bunny;
            return false;
        });

        this.physics.arcade.collide(this.bunnies, this.enemies, null, function(bunny, enemy) {
            console.log('collide',!bunny.body.onFloor() && !bunny.body.touching.down);
            if(bunny.isBullet){
                playExplosionAdvanced(self.game,enemy.x,enemy.y);
                enemy.destroy();
            }
            return false;
        });


        this.physics.arcade.collide(this.npcs, this.tileLayer, function(npc, layer) {
            npc.collideWithWorld();
            return true;
        });

        this.physics.arcade.collide(this.enemies, this.tileLayer, function(enemy, layer) {

            enemy.collideWithWorld();
            return true;
        });

        this.physics.arcade.collide(this.bunnies, this.tileLayer, function(bunny, layer) {
            bunny.collideWithWorld();
            return true;
        });

        this.physics.arcade.collide(this.checkpoints, this.tileLayer, function(checkpoint, layer) {
            checkpoint.collideWithWorld();
            return true;
        });


        this.npcs.callAll("modeClear");
        this.player.modeClear();
        this.physics.arcade.overlap(this.player, this.npcs, null, function(player, npc) {
            player.setCurrentNPC(npc);
            npc.playerIsNear();
        });



        this.physics.arcade.collide(this.player, this.enemies, null, function(player, enemy) {
            player.killMe();
            return false; // TO avoid physical reaction
        });


        this.physics.arcade.collide(this.reproducers, this.toolbox, null, function(rep, toolbox) {
            rep.collideWithToolbox();
            return false;
        });

    };



    PlayState.prototype.clearTileCollState = function() {
        var self = this;
        _.forEach(this.tileCollState, function(value, key) {
            self.tileCollState[key] = false;
        });
    };

    PlayState.prototype.debugInfo = function() {
        var self = this;
        if (this.game.config.enableDebug) {
            this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
            this.game.debug.body(this.player);

            this.npcs.forEach(function(item) {
                self.game.debug.body(item, 'rgba(0,255,0,0.2)');
            });

            this.checkpoints.forEach(function(item) {
                self.game.debug.body(item, 'rgba(255,0,255,0.2)');
            });

            this.bunnies.forEach(function(item) {
                self.game.debug.body(item, 'rgba(255,0,255,0.2)');
            });

            this.enemies.forEach(function(item) {
                self.game.debug.body(item, 'rgba(0,255,0,0.2)');
            });

        }
    };

    global.PlayState = PlayState;
})(this);









//========================================
//========================================

//=== Event Zone Handler
//=======
