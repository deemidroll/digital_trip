// Dependencies
var express = require('express'),
    http = require('http'),
    io = require('socket.io'),
    crypto = require('crypto'),
    mongo = require('mongodb').MongoClient,
    hookshot = require('hookshot');

// Set up our app with Express framework
var app = express();

// Create our HTTP server
var server = http.createServer(app);

// service functions
var genCookie = function () {
    var randomNumber=Math.random().toString();
    return randomNumber.substring(2,randomNumber.length);
};
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

// functions for work with DB
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

var insertDB = function (criteria, set, callback) {
    useDB("insert",
        [set, 
        function(err, docs) {
            callback && callback(criteria, docs[0]);
        }]
    );
};

var updateDB = function (criteria, set, callback) {
    useDB("update",
        [criteria,
        {$set: set},
        {multi: false},
        function(err, doc) {
            callback && callback(criteria, doc);
        }]);
};

var getOneFromDB = function (criteria, set, callback) {
    useDB("findOne",
        [criteria,
        function (err, doc) {
            callback && callback(criteria, doc);
        }]);
};
var getFromDB = function (criteria, set, callback) {
    useDB("find",
        [criteria,
        function (err, docs) {
            callback && callback(criteria, docs);
        }]);
};

//
var checkClient = function (criteria, doc, timeEnd, coinsCollect) {
    // fail
    // if there is not record in DB
    if (!doc) return false;
    var time = (timeEnd - doc.timeStart)/1000,
        spawnCoord = 200,
        numberOfCoins = 10,
        coinsOffset = 10,
        dieCoord = 30,
        speedStart = 36,
        acceleration = 0.6,
        path,
        maxCoins;
    // if game time more than 10 min
    if (time > 600) return false;

    path = (speedStart * time) + (acceleration * time * time / 2);
    maxCoins = path/(spawnCoord + (numberOfCoins - 1) * coinsOffset + dieCoord) * numberOfCoins;
    console.log(time, path, maxCoins);
    // if client recieve more coins than it may
    return coinsCollect <= maxCoins;
};

// Configure the app
app.configure(function() {
    app.use(express.cookieParser());
        // set a cookie
    app.use(function (req, res, next) {
        // check if client sent cookie
        var cookie = req.cookies.UID;
        if (cookie === undefined) {
            // no: gen a new cookie
            cookie = genCookie();
            console.log('cookie have created successfully');
        } else {
            // yes, cookie was already present 
            console.log('cookie exists', cookie);
        }
        // refresh cookie
        res.cookie('UID', cookie, { maxAge: 900000 });
        next(); // <-- important!
    });

    app.use("/", express.static("assets/"));
    app.use('/webhook', hookshot('refs/heads/master', 'git pull'));
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
        if (data.type === "gamestarted") {
            // update client in clients collection
            var timeStart = Date.now();
            getOneFromDB({"clientId": data.sessionid}, null, function (criteria, doc) {
                updateDB(criteria, {
                    "timeStart": timeStart
                })
            });
        }
        if (data.type === "gameover") {
            // update client in clients collection
            var timeEnd = Date.now();
            getOneFromDB({"clientId": data.sessionid}, null, function (criteria, doc) {
                updateDB(criteria, {
                    "timeEnd": timeEnd,
                    "coinsCollect": data.coinsCollect,
                    "checkup": checkClient(criteria, doc, timeEnd, data.coinsCollect)
                })
            });
        }
    });
    
    // Receive the client device type
    socket.on("device", function(data) {
        // if client is a browser game
        if(data.type == "game") {
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
            console.log(socket.handshake.headers);
            insertDB(null, {
                "cookieUID": data.cookieUID,
                "clientId": socket.id,
                "clientIp": socket.handshake.address.address,
                "gameCode": gameCode,
                "timeStart": null,
                "timeEnd": null,
                "coinsCollect": null,
                "checkup": null
            });
        } else if(data.type == "controller") { // if client is a phone controller
            // if game code is valid...
            if(data.gameCode in socketCodes) {
                // save the game code for controller commands
                socket.gameCode = data.gameCode

                // initialize the controller
                socket.emit("connected", {});
                
                // start the game
                socketCodes[data.gameCode].emit("connected", {});
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