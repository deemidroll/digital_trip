// Dependencies
var express = require('express'),
    http = require('http'),
    io = require('socket.io'),
    crypto = require('crypto'),
    mongo = require('mongodb').MongoClient;

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

var useDB = function (method, args) {
    mongo.connect('mongodb://127.0.0.1:27017/DTdb', function(err, db) {
        if(err) throw err;
        var collection = db.collection('clients');
        var oldCallback = args[args.length - 1];
        args[args.length - 1] = function (err, docs) {
            db.close();
            oldCallback(err, docs);
        };
        collection[method].apply(collection, args);
    });
};

var insertDB = function (id, set, callback) {
    useDB("insert",
        [set, 
        function(err, docs) {
            callback && callback(id, docs[0]);
        }]
    );
};

var updateDB = function (id, set, callback) {
    useDB("update",
        [{"clientId": id},
        {$set: set},
        {multi: false},
        function(err, doc) {
            callback && callback(id, doc);
        }]);
};

var getFromDB = function (id, set, callback) {
    useDB("findOne",
        [{"clientId": id},
        function (err, doc) {
            callback && callback(id, doc);
        }]);
};


var checkClient = function (id, doc, timeEnd, coinsCollect) {
    if (!doc) return false;
    var time = timeEnd - doc.timeStart,
        spawnCoord = 200,
        numberOfCoins = 10,
        coinsOffset = 10,
        dieCoord = 30,
        speedStart = 6,
        acceleration = 0.04,
        path,
        maxCoins;

    path = (speedStart * time) + (acceleration * time * time / 2);
    maxCoins = path/(spawnCoord + (numberOfCoins - 1) * coinsOffset + dieCoord) * numberOfCoins;

    return coinsCollect <= maxCoins;
};

// db.clients.find( {"clientId": id} ).limit(1).timeStart
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
        if (data.type === "gameover") {
            // update client in clients collection
            var timeEnd = new Date();
            getFromDB(data.sessionid, "timeStart", function (id, doc) {
                updateDB(id, {
                    "timeEnd": timeEnd,
                    "coinsCollect": data.coinsCollect,
                    "checkup": checkClient(id, doc, timeEnd, data.coinsCollect)
                })
            });
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
            socket.gameCode = gameCode;
            
            // Tell game client to initialize 
            //  and show the game code to the user
            socket.emit("initialize", gameCode);
            // insert data into MongoDB
            insertDB(socket.id, {
                "clientId": socket.id,
                "clientIp": socket.handshake.address.address,
                "gameCode": gameCode,
                "timeStart": new Date(),
                "timeEnd": undefined,
                "coinsCollect": null,
                "checkup": false
            });
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