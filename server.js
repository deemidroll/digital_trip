// ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗         ██╗███████╗
// ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗        ██║██╔════╝
// ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝        ██║███████╗
// ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗   ██   ██║╚════██║
// ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║██╗╚█████╔╝███████║
// ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝ ╚════╝ ╚══════╝
// Dependencies
var express = require('express'),
    io = require('socket.io'),
    mongoose = require('mongoose'),
    DogeAPI = require('dogeapi'),
    hookshot = require('hookshot');

// Set up app with Express framework
var app = express();

// Create server
var server = app.listen(80, function() {
    console.log('Listening on port %d', server.address().port);
});

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
            // console.log('cookie have created successfully');
        } else {
            // yes, cookie was already present 
            // console.log('cookie exists', cookie);
        }
        // refresh cookie
        res.cookie('UID', cookie, { maxAge: 900000 });
        next(); // <-- important!
    });

    app.use('/', express.static('assets/'));
    app.use('/webhook', hookshot('refs/heads/master', 'git pull'));
    app.use(/\/m\/#\d{6}/, express.static('assets/'));
});

// Connect DB
mongoose.connect('mongodb://127.0.0.1:27017/DTdb');

var Schema = mongoose.Schema;

var clientsSchema = new Schema({
    cookieUID: String,
    clientId: String,
    clientIp: String,
    gameCode: String,
    timeStart: Number,
    timeEnd: Number,
    coinsCollect: Number,
    maxCoinsCheck: Boolean,
    checkup: Boolean,
    paymentRequest: Number,
    gamesInSession: Number,
});

var Client = mongoose.model('Client', clientsSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('connected to db', db.name);
});

// dogecoin
var instance = new DogeAPI();
// Get balance
instance.getBalance(function (error, balance) {
    if(error) {
        // Handle error
    }
    console.log(balance);
});
// Get addresses
instance.getAddresses(function (error, addresses) {
    if(error) {
        // Handle error
    }
    console.log(addresses);
});

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
        code = '0' + code;
    }
    return code;
};
var checkClient = function (clients, currentClient) {
    console.log("Handle clients from Array[" + clients.length + "]")
    var IPcounter = 0,
        UIDcounter = 0,
        IPpaymentsCounter = 0,
        UIDpaymentsCounter = 0,
        IPtimeCounter = 0,
        UIDtimeCounter = 0,
        data = {},
        checkup = null;

    clients.forEach(function(client, i) {
        if (client.clientIp === currentClient.clientIp) {
            IPcounter++;
            if (client.paymentRequest) {
                IPpaymentsCounter += client.paymentRequest;
                IPtimeCounter += (currentClient.timeEnd - client.timeEnd);
            }
        }
        if (client.cookieUID === currentClient.cookieUID) {
            UIDcounter++;
            if (client.paymentRequest) {
                UIDpaymentsCounter += client.paymentRequest;
                UIDtimeCounter += (currentClient.timeEnd - client.timeEnd);
            }
        }
        // console.log("handle client #" + i);
    });
    if (currentClient.checkup === false ||
        currentClient.maxCoinsCheck === false ||
        IPcounter > 1000 ||
        UIDcounter > 100 ||
        IPpaymentsCounter > 20 ||
        UIDpaymentsCounter > 5 ||
        IPtimeCounter/IPpaymentsCounter < 10 * 60 * 1000) {
        checkup = false;
    } else {
        checkup = true;
    }
    // console.log('emit socket message in ' + currentClient.gameCode + ' with type paymentCheck, checkup: ' + checkup);
    // if(currentClient.gameCode && currentClient.gameCode in socketCodes) {
    //     socketCodes[currentClient.gameCode].emit('message', {type: 'paymentCheck', checkup: checkup});
    // }
    console.log(
        'checkup', currentClient.checkup === false,
        'maxCoinsCheck', currentClient.maxCoinsCheck === false,
        'IPcounter', IPcounter > 1000,
        'UIDcounter', UIDcounter > 100,
        'IPpaymentsCounter', IPpaymentsCounter > 20,
        'UIDpaymentsCounter', UIDpaymentsCounter > 5,
        'IPtimeCounter/IPpaymentsCounter', IPtimeCounter/IPpaymentsCounter < 10 * 60 * 1000);
    return checkup;
};

var checkCoins = function (timeStart, timeEnd, coinsCollect) {
    var time = (timeEnd - timeStart)/1000,
        maxCoins = calcMaxCoins(time);
    // if client recieve more coins than it may
    return coinsCollect <= maxCoins;
};

var calcMaxCoins = function (time) {
    var speedStart = 1/60,
        acceleration = 1/2500,
        maxPath = 0,
        maxCoins = 0, 
        t = 0.25, // coins position in the tube 
        dt = 0.004, // coins position offset
        n = 10; // number of coins in a row

    maxPath = (speedStart + acceleration * Math.sqrt(time * 60)) * time;

    maxCoins = Math.floor(maxPath / (t + dt * (n - 1)) * n)/10;
    console.log('time:' + time, 'maxCoins:' + maxCoins, 'maxPath:' + maxPath);
    return maxCoins;
};
// var checkUID = function (uid) {};
// var checkIp = function (ip) {};


// Tell Socket.io to pay attention
io = io.listen(server, { log: false });

// Sockets object to save game code -> socked associations
var socketCodes = {};

// When a client connects...
io.sockets.on('connection', function(socket) {
    // Confirm the connection
    socket.emit('welcome', {});

    socket.on('message', function (data) {
        // ...emit a 'message' event to every other socket
        for (var socket in io.sockets.sockets) {
            if (io.sockets.sockets.hasOwnProperty(socket)) {
                if (io.sockets.sockets[socket].gameCode === data.gameCode) {
                    io.sockets.sockets[socket].emit('message', data);
                }
            }
        }
        if (data.type === 'gamestarted') {
            var timeStart = Date.now();
            // update client in clients collection
            Client.findOne({'clientId': data.sessionid}).exec(function(err, client) {
                if (err) {
                    console.log('Error:', err);
                    return;
                }
                if (client) {
                    client.timeStart = timeStart;
                    client.gamesInSession += 1;
                    client.save(function (err) {
                        if (err) console.log("Error: could not save client timeStart");
                    });
                }
            });
        }
        if (data.type === 'gameover') {
            // update client in clients collection
            var timeEnd = Date.now();
            Client.findOne({'clientId': data.sessionid}).exec(function(err, client) {
                if (err) {
                    console.log('Error:', err);
                    return;
                }
                if (client) {
                    client.timeEnd = timeEnd;
                    client.coinsCollect = data.coinsCollect;
                    client.maxCoinsCheck = checkCoins(client.timeStart, client.timeEnd, client.coinsCollect);
                    client.save(function (err) {
                        if (err) console.log("Error: could not save client timeEnd data", err);
                    });
                }
            });
        }
        if (data.type === 'checkup') {
                console.log('chekup start', data.dogecoinId);
            Client.findOne({'clientId': data.sessionid}).exec(function(err, client) {
                if (err) {
                    console.log('Error:', err);
                    return;
                }
                if (client) {
                    // console.log('client found');
                    Client.find({ $or: [{'clientIp': client.clientIp}, {'cookieUID': client.cookieUID}]}).exec(function(err, clients) {
                        if (err) {
                            console.log('Error:', err);
                            return;
                        }
                        // if (!clients) return;
                        client.paymentRequest += 1;
                        client.checkup = checkClient(clients, client);
                        client.save(function (err) {
                            if (err) console.log("Error: could not save client checkup");
                        });
                        if (client.checkup) {
                            console.log('checkup yep', data.dogecoinId);
                            socketCodes[client.gameCode].emit('paymentMessage', {type: 'transactionStart'});
                            instance.withdraw(client.coinsCollect, data.dogecoinId, 7085, function (error, transactionid) {
                                console.log(client.coinsCollect, data.dogecoinId);
                                if(error) {
                                    // Handle error
                                    console.log(error, client.gameCode);
                                    socketCodes[client.gameCode].emit('transactionMessage', {type: 'transactionFail', error: error});
                                } else {
                                    console.log(transactionid);
                                    socketCodes[client.gameCode].emit('transactionMessage', {type: 'transactionComplete', transactionid: transactionid});
                                }
                            });
                        } else {
                            console.log('checkup nope');
                            socketCodes[client.gameCode].emit('paymentMessage', {type: 'transactionDenied'});
                        }
                    });
                }
            });
        }
    });
    
    // Receive the client device type
    socket.on('device', function(data) {
        // if client is a browser game
        if(data.type == 'game') {
            // Generate a code
            var gameCode = genGameCode();
            // Ensure uniqueness
            while(gameCode in socketCodes) {
                gameCode = genGameCode();
            }
            
            // Store game code -> socket association
            socketCodes[gameCode] = io.sockets.sockets[socket.id];
            socket.gameCode = gameCode;
            
            // Tell game client to initialize 
            //  and show the game code to the user
            socket.emit('initialize', gameCode);
            // insert data into MongoDB
            Client.findOne({'clientId': socket.id}).exec(function(err, client) {
                if(!err) {
                    if(!client) {
                        client = new Client({
                            cookieUID: data.cookieUID,
                            clientId: socket.id,
                            clientIp: socket.handshake.address.address,
                            gameCode: gameCode,
                            paymentRequest: 0,
                            gamesInSession: 0,
                        });
                    } else {
                        client.gamesInSession += 1;
                    }
                    client.save(function(err) {
                        if (err) console.log("Error: could not save client on start");
                    });
                }
            });

        } else if(data.type == 'controller') { // if client is a phone controller
            // if game code is valid...
            if(data.gameCode in socketCodes) {
                // save the game code for controller commands
                socket.gameCode = data.gameCode;
                // initialize the controller
                socket.emit('connected', {});
                
                // start the game
                if(data.gameCode && data.gameCode in socketCodes) {
                    socketCodes[data.gameCode].emit('connected', {});
                }
                socket.emit('message', {type: 'vibr', time: 100});
            } else {  // else game code is invalid, send fail message and disconnect
                socket.emit('fail', {});
                socket.emit('message', {type: 'vibr', time: 1000});
                socket.disconnect();
            }
        }
    });
    // send accelerate command to game client
    socket.on('accelerate', function(data) {
        var bAccelerate = data.accelerate;
        if(socket.gameCode && socket.gameCode in socketCodes) {
            socketCodes[socket.gameCode].emit('accelerate', bAccelerate);
        }
    });
    // send turn command to game client
    socket.on('turn', function(data) {
        if(socket.gameCode && socket.gameCode in socketCodes) {
            socketCodes[socket.gameCode].emit('turn', data.turn);
        }
    });
    // send click command to game client
    socket.on('click', function(data) {
        if(socket.gameCode && socket.gameCode in socketCodes) {
            socketCodes[socket.gameCode].emit('click', data.click);
        }
    });
    // send start command to game client
    socket.on('start', function(data) {
        if(socket.gameCode && socket.gameCode in socketCodes) {
            socketCodes[socket.gameCode].emit('start', data);
        }
    });
    // send disconnect command to game client
    socket.on('disconnect', function(data) {
        if(socket.gameCode && socket.gameCode in socketCodes) {
            socketCodes[socket.gameCode].emit('disconnectController', data);
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