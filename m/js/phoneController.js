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
        status = $("#status");

    if (server === "http://127.0.0.1:8888") {
        server = 'http://192.168.1.37:8888';
    }
    // If client is an Android Phone
    if( /iP(ad|od|hone)|Android|Blackberry|Windows Phone/i.test(navigator.userAgent)) {
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
                    // Regardless of phone direction, 
                    //  left/right tilt should behave the same
                    var turn = b;
                    if( a > 270 || a < 90 ) {
                        turn = 0 - b;
                    } else {
                        turn = b;
                    }
                    // Update controller UI
                    updateController(turn);
                    // Tell game to turn the vehicle
                    socket.emit("turn", {'turn':turn, 'g':a});
                }, false);
            });
            socket.on("fail", function() {
                status.html("Failed to connect");
            });
        });
    }
    // Helper function to update controller UI
    function updateController(turn) {
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