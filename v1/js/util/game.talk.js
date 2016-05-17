(function(global) {
    var talk = {};

    var _dialog = null;
  

    talk.show = function(dialog) {
        _dialog = dialog;
        $('#talk').html(_dialog.text).show();
        return this;
    };

    talk.hide = function() {
        _dialog.text = $('#talk').html();
        $('#talk').hide();
        return this;
    };

    talk.init = function(onClose, context) {
        return this;
    };

    talk.onClose = function(onClose, context) {
        return this;
    };

    global.talk = talk;

})(this);
