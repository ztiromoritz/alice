;
(function (global) {
    var gamepad = {};

    var state = {
        A: false,
        B: false,
        C: false,
        D: false,
        E: false,
        F: false
    };



    $(function () {

        $('.A').on('touchstart', function (event) {
            console.log('c');
            state.A = true;
        });

        $('.A').on('touchend', function (event) {
            state.A = false;
            event.preventDefault();
        });

        $('.B').on('touchstart', function (event) {
            state.B = true;
        });

        $('.B').on('touchend', function (event) {
            state.B = false;
            event.preventDefault();
        });


        $('.C').on('touchstart', function (event) {
            console.log('c');
            state.C = true;
        });

        $('.C').on('touchend', function (event) {
            state.C = false;
            event.preventDefault();
        });

        $('.D').on('touchstart', function (event) {
            console.log('c');
            state.D = true;
        });

        $('.D').on('touchend', function (event) {
            state.D = false;
            event.preventDefault();
        });

        $('.E').on('touchstart', function (event) {
            console.log('c');
            state.E = true;
        });

        $('.E').on('touchend', function (event) {
            state.E = false;
            event.preventDefault();
        });


        $('.F').on('touchstart', function (event) {
            state.F = true;
        });

        $('.F').on('touchend', function (event) {
            state.F = false;
            event.preventDefault();
        });
    });

    gamepad.state = state;

    global.gamepad = gamepad;

})(this);
