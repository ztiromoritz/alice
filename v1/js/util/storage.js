(function(global) {

    var storage = {};

    var USE_HASH = true;

    var storageAvailable = function(type) {
        try {
            var storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return false;
        }
    };

    var exportMap = function(tilemap) {

    };

    storage.available = function() {
        return storageAvailable('localStorage');
    };


    storage.storeMap = function(tilemap, objects) {
        //Layers will be converted  to tiled JSON format before store
        var layerData = TilemapSerializer.serializeLayerToTiledJSON(tilemap.layers);

        //Objects will converted to tiledJSON after storage (because of compactness)

        var toStore = {
            data : layerData[0].data,
            objects : objects
        };


        var jsonString = JSON.stringify(toStore);
        if (USE_HASH) {
            var base64Hash = LZString.compressToBase64(jsonString);
            if (history.pushState) {
                history.pushState(null, null, '#' + base64Hash);
            } else {
                location.hash = '#' + base64Hash;
            }
        } else {
            localStorage.setItem("tileLayer", jsonString);
        }

    };

    storage.clear = function() {
        localStorage.clear();
        if (history.pushState) {
            history.pushState(null, null, '#');
        } else {
            location.hash = '#';
        }
        location.reload();
    }

    storage.decorateMap = function(jsonMap) {
        var jsonString = null;

        if (USE_HASH) {
            if (location.hash) {
                jsonString = LZString.decompressFromBase64(location.hash.substring(1));
            }
        } else {
            jsonString = localStorage.getItem("tileLayer");
        }

        if (jsonString) {
            var toLoad = JSON.parse(jsonString)
            jsonMap.layers[0].data = toLoad.data;
            jsonMap.layers[1].objects = toLoad.objects;
        }
    };

    global.storage = storage;

})(this);
