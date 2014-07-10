$(function() {
    // Game config
    var server = window.location.origin,
        hash = window.location.hash,
        leftBreakThreshold = -3,
        leftTurnThreshold = -20,
        rightBreakThreshold = 3,
        rightTurnThreshold = 20,
        controller = $("#controller"),
        $gameCodeInput = $("#gameCodeInput"),
        $wheel = $("#wheel"),
        $gameover = $("#gameover"),
        $preparetostart = $("#preparetostart"),
        $status = $("#status"),
        turned = false,
        usingEvent;


    // Technique from Juriy Zaytsev
    // http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
    var eventSupported = function( eventName ) {
        var el = document.createElement("div");
        eventName = "on" + eventName;
        var isSupported = (eventName in el);
        if ( !isSupported ) {
            el.setAttribute(eventName, "return;");
            isSupported = typeof el[eventName] === "function";
        }
        el = null;
        return isSupported;
    };
    usingEvent = eventSupported('touchstart') ? 'touchstart' : 'click';

    // When connect is pushed, establish socket connection
    var connect = function(gameCode) {
        socket = io.connect(server);
        // When server replies with initial welcome...
        socket.on('welcome', function(data) {
            // Send 'controller' device type with our entered game code
            socket.emit("device", {"type":"controller", "gameCode":gameCode});
        });
        socket.on("message", function(data) {
            if (data.type === "vibr") {
                // console.log("vibtare", data.time);
                navigator.vibrate(data.time);
            }
            if (data.type === "gameover") {
                // console.log("gameover");
                $wheel.css({display: 'none'});
                $gameover.css({display: 'table-cell'});
            }
            if (data.type === "resetGame") {
                // console.log("resetGame");
                $gameover.css({display: 'none'});
                $wheel.css({display: 'table-cell'});
            }
        });
        // When game code is validated, we can begin playing...
        socket.on("connected", function(data) {
            // css {display: 'none'}game code input, and css {display: 'table-cell'}the vehicle $wheel UI
            $("#socket").css({display: 'none'});
            $preparetostart.css({display: 'table-cell'});
            $("#start").click(function () {
                socket.emit('start', {});
                $(this).unbind('click');
                $preparetostart.css({display: 'none'});
                $wheel.css({display: 'table-cell'});
                // Audio loop - hack for prevent screen sleep
                $('#audioloop').trigger('play');
            });
            // Prevent touchmove event from cancelling the 'touchend' event above
            document.addEventListener("touchmove", function(event) {
                event.preventDefault();
            }, false);
            
            function orientationHandler (event) {
                var a = event.alpha, // "direction"
                    b = event.beta,  // left/right 'tilt'
                    g = event.gamma; // forward/back 'tilt'
                var turn,
                    ori = window.orientation;
                if (ori === 0) turn = g;
                if (ori === 90) turn = b;
                if (ori === -90) turn = -b;
                socket.emit("turn", {'turn':turn, 'g':a});
            }
            function useArrowButtons () {
                $("#btnLeft").on(usingEvent, function () {
                    socket.emit("click", {"click":"toTheLeft"});
                });
                $("#btnRight").on(usingEvent, function () {
                    socket.emit("click", {"click":"toTheRight"});
                });
            }
            // Steer the vehicle based on the phone orientation
            if ('ondeviceorientation' in window) {
                window.addEventListener('deviceorientation', orientationHandler, false);
                $status.html("tilt your device to control");
            } else if ('ondeviceorientation' in window) {
                window.addEventListener('MozOrientation', orientationHandler, false);
                $status.html("tilt your device to control");
            } else {
                useArrowButtons();
                $status.html("push buttons to control");
            }
            $("#btnSphere").on(usingEvent, function () {
                socket.emit("click", {"click":"pause"});
                $('#audioloop').trigger('play');
            });
            $("#restart").click(function () {
                socket.emit("click", {"click":"restart"});
                $gameover.css({display: 'none'});
                $wheel.css({display: 'table-cell'});
                $('#audioloop').trigger('play');
            });
        });
        socket.on("fail", function() {
            $('#status_fail').html("Failed to connect! Check address and code and reload!");
        });
        $(document).unbind("keyup", connnectOnEnter);
    };
    if (hash) {
        connect(hash.slice(1));
        $('#socket').hide();
    }
    var connnectOnEnter = function (event) {
        var k = event.keyCode;
        if (k === 13) {
            connect($gameCodeInput.val());
        }
    };
    $("#connect").click(function () {
        connect($gameCodeInput.val());
    });
    $(document).bind("keyup", connnectOnEnter);
});