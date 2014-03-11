var initPhoneController = function() {
    // Game config
   var server = window.location.origin,
        leftBreakThreshold = -3,
        leftTurnThreshold = -20,
        rightBreakThreshold = 3,
        rightTurnThreshold = 20,
        controller = $("#controller"),
        gameConnect = $("#gameConnect"),
        wheel = $("#wheel"),
        status = $("#status"),
        turned = false;

    if (server === "http://127.0.0.1:8888") {
        server = 'http://192.168.1.37:8888';
    }
    // If client is an Android Phone
    if( /iP(ad|od|hone)|Android|Blackberry|Windows Phone/i.test(navigator.userAgent) || true) {
        // Show the controller ui with gamecode input
        controller.show();
        // When connect is pushed, establish socket connection
        $("#connect").click(function() {
            var gameCode = $("#socket input").val(),
            socket = io.connect(server);
            // When server replies with initial welcome...
            socket.on('welcome', function(data) {
                // Send 'controller' device type with our entered game code
                socket.emit("device", {"type":"controller", "gameCode":gameCode});
            });
            socket.on("vibr", function(data) {
                console.log("vibtare", data.time);
                navigator.vibrate(data.time);
            });
            // When game code is validated, we can begin playing...
            socket.on("connected", function(data) {

                // Hide game code input, and show the vehicle wheel UI
                $("#socket").hide();
                wheel.show();
                // If user touches the screen, accelerate
                document.addEventListener("touchstart", function (event) {
                    socket.emit("accelerate", {'accelerate':true});
                    $('#forward').addClass('active');
                }, false);
                // Stop accelerating if user stops touching screen
                document.addEventListener("touchend", function(event) {
                    socket.emit("accelerate", {'accelerate':false});
                    $('#forward').removeClass('active');
                }, false);
                // Prevent touchmove event from cancelling the 'touchend' event above
                document.addEventListener("touchmove", function(event) {
                    event.preventDefault();
                }, false);
                
                // Steer the vehicle based on the phone orientation
                window.addEventListener('deviceorientation', function(event) {
                    var a = event.alpha, // "direction"
                        b = event.beta,  // left/right 'tilt'
                        g = event.gamma; // forward/back 'tilt'
                    var turn = g;
                    updateController(turn);
                    socket.emit("turn", {'turn':turn, 'g':a});
                }, false);

                window.addEventListener('MozOrientation', function(event) {
                    var a = event.alpha, // "direction"
                        b = event.beta,  // left/right 'tilt'
                        g = event.gamma; // forward/back 'tilt'
                    var turn = g;
                    updateController(turn);
                    socket.emit("turn", {'turn':turn, 'g':a});
                }, false);

                // window.addEventListener( 'orientationchange', function(event) {
                //     if (window.orientation === -90) {
                //         socket.emit("turn", {'turn':40, 'g':0});
                //     }
                //     if (window.orientation === 90) {
                //         socket.emit("turn", {'turn':-40, 'g':0});
                //     }
                //     if (window.orientation === 0 || window.orientation === 180) {
                //         socket.emit("turn", {'turn':0, 'g':0});
                //     }
                // }, false );
                if (!turned) {
                    $("#turnLeft").click(function () {
                        socket.emit("click", {"click":"left"});
                    });
                    $("#turnRight").click(function () {
                        socket.emit("click", {"click":"right"});
                    });
                    $("#onMoreTime").click(function () {
                        socket.emit("click", {"click":"onMoreTime"});
                    });
                }

            });
            socket.on("fail", function() {
                status.html("Failed to connect");
            });
        });
    }
    // Helper function to update controller UI
    function updateController(turn) {
        turned = true;
        // Rotate forward indicator towards direction of vehicle
        $('#forward').css('transform', 'rotate(' + (turn) + 'deg)');
        // Activate/Deactivate turn / airbreak signals based on turn degree
        if(turn < leftBreakThreshold) {
            $('#stopRight, #turnRight').removeClass('active');
            if(turn > leftTurnThreshold) {
                $('#stopLeft').addClass('active');
            } else {
                $('#turnLeft').addClass('active');
            }
        } else if (turn > rightBreakThreshold) {
            $('#stopLeft, #turnLeft').removeClass('active');
            if(turn < rightTurnThreshold) {
                $('#stopRight').addClass('active');
            } else {
                $('#turnRight').addClass('active');
            }
        } else {
            $('#stopLeft, #turnLeft, #stopRight, #turnRight').removeClass('active');
        }
    }
};