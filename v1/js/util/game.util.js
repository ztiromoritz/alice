function flipLeft(sprite) {
    if (sprite)
        sprite.scale.x = -1 * Math.abs(sprite.scale.x);
}

function flipRight(sprite) {
    if (sprite)
        sprite.scale.x = 1 *  Math.abs(sprite.scale.x);
}


/**
 * Returns a list of Tile info objects.
 * [
 * {
 *   gid,       //The gid of the tile
 *   frame,     //The frame/offset of the tile in the tileset
 *   tileset,   //The name of the tileset in tiled.
 *   properties //The tile properties
 * }
 * ]
 *
 * Method inspired by this post
 *    http://www.html5gamedevs.com/topic/4635-way-to-get-gid-in-tiled-for-use-in-phaser/
 * @param type
 *      Value of the 'type' property to filter the entries
 * @param map
 *      The map to search in
 * @param property (optional)
 *      An override for the property name. default is 'type'
 *
 */
Phaser.Tilemap.prototype.getTileinfoByProperty = function (type, property ){
    var keys, i, j, result = [];
    if (typeof (property) === "undefined") {
        property = "type";
    }
    for (i = 0; i < this.tilesets.length; i++) {
        if (!(this.tilesets[i].hasOwnProperty("tileProperties"))) {
            continue;
        }
        keys = Object.keys(this.tilesets[i].tileProperties);
        for (j = 0; j < keys.length; j++) {
            if ((this.tilesets[i].tileProperties[keys[j]].hasOwnProperty(property)) &&
                (this.tilesets[i].tileProperties[keys[j]][property] === type)) {
                var frame = parseInt(keys[j], 10);
                var gid = parseInt(this.tilesets[i].firstgid, 10) + frame;
                var tileset = this.tilesets[i].name;
                var properties = this.tilesets[i].tileProperties;
                result.push( {
                    frame : frame, gid: gid , tileset : tileset
                } )
            }
        }
    }
    if (result.length === 0)
        console.error("Error: No Tiles found! for "+ property );
    return result;
};

/**
 * Per convention the name of the tileset in the tilemap is the same
 * as the cache key for the tileset image in phaser
 * @param cache
 *      this.cache
 */
connectTilesetImages = function connectTilesetImages(cache,map){
    _.forEach(map.tilesets, function(tileset){
        if(cache.getItem(tileset.name,Phaser.Cache.IMAGE)){
            map.addTilesetImage(tileset.name, tileset.name);
        }else{
            console.warn('There is noch Image in cache for tileset '+tileset.name);
        }
    });
};





function getGIDs(value, map, property) {
    var keys, i, i2, result = [];
    if (typeof (property) === "undefined") {
        property = "type";
    }
    for (i = 0; i < map.tilesets.length; i++) {
        if (!(map.tilesets[i].hasOwnProperty("tileProperties"))) {
            continue;
        }
        keys = Object.keys(map.tilesets[i].tileProperties);
        for (i2 = 0; i2 < keys.length; i2++) {
            if ((map.tilesets[i].tileProperties[keys[i2]].hasOwnProperty(property)) &&
                (map.tilesets[i].tileProperties[keys[i2]][property] === value)) {
                result.push(parseInt(keys[i2], 10) + parseInt(map.tilesets[i].firstgid, 10))
            }
        }
    }
    if (result.length === 0)
        console.error("Error: No GIDs found! " + value);
    return result;
}

function getTileProperties(gid, map) {
    for (i = 0; i < map.tilesets.length; i++) {
        var tileset = map.tilesets[i];
        if (tileset.firstgid <= gid && gid < tileset.firstgid + tileset.total) {
            return tileset.tileProperties[gid - tileset.firstgid] || {};
        }
    }
    return {};
}
