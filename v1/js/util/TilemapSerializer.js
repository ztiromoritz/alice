(function(global){

    var EPSILON = 0.001;
    var eqEps = function(v1, v2) {
        return Math.abs(v1 - v2) < EPSILON;
    };

    var tiledJSONObjectDefaults = {
        height: 32,
        width : 32,
        rotation : 0,
        name : "",
        type : "",
        visible : true
    };

    var nextObjectId = 1;

    var TilemapSerializer = {


        createTiledJSONObject : function(gid,x,y,properties) {
            var jsonObject = {
                gid : gid,
                id : nextObjectId ++,
                x : x,
                y : y,
                properties : properties,
            };
            jsonObject = _.defaults(jsonObject, tiledJSONObjectDefaults);
        },

        serializeObjectsToTiledJSON : function(mapObjects){
            var result = [];
            for(var i = 0; i < mapObjects.length;i++){
                var mapObject = mapObjects[i];
                var jsonObject = {
                    gid : mapObject.gid,
                    name : mapObject.name,
                    type : mapObject.type,
                    visible : mapObject.visible,
                    properties : mapObject.properties,
                    x : mapObject.x,
                    y : mapObject.y,
                    id : i+1 //Assumption that this is the only objectlayer in
                             //the map
                };
                jsonObject = _.defaults(jsonObject,tiledJSONObjectDefaults);
                result.push(jsonObject);
            }
            return result;
        },

        serializeLayerToTiledJSON : function(mapLayers){
            var layers = [];
            for(var i = 0 ; i < mapLayers.length;i++)
            {
                var current = mapLayers[i];
                var data = [];
                var layer = {
                    name : current.name,
                    x : current.x,
                    y : current.y,
                    width : current.width,
                    opacity : current.alpha,
                    visible : current.visible,
                    properties : current.properties,
                };

                for(var m = 0; m < current.data.length; m++){
                    var row = current.data[m];
                    for(var n = 0; n < row.length; n++ ){
                        var tile = row[n];
                        var index = (tile && tile.index > 0 ) ? tile.index : 0;
                        var highBits = 0;
                        var rot = tile.rotation;
                        if(!tile.flipped){
                            if(eqEps(rot,Math.PI/2)){
                                highBits = 0xA0000000; //1010 ...
                            }else if(eqEps(rot, Math.PI)){
                                highBits = 0xC0000000;//1100 ...
                            }else if(eqEps(rot, 3 * Math.PI/2)){
                                highBits = 0x60000000; //0110 ..
                            }
                        }else{
                            if(eqEps(rot,0)){
                                highBits = 0x80000000;//1000
                            }else if(eqEps(rot,Math.PI/2)){
                                highBits = 0xE0000000;//1110 ...
                            }else if(eqEps(rot,Math.PI)){
                                highBits = 0x40000000; //0100..
                            }else if(eqEps(rot, 3 * Math.PI/2)){
                                highBits = 0x20000000;//0010..
                            }
                        }

                        var gid = highBits | index;
                        data.push(gid);
                    }
                }

                layer.data = data;
                layers.push(layer);
            }
            return layers;
        },

        serializeToTiledJSON: function(tilemap){
            var json = {};

            json.orientation = 'orthogonal';

            json.width = map.width;
            json.height = map.height;
            json.tileWidth = map.tilewidth;
            json.tileHeight = map.tileheight;
            json.orientation = map.orientation;
            json.version = map.version;
            json.properties = map.properties;

            //== TileLayer ==
            json.layers = this.serializeLayerToTiledJSON(tilemap.layers);
        }
    };

    global.TilemapSerializer = TilemapSerializer;

})(this);
