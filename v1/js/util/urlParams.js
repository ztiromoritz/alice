(function(global){
    var URL_PARAMS;
    (window.onpopstate = function () {
        var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

        URL_PARAMS = {};
        while (match = search.exec(query))
        URL_PARAMS[decode(match[1])] = decode(match[2]);
    })();


    var replaceQueryParam = function(param, newval, search) {
          var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
          var query = search.replace(regex, "$1").replace(/&$/, '');

          return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
    }

    global.URL_PARAMS = URL_PARAMS;
    global.replaceQueryParam = replaceQueryParam;
})(this);
