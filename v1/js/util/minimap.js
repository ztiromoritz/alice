function createMiniMap() {
    miniMapContainer = game.add.group();
    resolution = 2 / gameSize;
    if (game.world.width > 8000) {
        var renderWH = 8000;
    } else {
        var renderWH = game.world.width;
    }
    renderTexture = game.add.renderTexture(renderWH, renderWH);
    renderTexture.resolution = resolution;
    var cropRect = new Phaser.Rectangle(0, 0, 200, 200);
    renderTexture.crop = cropRect;
    var miniMapY = game.camera.view.height - (game.world.height * resolution);
    var miniMapUI = game.add.image(0, 0, 'mini_map');
    renderTexture.trueWidth = renderTexture.resolution * game.world.width;
    renderTexture.trueHeight = renderTexture.resolution * game.world.height;
    var cropRect = new Phaser.Rectangle(0, 0, renderTexture.trueWidth, renderTexture.trueHeight);
    renderTexture.crop = cropRect;
    var miniWidth = .075 * renderTexture.trueWidth;
    var miniHeight = miniMapY - (.06 * renderTexture.trueHeight);
    miniMap = game.add.sprite(miniWidth, miniHeight, renderTexture);
    var padding = .241 * renderTexture.trueHeight;
    miniMapUI.width = (renderTexture.trueWidth + padding);
    miniMapUI.height = (renderTexture.trueHeight + padding);
    miniMapUI.y = game.camera.view.height - miniMapUI.height;
    miniMapUI.fixedToCamera = true;
    miniMap.fixedToCamera = true;
    viewRect = game.add.graphics(0, 0);
    viewRect.lineStyle(1, 0xFFFFFF);
    viewRect.drawRect(miniMap.x, miniMap.y, game.camera.view.width * resolution, game.camera.view.height * resolution);
    unitDots = game.add.graphics(miniMap.x, miniMap.y);
    unitDots.fixedToCamera = true;
    var bg = game.add.graphics(0, 0);
    bg.beginFill(0x000000, 1);
    bg.drawRect(0, miniMapUI.y + (miniMapUI.height * .1), miniMapUI.width * .95, miniMapUI.height * .9);
    bg.fixedToCamera = true;
    var children = [bg, miniMap, unitDots, viewRect, miniMapUI];
    miniMapContainer.addMultiple(children);
}




function updateUnitDots() {
    unitDots.clear();
    gameObjects.forEach(function(object) {
        var unitMiniX = object.x * renderTexture.resolution;
        var unitMiniY = object.y * renderTexture.resolution;
        var objectType = object.objectType;
        if (objectType == 'unit' || objectType == 'building' || objectType == 'wall') {
            if (playerColors[object.player - 2] == undefined) { // player 1
                var color = '0x1331a1';
            } else {
                var color = playerColors[object.player - 2].color;
            }
            unitDots.beginFill(color);
            if (objectType == 'building') {
                unitDots.drawRect(unitMiniX, unitMiniY, 5, 5);
            } else {
                unitDots.drawEllipse(unitMiniX, unitMiniY, 1.5, 1.5);
            }
        } else if (objectType == 'plant') { // tree
            unitDots.beginFill(0x2A4B17);
            unitDots.drawEllipse(unitMiniX, unitMiniY, 2, 2);
        } else {
            var color = '0x666666'; // gray
            unitDots.beginFill(color);
            unitDots.drawRect(unitMiniX, unitMiniY, 5, 5);
        }
    });
}






function create_Minimap() {


    // the static map
    var miniMapBmd = this.game.add.bitmapData(g_game.tileMap.width * g_game.miniMapSize, g_game.tileMap.height * g_game.miniMapSize);
    // g_game.miniMapSize is the pixel size in the minimap
    // iterate my map layers
    for (l = 0; l < g_game.tileMap.layers.length; l++) {
        for (y = 0; y < g_game.tileMap.height; y++) {
            for (x = 0; x < g_game.tileMap.width; x++) {
                var tile = g_game.tileMap.getTile(x, y, l);
                if (tile && g_game.tileMap.layers[l].name == 'Ground') { // fill a pixel in the minimap
                    miniMapBmd.ctx.fillStyle = '#bc8d6b';
                    miniMapBmd.ctx.fillRect(x * g_game.miniMapSize, y * g_game.miniMapSize, g_game.miniMapSize, g_game.miniMapSize);
                } else if ...other types of tiles
            }
        }
    }
    g_game.miniMap = this.game.add.sprite(x, y, miniMapBmd);

    // dynamic bmd where I draw mobile stuff like friends and enemies
    g_game.miniMapOverlay = this.game.add.bitmapData(g_game.tileMap.width * g_game.miniMapSize, g_game.tileMap.height * g_game.miniMapSize);
    this.game.add.sprite(g_game.miniMap.x, g_game.miniMap.y, g_game.miniMapOverlay);

}


function update_minimap(){


    g_game.miniMapOverlay.context.clearRect(0, 0, g_game.miniMapOverlay.width, g_game.miniMapOverlay.height);
    g_game.soldiers.forEach(function(soldier) {
        g_game.miniMapOverlay.rect(Math.floor(soldier.x / TILE_SIZE) * g_game.miniMapSize,
        Math.floor(soldier.y / TILE_SIZE) * g_game.miniMapSize,
        g_game.miniMapSize,
        g_game.miniMapSize, color);
    });
    g_game.miniMapOverlay.dirty = true;

}
