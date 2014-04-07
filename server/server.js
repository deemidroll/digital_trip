// Dependencies
var express = require('express'),
    http = require('http'),
    io = require('socket.io'),
    crypto = require('crypto');

// Set up our app with Express framework
var app = express();

// Create our HTTP server
var server = http.createServer(app);

var genRandomFloorBetween = function (min, max) {
    var rand = min - 0.5 + Math.random()*(max-min+1);
    rand = Math.round(rand);
    return rand;
};

var genGameCode = function () {
    var code = genRandomFloorBetween(0, 999999).toString();
    while (code.length < 6) {
        code = "0" + code;
    }
    return code;
};

// Configure the app's document root to be HexGl/
app.configure(function() {
    app.use(
        "/",
        express.static("../")
    );
});

// Tell Socket.io to pay attention
io = io.listen(server);

// Tell HTTP Server to begin listening for connections on port 8888
server.listen(80);

// Sockets object to save game code -> socked associations
var socketCodes = {};

// When a client connects...
io.sockets.on('connection', function(socket) {
    // Confirm the connection
    socket.emit("welcome", {});

    socket.on("message", function (data) {
        // ...emit a "message" event to every other socket
        for (var socket in io.sockets.sockets) {
            if (io.sockets.sockets.hasOwnProperty(socket)) {
                if (io.sockets.sockets[socket].gameCode === data.gameCode) {
                    io.sockets.sockets[socket].emit("message", data);
                }
            }
        }
    });
    
    // Receive the client device type
    socket.on("device", function(device) {
        // if client is a browser game
        if(device.type == "game") {
            // Generate a code
            // var gameCode = crypto.randomBytes(3).toString('hex');
            var gameCode = genGameCode();
            // Ensure uniqueness
            while(gameCode in socketCodes) {
                // gameCode = crypto.randomBytes(3).toString('hex');
                gameCode = genGameCode();
            }
            
            // Store game code -> socket association
            socketCodes[gameCode] = io.sockets.sockets[socket.id];
            socket.gameCode = gameCode
            
            // Tell game client to initialize 
            //  and show the game code to the user
            socket.emit("initialize", gameCode);
        } else if(device.type == "controller") { // if client is a phone controller
            // if game code is valid...
            if(device.gameCode in socketCodes) {
                // save the game code for controller commands
                socket.gameCode = device.gameCode

                // initialize the controller
                socket.emit("connected", {});
                
                // start the game
                socketCodes[device.gameCode].emit("connected", {});
                socket.emit("message", {type: "vibr", time: 100});
            } else {  // else game code is invalid, send fail message and disconnect
                socket.emit("fail", {});
                socket.emit("message", {type: "vibr", time: 1000});
                socket.disconnect();
            }
        }
    });
    
    // send accelerate command to game client
    socket.on("accelerate", function(data) {
        var bAccelerate = data.accelerate;
        if(socket.gameCode && socket.gameCode in socketCodes) {
            socketCodes[socket.gameCode].emit("accelerate", bAccelerate);
        }
    });
    
    // send turn command to game client
    socket.on("turn", function(data) {
        if(socket.gameCode && socket.gameCode in socketCodes) {
            socketCodes[socket.gameCode].emit("turn", data.turn);
        }
    });
    // send click command to game client
    socket.on("click", function(data) {
        if(socket.gameCode && socket.gameCode in socketCodes) {
            socketCodes[socket.gameCode].emit("click", data.click);
        }
    });
});

// When a client disconnects...
io.sockets.on('disconnect', function(socket) {
    // remove game code -> socket association on disconnect
    if(socket.gameCode && socket.gameCode in socketCodes) {
        delete socketCodes[socket.gameCode];
    }
});