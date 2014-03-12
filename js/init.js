// define namespace object
// Digital Trip
var DT = {
    player: {
        currentHelth: 100,
        currentScore: 0,
        destPoint: {x: 0, y: -2.5},
        isInvulnerability: false,
        isFun: false,
        jump: false
    },
    param: {
        spacing: 3,
        spawnCoord: -200,
        opacityCoord: 2,
        dieCoord: 7,
        stonesCloseness: 18,
        globalVolume: 1,
        prevGlobalVolume: 1
    },
    speed: {
        value: 6,
        changer: 0,
        step: 0.1,
        increase: function () {
            this.value += (this.step / 5 / 60);
        },
        setChanger: function (changer) {
            this.changer = changer;
        },
        getChanger: function() {
            return this.changer;
        },
        getValue: function () {
            return this.value;
        }
    },
    collections: {
        stones: [],
        fragments: [],
        coins: [],
        bonuses: [],
        caughtBonuses: []
    },
    audio: {
        frequency: {
            0: 400,
            1: 100
        }
    },
    webaudio: new WebAudio(),
    sounds: {
        soundCoin: 'sounds/coin.',
        soundGameover: 'sounds/gameover.',
        soundPause: 'sounds/pause.',
        soundStoneDestroy: 'sounds/stoneDestroy.',
        soundStoneMiss: 'sounds/stoneMiss.'
    },
    music: {
        0: 'sounds/theField_overTheIce.ogg',
        1: 'sounds/heart.ogg',
        2: 'sounds/space_ambient2.ogg',
        3: 'sounds/theField_overTheIce.mp3',
        4: 'sounds/heart.mp3',
        5: 'sounds/space_ambient2.mp3',
        started: [],
        startedAt: [],
        pausedAt: [],
        stopped: [],
        paused: [],
        started: []
    },
    renderer: new THREE.WebGLRenderer(),
    camera: new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 300),
    scene: new THREE.Scene(),
    composer: null, // not used
    onRenderFcts: [],
    sphere: new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhongMaterial({color: 0xff0000})),
    lights: {
        light: new THREE.PointLight(0xffffff, 0.75, 100),
        sphereLight: new THREE.PointLight(0xff0000, 1.75, 15),
        sphereLightning: new THREE.PointLight(0xff0000, 0.75, 7.5),
        directionalLight: new THREE.DirectionalLight( 0xffffff, 0.25 )
    },
    shield: new THREE.Mesh(new THREE.CubeGeometry(1.3, 1.3, 1.3, 2, 2, 2), new THREE.MeshPhongMaterial({color: 0xffffff, transparent: true, opacity: 0.5})),
    id: null,
    lastTimeMsec: null,
    startGame: function() {

        requestAnimationFrame(function animate(nowMsec) {
            var deltaMsec = Math.min(200, nowMsec - DT.lastTimeMsec);
            // keep looping
            DT.id = requestAnimationFrame(animate);
            // measure time
            DT.lastTimeMsec = DT.lastTimeMsec || nowMsec - 1000 / 60;
            DT.lastTimeMsec = nowMsec;
            // call each update function
            DT.onRenderFcts.forEach(function(onRenderFct) {
                onRenderFct(deltaMsec / 1000, nowMsec / 1000);
            });
        });
        if (!DT.gameWasStarted) {
            // control
            $(document).keydown(function(event) {
                var destPoint = DT.player.destPoint,
                    changeDestPoint = DT.changeDestPoint,
                    k = event.keyCode;
                // arrows control
                if (k === 38) changeDestPoint(1, 0, destPoint);
                if (k === 40) changeDestPoint(-1, 0, destPoint);
                if (k === 37) changeDestPoint(0, -1, destPoint);
                if (k === 39) changeDestPoint(0, 1, destPoint);
                // speedUp
                if (k === 16) {
                    DT.speed.setChanger(6);
                    if (DT.player.isFun) {
                        DT.stopSound(1);
                        DT.playSound(0);
                        clearInterval(DT.rainbow);
                        DT.player.isFun === false;
                        DT.blink.doBlink("red", 2);
                    }
                }
                if (k === 17) {
                    DT.makeFun();
                }
            });

            $(document).keyup(function(event) {
                var k = event.keyCode;
                // speedDown
                if (k === 16) {
                    DT.speed.setChanger(0);
                    DT.funTimer = 0;
                }
            });
            $(document).keyup(DT.handlers.pauseOnSpace);
            DT.gameWasStarted = true;
        }
    },
    makeFunTimer: null,
    rainbow: null,
    listOfModels: [{
            name: "bonusH",
            scale: {x: 0.02, y: 0.02, z: 0.02},
            rotation: {x: Math.PI/1.3, y: -Math.PI/1.3, z: -Math.PI/1.3}
        },
        {
            name: "bonusI",
            scale: {x: 0.5, y: 0.5, z: 0.5},
            rotation: {x: Math.PI/1.3, y: -Math.PI/1.3, z: -Math.PI/1.3}
        },
        {
            name: "bonusE",
            scale: {x: 0.025, y: 0.025, z: 0.025},
            rotation: {x: 0, y: 0, z: 0}
    }],
    valueAudio: 0,
    blink: {
        color: new THREE.Color(),
        frames: 0,
        framesLeft: 0,
        dr: 0,
        dg: 0,
        db: 0
    },
    emittFragments: null, // not used
    bgTexture: THREE.ImageUtils.loadTexture( 'img/bg.jpg' ),
    invulnerTimer: null,
    jumpLength: 0, // not used
    jumpOffset: 2.2, // not used
    gameWasStarted: false,
    gameWasPaused: false,
    handlers: {},
    snapshot: null, // for restart
};
// HANDLERS
DT.handlers.mute = function() {
    if (DT.param.globalVolume === 1) {
        DT.param.globalVolume = 0;
        $(".music_button").html("N");
    } else {
        DT.param.globalVolume = 1;
        $(".music_button").html("M");
    }
    if (DT.param.prevGlobalVolume !== DT.param.globalVolume) {
        DT.gainNodes.forEach(function(el) {
            if (el) {
                el.gain.value = DT.param.globalVolume;
            }
        });
        DT.param.prevGlobalVolume = DT.param.globalVolume;
    }
}
DT.handlers.pauseOnSpace = function(event) {
    var k = event.keyCode;
    if (k === 32) {
        if (!DT.gameWasPaused) {
            DT.pauseOn();
        } else {
            DT.pauseOff();
        }
    }
};
DT.handlers.restartOnSpace = function(event) {
    var k = event.keyCode;
    if (k === 32) {
        DT.restart();
    }
};
// auxiliary functions
DT.getDistance = function (x1, y1, z1, x2, y2, z2) {
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)+(z1-z2)*(z1-z2));
};

DT.genCoord = function(delta) {
    var offset = delta || DT.param.spacing,
    x = Math.random() * offset * 2 - offset,
    absX = Math.abs(x);
    if (absX <= offset && absX >= offset * 0.33 ) {
        if (x > 0) {
            return offset; 
        }
        if (x < 0) {
            return offset * -1;
        }
    } else {
        return 0;
    }
};

DT.changeHelth = function(currHelth, delta) {
    if (delta > 0 || DT.player.isInvulnerability === false) {
    var helth = currHelth;
    if (helth > 0) {
        helth += delta;
        if (helth < 0) {
            helth = 0;
            DT.gameOver();
        }
        if (helth > 100) {
            helth = 100;
        }
    }
    currHelth = helth;
    $(function(){
        $(".helth").animate({
            width: helth + "%"
        });
    });
    }
    return currHelth;
};

DT.dontFeelPain = function (time) {
    DT.invulnerTimer = (time || 10000) / 1000 * 60;
    DT.player.isInvulnerability = true;
    DT.scene.add(DT.shield);
};

DT.blink.doBlink = function (color, frames, recover) {
    var defClr = {r: 1, g: 0, b: 0},
        blink = DT.blink;
        blink.color = new THREE.Color(color);
        blink.frames = frames;
        blink.framesLeft = frames;
        blink.dr = (defClr.r - blink.color.r)/frames;
        blink.dg = (defClr.g - blink.color.g)/frames;
        blink.db = (defClr.b - blink.color.b)/frames;
};

DT.changeScore = function(currentScore, delta) {
    currentScore += delta;
    $(function(){
        $(".current_coins").text(currentScore);
    });
    return currentScore;
};

DT.gameOver = function() {
    clearTimeout(DT.player.isFun);
    DT.stopSound(0);
    DT.stopSound(1);
    // DT.soundGameover.update();
    DT.soundGameover.play();
    $(function(){
        $(".total_coins").text(DT.player.currentScore);
        $(".game_over").css({"display": "table", "opacity": "0"}).animate({"opacity": "1"}, 1000);
        // $(document).unbind("keydown").unbind("keyup");
    });
    setTimeout(function() {
        cancelAnimationFrame(DT.id);
    }, 300);
    if (DT.initPhoneController.socket) {
        DT.initPhoneController.socket.emit("message", {"type": "gameover", "gameCode": DT.initPhoneController.socket.gameCode});
    }
    DT.prepareToRestart();
};

DT.restart = function () {
    $(".game_over").hide();

    for (var collection in DT.collections) {
        if (DT.collections.hasOwnProperty(collection)) {
            DT.collections[collection].forEach(function (el) {
                DT.scene.remove(el);
            });
        }
    }
    DT.player = $.extend(true, {}, DT.snapshot.player);

    $(".current_coins").html("0");
    $(".bonus").html("");
    $(".gameTimer").html("0:00");
    $(".helth").css({width: "100%"});
    DT.speed = $.extend(true, {}, DT.snapshot.speed);
    DT.collections = $.extend(true, {}, DT.snapshot.collections);
    DT.gameTimer = 0;
    // DT.gameWasStarted = false;
    DT.music.startedAt = [], DT.music.pausedAt = [], DT.music.stopped = [], DT.music.paused = [], DT.music.started = [];

    DT.startGame();
    DT.playSound(0);
    $(document).bind("keyup", DT.handlers.pauseOnSpace);
    $(document).unbind("keyup", DT.handlers.restartOnSpace);
    $('#one_more_time').unbind("click");
};
DT.prepareToRestart = function() {
    $('#one_more_time').click(function (event) {
        DT.restart();
    });
    $(document).unbind("keyup", DT.handlers.pauseOnSpace);
    $(document).bind("keyup", DT.handlers.restartOnSpace);
}

DT.hit = function() {
    $(function(){
        $(".error").html("ERROR " + DT.genRandomFloorBetween(500, 511));
        $(".hit").css({"display": "table"}).fadeOut(250);
    });
};

DT.generateStone = function (scene, arr, spawnCoord) {
    var radius, color, x, y, depth, geometry, material, stone,
        part = Math.random();
    if (part >= 0 && part < 0.16) {
        x = DT.genRandomBetween(-15, -5);
        y = DT.genRandomBetween(-15, -5);
    } else if (part >= 0.16 && part < 0.32){
        x = DT.genRandomBetween(5, 15);
        y = DT.genRandomBetween(5, 15);
    } else {
        x = DT.genRandomBetween(-5, 5);
        y = DT.genRandomBetween(-5, 5);
    }
    if (Math.abs(x) > 5 || Math.abs(y) > 5) {
        radius = DT.genRandomBetween(1.5, 3);
        color = new THREE.Color(0x464451);
    } else {
        radius = DT.genRandomBetween(1, 2);
        depth = DT.genRandomFloorBetween(80, 100)/255;
        color = new THREE.Color().setRGB(depth, depth, depth);
    }
    geometry = new THREE.IcosahedronGeometry(radius, 0);
    material = new THREE.MeshPhongMaterial({shading: THREE.FlatShading, color: color, specular: 0x111111, shininess: 100});

    stone = new THREE.Mesh( geometry, material );
    stone.position.x = x;
    stone.position.y = y;
    stone.position.z = Math.random() * 4 + spawnCoord;
    stone.rotation.x = Math.random();
    stone.rotation.y = Math.random();
    arr.push(stone);
    scene.add(stone);
};

// DT.generateFragments = function (scene, arr, x, y, z, numb) {
//     var geometry, 
//         material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading, color: "red"}),
//         numb = numb || 2,
//         fragment;
//     for (var i = 0; i < 100; i++) {
//         geometry = new THREE.IcosahedronGeometry(0.1, 0);
//         fragment = new THREE.Mesh( geometry, material );
//         fragment.position.x = x + Math.random() * numb - 0.5 * numb;
//         fragment.position.y = y + Math.random() * numb - 0.5 * numb;
//         // fragment.rotation.x = Math.random();
//         // fragment.rotation.y = Math.random();
//         fragment.TTL = 240;
//         fragment.frames = 0;
//         arr.push(fragment);
//         scene.add(fragment);
//     }
// };

DT.genCoins = function (scene, arr, spawnCoord, x, y, zAngle) {
    var r = 0.5,
    coin_sides_geo = new THREE.CylinderGeometry( r, r, 0.05, 32, 1, true ),
    coin_cap_geo = new THREE.Geometry();
    for (var i = 0; i < 100; i++) {
        var a = i * 1/100 * Math.PI * 2,
            z = Math.sin(a),
            xCosA = Math.cos(a),
            a1 = (i+1) * 1/100 * Math.PI * 2,
            z1 = Math.sin(a1),
            x1 = Math.cos(a1);
        coin_cap_geo.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(xCosA*r, 0, z*r),
            new THREE.Vector3(x1*r, 0, z1*r)
        );
        coin_cap_geo.faceVertexUvs[0].push([
            new THREE.Vector2(0.5, 0.5),
            new THREE.Vector2(xCosA/2+0.5, z/2+0.5),
            new THREE.Vector2(x1/2+0.5, z1/2+0.5)
        ]);
        coin_cap_geo.faces.push(new THREE.Face3(i*3, i*3+1, i*3+2));
    }
    coin_cap_geo.computeCentroids();
    coin_cap_geo.computeFaceNormals();

    var coin_cap_texture = THREE.ImageUtils.loadTexture("./img/avers.png"),
        coin_sides_mat = new THREE.MeshPhongMaterial({emissive: 0xcfb53b, color: 0xcfb53b}),
        coin_sides = new THREE.Mesh( coin_sides_geo, coin_sides_mat ),
        coin_cap_mat = new THREE.MeshPhongMaterial({emissive: 0xcfb53b, color: 0xcfb53b, map: coin_cap_texture}),
        coin_cap_top = new THREE.Mesh( coin_cap_geo, coin_cap_mat ),
        coin_cap_bottom = new THREE.Mesh( coin_cap_geo, coin_cap_mat );
    coin_cap_top.position.y = 0.05;
    coin_cap_bottom.position.y = -0.05;
    coin_cap_top.rotation.x = Math.PI;

    var coin = new THREE.Object3D();
    coin.add(coin_sides);
    coin.add(coin_cap_top);
    coin.add(coin_cap_bottom);

    coin.position.x = x;
    coin.position.y = y;
    coin.position.z = Math.random() * 4 + spawnCoord;;
    coin.rotation.x = 1.5;
    coin.rotation.y = 0;
    coin.rotation.z = zAngle;
    arr.push(coin);
    scene.add(coin);
};

DT.genBonus = function (scene, arr, spawnCoord, x, y, listOfModels) {
    var listOfModels = DT.listOfModels,
        type, geometry, material, bonus;
    type = DT.genRandomFloorBetween(0, 2);
    // type = 1;
    geometry = listOfModels[type].geometry;
    material = listOfModels[type].material;
    bonus = new THREE.Mesh( geometry, material );

    bonus.position.x = x;
    bonus.position.y = y;
    bonus.position.z = spawnCoord * 2;

    bonus.scale.x = listOfModels[type].scale.x || 1;
    bonus.scale.y = listOfModels[type].scale.y || 1;
    bonus.scale.z = listOfModels[type].scale.z || 1;

    bonus.rotation.x = listOfModels[type].rotation.x || 0;
    bonus.rotation.y = listOfModels[type].rotation.y || 0;
    bonus.rotation.z = listOfModels[type].rotation.z || 0;

    bonus.type = type;

    arr.push(bonus);
    scene.add(bonus);

    if (type === 2) {
        DT.animation = new THREE.MorphAnimation(bonus);
        DT.animation.play();
    }
};

DT.useBonuses = function (type) {
    // helth
    if (type === 0) DT.player.currentHelth = DT.changeHelth(DT.player.currentHelth, 100 - DT.player.currentHelth);
    // invulnerability
    if (type === 1) DT.dontFeelPain(10000);
    // entertainment
    if (type === 2) DT.makeFun();
};

DT.catchBonus = function (type) {
    var caughtBonuses = DT.collections.caughtBonuses
        if (!caughtBonuses.length || caughtBonuses[0] === type) {
            caughtBonuses.push(type);
            if (caughtBonuses.length === 3) {
                DT.useBonuses(type);
                var refreshBonus = setTimeout(function() {
                    caughtBonuses.length = 0;
                    clearTimeout(refreshBonus);
                }, 100);
            }
        } else {
            caughtBonuses.length = 0;
            caughtBonuses.push(type);
        }
        DT.showBonuses(caughtBonuses);
};

DT.showBonuses = function (arr) {
    var n = arr.length;
    $(function(){
        $(".bonus").text(function(){
            if (arr[0] === 0) return "H ".repeat(n);
            if (arr[0] === 1) return "I ".repeat(n);
            if (arr[0] === 2) return "E ".repeat(n);
        });
    });
    if (n === 3) {
        $(".bonus").fadeOut(300, function(){
            $(".bonus").text("").fadeIn(100);
        });
    }
};

DT.changeDestPoint = function(dy, dx, destPoint) {
    var newPos = dx * DT.param.spacing;

    if (destPoint.x < DT.param.spacing && dx > 0) {
        destPoint.x += dx * DT.param.spacing;
    }
    if (destPoint.x > -DT.param.spacing && dx < 0) {
        destPoint.x += dx * DT.param.spacing;
    }
    // if (DT.sphere.position.y < -2 && dy > 0) {
    //     DT.jumpLength = 0;
    //     DT.player.jump = true;
    // }
    // if (dy < 0) {
    //     DT.player.jump = false;
    // }
};

DT.moveSphere = function(sphere, destPoint, n) {
    for (var i = 0; i < n; i++) {
        ["x"].forEach(function(aix) {
            var dx = destPoint[aix] - sphere.position[aix];
            if (Math.abs(dx) > 0.01) {
                sphere.position[aix] += dx > 0 ? 0.1 : -0.1;
            }
        });
    }
        ["y"].forEach(function(aix) {
            var dx = destPoint[aix] - sphere.position[aix];
            if (Math.abs(dx) > 0.01) {
                sphere.position[aix] += dx > 0 ? 0.1 : -0.1;
            }
        });
};  

DT.makeFun = function(time) {
    DT.player.isFun = true;
    DT.funTimer = (time || 10000) / 1000 * 60;
    DT.speed.setChanger(-5);
    DT.stopSound(0);
    DT.playSound(1);
};

DT.genRandomFloorBetween = function (min, max) {
    var rand = min - 0.5 + Math.random()*(max-min+1);
    rand = Math.round(rand);
    return rand;
};

DT.genRandomBetween = function (min, max) {
    return Math.random() * (max - min) + min;
};

DT.getSign = function () {
    var signVal = Math.random() - 0.5;
    return Math.abs(signVal)/signVal;
};

DT.bump = function (amp) {
    if (DT.player.isInvulnerability) return;
    for (var i = 0; i < 2; i++) {
        amp = amp || 0.15;
        DT.sphere.position.x += DT.getSign() * amp;
        DT.sphere.position.y += DT.getSign() * amp;
    }
 };

 DT.runApp = function () {
    DT.playSound(2);
            $(function() {
                $(".loader").fadeOut(250);
                $(".choose_control").css({"display": "table", "opacity": "0"}).animate({"opacity": "1"}, 250);
                $(".choose_wasd").click(function() {
                    $(".choose_control").fadeOut(250, function() {
                        DT.startGame();
                        DT.stopSound(2);
                        DT.playSound(0);
                    });
                });
                $(".choose_mobile").click(function() {
                    DT.initPhoneController();
                });
                $(".choose_webcam").click(function() {
                    DT.enableWebcam();
                });
            });
};

DT.pauseOn = function () {
    if (!DT.gameWasPaused) {
        $(".menu_page").css({"display": "table"});
        DT.stopSoundBeforPause();
        // DT.soundPause.update();
        DT.soundPause.play();
        cancelAnimationFrame(DT.id);
        DT.gameWasPaused = !DT.gameWasPaused;
    }
};

DT.pauseOff = function () {
    if (DT.gameWasPaused) {
        $(".menu_page").css({"display": "none"});
        DT.playSoundAfterPause();
        // DT.soundPause.update();
        DT.soundPause.play();
        DT.startGame();
        DT.gameWasPaused = !DT.gameWasPaused;
    }
};

$(function(){
    $(".menu_button").click(function() {
        DT.pauseOn();
    });
    $(".resume").click(function() {
        DT.pauseOff();
    });
    $(".music_button").click(DT.handlers.mute);
    $(document).keyup(function(event) {
        var k = event.keyCode;
        if (k === 77) {
            DT.handlers.mute();
        }
    });
    $(document).keyup(function(event) {
        var k = event.keyCode;
        if (k === 70) {
            THREEx.FullScreen.request();
        }
    });


// BACKGROUND
DT.backgroundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(44, 22, 0),
    new THREE.MeshBasicMaterial({
        map: DT.bgTexture
    }));
DT.backgroundMesh.material.depthTest = false;
DT.backgroundMesh.material.depthWrite = false;
DT.backgroundMesh.visible = false;
DT.scene.add(DT.backgroundMesh);


// MUSIC
var context,
    counter = 0,
    buffers = [], sources=[], destination, analysers = [],
    freqDomain = [],
    initSound, loadSoundFile,
    visualize, getFrequencyValue,
    onRenderFcts = DT.onRenderFcts,
    globalVolume = DT.param.globalVolume;

var audio = new Audio();
var canPlayOgg = !!audio.canPlayType && audio.canPlayType('audio/ogg; codecs="vorbis"') != "";
console.log("canPlayOgg", canPlayOgg);
try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
}
catch(e) {
    alert('Opps.. Your browser do not support audio API');
}

DT.stopSound = function(index){
    if (DT.music.stopped[index] === false) {
        if (index === 0 || DT.music.paused[index] === false) {
            DT.music.pausedAt[index] = Date.now() - DT.music.startedAt[index];
        } 
        sources[index].stop(index);
        DT.music.stopped[index] = true;
        DT.music.started[index] = false;
    }
};

DT.gainNodes = [];
DT.playSound = function(index){

    var gainNodes = DT.gainNodes;
    if (!DT.music.started[index]) {
        DT.music.started[index] = true;

        sources[index] = context.createBufferSource();
        sources[index].loop = true;
        sources[index].buffer = buffers[index];

        destination = context.destination;

        gainNodes[index] = context.createGain();
        gainNodes[index].gain.value = DT.param.globalVolume;

        analysers[index] = context.createAnalyser();
        analysers[index].fftSize = 2048;
        analysers[index].minDecibels = -50;
        analysers[index].maxDecibels = -20;

        sources[index].connect(gainNodes[index]);
        gainNodes[index].connect(analysers[index]);
        analysers[index].connect(destination);

        onRenderFcts.push(function() {
            visualize(index);
        });

        DT.music.stopped[index] = false;
        if (DT.music.pausedAt[index]) {
            DT.music.startedAt[index] = Date.now() - DT.music.pausedAt[index];
            sources[index].start(index, DT.music.pausedAt[index] / 1000);
        } else {
            DT.music.startedAt[index] = Date.now();
            sources[index].start(index);
        }
    }
};

DT.stopSoundBeforPause = function() {
    DT.music.stopped.forEach(function(el, i) {
        DT.music.paused[i] = el;
        DT.stopSound(i);
    });
};

DT.playSoundAfterPause = function() {
    DT.music.paused.forEach(function(el, i) {
        if (!el) {
            DT.playSound(i);
        }
    });
};


initSound = function(arrayBuffer, bufferIndex) {
    context.decodeAudioData(arrayBuffer, function(decodedArrayBuffer) {
        buffers[bufferIndex] = decodedArrayBuffer;
        console.log("ready sound " + bufferIndex);
        counter += 1;
        yepnope.showLoading(counter);
    }, function(e) {
        console.log('Error decoding file', e);
    });
}

loadSoundFile = function(urlArr, bufferIndex) {
    var xhr = new XMLHttpRequest();
    if (canPlayOgg) {
        xhr.open('GET', urlArr[bufferIndex], true);
    } else {
        xhr.open('GET', urlArr[bufferIndex + 3], true);
    }
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        initSound(this.response, bufferIndex); // this.response is an ArrayBuffer.
    };
    xhr.send();
}

loadSoundFile(DT.music, 0);
loadSoundFile(DT.music, 1);
loadSoundFile(DT.music, 2);

visualize = function(index) {
    freqDomain[index] = new Uint8Array(analysers[index].frequencyBinCount);
    analysers[index].getByteFrequencyData(freqDomain[index]);
    DT.valueAudio = getFrequencyValue(DT.audio.frequency[index], index);
};

getFrequencyValue = function(frequency, bufferIndex) {
    var nyquist = context.sampleRate/2,
        index = Math.round(frequency/nyquist * freqDomain[bufferIndex].length);
    return freqDomain[bufferIndex][index];
};

// SOUNDS
var ext = "ogg";
if (!canPlayOgg) {
    ext = "mp3";
}
DT.soundCoin = DT.webaudio.createSound().load(DT.sounds.soundCoin + ext);
DT.soundGameover = DT.webaudio.createSound().load(DT.sounds.soundGameover + ext);
DT.soundPause = DT.webaudio.createSound().load(DT.sounds.soundPause + ext);
DT.soundStoneDestroy = DT.webaudio.createSound().load(DT.sounds.soundStoneDestroy + ext);
DT.soundStoneMiss = DT.webaudio.createSound().load(DT.sounds.soundStoneMiss + ext);


// BLUR
// var renderer = DT.renderer,
//     scene = DT.scene,
//     camera = DT.camera,
//     composer,
//     hblur, vblur,
//     bluriness = 0,
//     winResizeBlur;

// composer = new THREE.EffectComposer( renderer );
// composer.addPass( new THREE.RenderPass( scene, camera ) );

// hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
// hblur.uniforms[ "h" ].value *= bluriness;
// composer.addPass( hblur );

// vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
// vblur.uniforms[ "v" ].value *= bluriness;
// vblur.renderToScreen = true;
// composer.addPass( vblur );
// DT.composer = composer;
// winResizeBlur   = new THREEx.WindowResize(composer, camera);

// add update function to webaudio prototype
WebAudio.Sound.prototype.update = function() {
    this.volume(DT.param.globalVolume);
};
WebAudio.Sound.prototype.play       = function(time){
    this.volume(DT.param.globalVolume);
    // handle parameter polymorphism
    if( time ===  undefined )   time    = 0;
    // if not yet playable, ignore
    // - usefull when the sound download isnt yet completed
    if( this.isPlayable() === false )   return;
    // clone the bufferSource
    var clonedNode  = this._chain.cloneBufferSource();
    // set the noteOn
    clonedNode.start(time);
    // create the source object
    var source  = {
        node    : clonedNode,
        stop    : function(time){
            if( time ===  undefined )   time    = 0;
            this.node.stop(time);
            return source;  // for chained API
        }
    }
    // return it
    return source;
};
// change IcosahedronGeometry prototype
THREE.IcosahedronGeometry = function ( radius, detail ) {
    this.radius = radius;
    this.detail = detail;
    var t = ( 1 + Math.sqrt( 5 ) ) / 2;
    var vertices = [
        [ -1,  t,  0 ], [  1, t, 0 ], [ -1, -t,  0 ], [  1, -t,  0 ],
        [  0, -1,  t ], [  0, 1, t ], [  0, -1, -t ], [  0,  1, -t ],
        [  t,  0, -1 ], [  t, 0, 1 ], [ -t,  0, -1 ], [ -t,  0,  1 ]
    ];

    vertices = vertices.map(function(el) {
        return el.map(function(el) {
            return el * Math.random();
        });
    });

    var faces = [
        [ 0, 11,  5 ], [ 0,  5,  1 ], [  0,  1,  7 ], [  0,  7, 10 ], [  0, 10, 11 ],
        [ 1,  5,  9 ], [ 5, 11,  4 ], [ 11, 10,  2 ], [ 10,  7,  6 ], [  7,  1,  8 ],
        [ 3,  9,  4 ], [ 3,  4,  2 ], [  3,  2,  6 ], [  3,  6,  8 ], [  3,  8,  9 ],
        [ 4,  9,  5 ], [ 2,  4, 11 ], [  6,  2, 10 ], [  8,  6,  7 ], [  9,  8,  1 ]
    ];
    THREE.PolyhedronGeometry.call( this, vertices, faces, radius, detail );

};
THREE.IcosahedronGeometry.prototype = Object.create( THREE.Geometry.prototype );

// add method repeat
String.prototype.repeat = function(num) {
    return new Array( num + 1 ).join( this );
};
// LOADER
var loader = new THREE.JSONLoader(true), // init the loader util
    loadModel,
    listOfModels = DT.listOfModels;

// init loading
loadModel = function(modelObj) {
    loader.load('js/models/' + modelObj.name + '.js', function (geometry, materials) {
    // create a new material
    if (modelObj.name === "bonusE") {
        modelObj.material = new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true } );
        modelObj.material.emissive.r = modelObj.material.color.r * 0.5;
        modelObj.material.emissive.g = modelObj.material.color.g * 0.5;
        modelObj.material.emissive.b = modelObj.material.color.b * 0.5;
    } else {
        modelObj.material = new THREE.MeshFaceMaterial( materials );
        // shining of bonuses
        modelObj.material.materials.forEach(function (el) {
            el.emissive.r = el.color.r * 0.5;
            el.emissive.g = el.color.g * 0.5;
            el.emissive.b = el.color.b * 0.5;
        });
    }

    modelObj.geometry = geometry;

    });
    return modelObj;
};

listOfModels.map(function(el) {
    loadModel(el);
});

// WEBCAM CONTROL
DT.enableWebcam = function () {
    // Game config
    var leftBreakThreshold = -5;
    var leftTurnThreshold = -10;
    var rightBreakThreshold = 5;
    var rightTurnThreshold = 10;
    // Получаем элементы video и canvas
    
    var videoInput = document.getElementById('vid');
    var canvasInput = document.getElementById('compare');
    var debugOverlay = document.getElementById('debug');

    var canvasContext = canvasInput.getContext('2d');
    // переворачиваем canvas зеркально по горизонтали
    canvasContext.translate(canvasInput.width, 0);
    canvasContext.scale(-1, 1);

    debugOverlay.style.height = '100%';
    debugOverlay.style.opacity = '0.1';
    debugOverlay.style.zIndex = '0';
    
    // Определяем сообщения, выдаваемые библиотекой
    
    statusMessages = {
        "whitebalance" : "Проверка камеры или баланса белого",
        "detecting" : "Обнаружено лицо",
        "hints" : "Что-то не так, обнаружение затянулось. Попробуйте сместиться относительно камеры",
        "redetecting" : "Лицо потеряно, поиск..",
        "lost" : "Лицо потеряно",
        "found" : "Слежение за лицом"
    };
    
    supportMessages = {
        "no getUserMedia" : "Браузер не поддерживает getUserMedia",
        "no camera" : "Не обнаружена камера."
    };
    
    document.addEventListener("headtrackrStatus", function(event) {
        if (event.status in supportMessages) {
            console.log(supportMessages[event.status]);
            $(".message").html(supportMessages[event.status])
        } else if (event.status in statusMessages) {
            console.log(statusMessages[event.status]);
            $(".message").html(statusMessages[event.status])
        }
        if (event.status === "found" && !DT.gameWasStarted) {
            DT.startGame();
            DT.stopSound(2);
            DT.playSound(0);
            $(".choose_control").fadeOut(250);
        }
    }, true);
    
    // Установка отслеживания
    
    var htracker = new headtrackr.Tracker({altVideo : {ogv : "", mp4 : ""}, calcAngles : true, ui : false, headPosition : false, debug : debugOverlay});
    htracker.init(videoInput, canvasInput);
    htracker.start();
    
    // Рисуем прямоугольник вокруг «пойманного» лица
    
    document.addEventListener("facetrackingEvent", function( event ) {
        // once we have stable tracking, draw rectangle
        if (event.detection == "CS") {
            var angle = Number(event.angle *(180/ Math.PI)-90);
            // console.log(angle);
            if(angle < leftBreakThreshold) {
                if(angle > leftTurnThreshold) {
                    DT.player.destPoint.x = 0;
                } else {
                    DT.player.destPoint.x = -DT.param.spacing;
                }
            } else if (angle > rightBreakThreshold) {
                if(angle < rightTurnThreshold) {
                    DT.player.destPoint.x = 0;
                } else {
                    DT.player.destPoint.x = DT.param.spacing;
                }
            } else {
                DT.player.destPoint.x = 0;
            }
        }
    });
};

DT.initPhoneController = function() {
    if (DT.initPhoneController.message) {
        $(".message").html(DT.initPhoneController.message);
    }
    // Game config
    var leftBreakThreshold = -3;
    var leftTurnThreshold = -20;
    var rightBreakThreshold = 3;
    var rightTurnThreshold = 20;

    // If client is not a phone
    if( !/iP(ad|od|hone)|Android|Blackberry|Windows Phone/i.test(navigator.userAgent)) {
        // If client is browser game
        var server = window.location.origin;
        if (server === "http://127.0.0.1:8888") {
            server = 'http://192.168.1.34:8888';
        }
        DT.initPhoneController.socket = io.connect(server);
        var socket = DT.initPhoneController.socket;
        // When initial welcome message, reply with 'game' device type
        socket.on('welcome', function(data) {
            socket.emit("device", {"type":"game"});
        })
        // We receive our game code to show the user
        socket.on("initialize", function(gameCode) {
            socket.gameCode = gameCode;
            $(".message").html("Please open <span style=\"color: red\">" + server +"/m</span> with your phone and enter code <span style=\"font-weight:bold; color: red\" id=\"socketId\"></span>");
            $("#socketId").html(gameCode);
            DT.initPhoneController.message = $(".message").html();
        });
        // When the user inputs the code into the phone client,
        //  we become 'connected'.  Start the game.
        socket.on("connected", function(data) {
            $("#gameConnect").hide();
            $("#status").hide();
            if (!DT.gameWasStarted) {
                DT.startGame();
                DT.stopSound(2);
                DT.playSound(0);
                $(".choose_control").fadeOut(250);
                DT.gameWasStarted = true;
            }
        });

        // When the phone is turned, turn the vehicle
        socket.on('turn', function(turn) {
            if(turn < leftBreakThreshold) {
                if(turn > leftTurnThreshold) {
                    DT.player.destPoint.x = 0;
                } else {
                    DT.player.destPoint.x = -DT.param.spacing;
                }
            } else if (turn > rightBreakThreshold) {
                if(turn < rightTurnThreshold) {
                    DT.player.destPoint.x = 0;
                } else {
                    DT.player.destPoint.x = DT.param.spacing;
                }
            } else {
                DT.player.destPoint.x = 0;
            }
        });
        socket.on('click', function(click) {
            if (click === "left") {
                DT.changeDestPoint(0, -1, DT.player.destPoint);
            }
            if (click === "right") {
                DT.changeDestPoint(0, 1, DT.player.destPoint);
            }
            if (click === "restart") {
                console.log(click);
                DT.restart();
            }
        });
    }
};

DT.updateGameTimer = function (timer) {
    var sec, min;
    sec = timer / 60;
    min = Math.floor(sec / 60);
    sec = sec % 60;
    sec < 10 ? sec = "0" + sec.toString() : sec;
    $(".gameTimer").html(min + ":" + sec);
}

});

// STATS
var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
var body = document.getElementsByTagName("body")[0];
    body.appendChild( stats.domElement );
var stats2 = new Stats();
    stats2.setMode(1); // 0: fps, 1: ms
    stats2.domElement.style.position = 'absolute';
    stats2.domElement.style.top = '0px';
    stats2.domElement.style.left = '80px';
    stats2.domElement.style.zIndex = 100;
var body = document.getElementsByTagName("body")[0];
    body.appendChild( stats2.domElement );