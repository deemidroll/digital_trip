// define namespace object
// Digital Trip
var DT = {
    player: {
        currentHelth: 100,
        currentScore: 0,
        destPoint: {x: 0, y: 0},
        isInvulnerability: false
    },
    param: {
        spawnCoord: -200,
        opacityCoord: 2,
        dieCoord: 7,
        stonesCloseness: 18,
        globalVolume: 1
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
            return this.value + this.changer;
        }
    },
    collections: {
        stones: [],
        fragments: [],
        coins: [],
        bonuses: [],
        caughtBonuses: []
    },
    webaudio: new WebAudio(),
    sounds: {
        soundCoin: 'sounds/coin.wav',
        soundGameover: 'sounds/gameover.wav',
        soundPause: 'sounds/pause.wav',
        soundStoneDestroy: 'sounds/stoneDestroy.wav',
        soundStoneMiss: 'sounds/stoneMiss.wav'
    },
    music: {
        0: 'sounds/theField_overTheIce.mp3',
        1: 'sounds/dubstep.mp3',
        2: 'sounds/space_ambient.mp3'
    },
    renderer: new THREE.WebGLRenderer(),
    camera: new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 300),
    scene: new THREE.Scene(),
    composer: null,
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
            scale: {x: 0.5, y: 0.5, z: 0.5},
            rotation: {x: 0, y: 0, z: 0}
    }],
    valueAudio: 0,
    startunnel: {
        positionStyle  : Type.CUBE,
        positionBase   : new THREE.Vector3( 0, 0, -200 ),
        positionSpread : new THREE.Vector3( 10, 10, 10 ),

        velocityStyle  : Type.CUBE,
        velocityBase   : new THREE.Vector3( 0, 0, 100 ),
        velocitySpread : new THREE.Vector3( 5, 5, 80 ), 
        
        angleBase               : 0,
        angleSpread             : 720,
        angleVelocityBase       : 10,
        angleVelocitySpread     : 0,
        
        particleTexture : THREE.ImageUtils.loadTexture( 'img/spikey.png' ),

        sizeBase    : 1.0,
        sizeSpread  : 0.5,              
        colorBase   : new THREE.Vector3(0.0, 0.0, 0.2), // H,S,L
        opacityBase : 1,
        blendStyle  : THREE.AdditiveBlending,

        particlesPerSecond : 250,
        particleDeathAge   : 4.0,       
        emitterDeathAge    : 5
    }
};
// auxiliary functions
DT.getDistance = function (x1, y1, z1, x2, y2, z2) {
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)+(z1-z2)*(z1-z2));
};

DT.genCoord = function(delta) {
    var offset = delta || 2.5,
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

DT.invulnerTimeout;
DT.dontFeelPain = function (time) {
    clearTimeout(DT.invulnerTimeout);
    DT.player.isInvulnerability = true;
    DT.scene.add(DT.shield);
    DT.invulnerTimeout = setTimeout(function() {
        DT.player.isInvulnerability = false;
        DT.scene.remove(DT.shield);
        clearTimeout(DT.invulnerTimeout);
    }, time || 10000);
};

////////////////////////////////////////////
// использовать очередь функций 

DT.blink = {
    color: new THREE.Color(),
    frames: 0,
    framesLeft: 0,
    dr: 0,
    dg: 0,
    db: 0
};

DT.blink.doBlink = function (color, frames) {
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
    clearTimeout(DT.makeFunTimer);
    DT.stopSound(0);
    DT.stopSound(1);
    DT.soundGameover.update();
    DT.soundGameover.play();
    $(function(){
        $(".total_coins").text(DT.currentScore);
        $(".game_over").css({"display": "table", "opacity": "0"}).animate({"opacity": "1"}, 1000);
        $(document).unbind("keydown").unbind("keyup");
    });
    setTimeout(function() {
        cancelAnimationFrame(DT.id);
    }, 300);
    DT.oneMoreTime();
};

DT.oneMoreTime = function() {
    $('.one_more_time').click(function() {
        location.reload();
    });
}

DT.hit = function() {
    $(function(){
        $(".error").html("ERROR " + DT.genRandomFloorBetween(500, 511));
        $(".hit").css({"display": "table"}).fadeOut(250);
    });
};

DT.generateStone = function (scene, arr, spawnCoord) {
    var radius, color, x, y, depth,
        part = Math.random();
    if (part > 0.5) {
        x = Math.random() * 10 - 5,
        y = Math.random() * 10 - 5;
    } else {
        x = Math.random() * 30 - 15,
        y = Math.random() * 30 - 15;
    }
        if (Math.abs(x) > 5 || Math.abs(y) > 5) {
            radius = DT.genRandomBetween(1.5, 3);
            color = new THREE.Color(0x555555);
        } else {
            radius = DT.genRandomBetween(1.5, 2.5);
            depth = DT.genRandomFloorBetween(100, 153)/255;
            color = new THREE.Color().setRGB(depth, depth, depth);
        }

    var geometry = new THREE.IcosahedronGeometry(radius, 0),
        material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading, color: color}),
        stone = new THREE.Mesh( geometry, material );
        stone.position.x = x;
        stone.position.y = y;
        stone.position.z = Math.random() * 4 + spawnCoord;
        stone.rotation.x = Math.random();
        stone.rotation.y = Math.random();
        arr.push(stone);
        scene.add(stone);
};

DT.generateFragments = function (scene, arr, x, y, z, numb) {
    var geometry, 
        material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading}),
        numb = numb || 2,
        fragment;
    for (var i = 0; i < 20; i++) {
        geometry = new THREE.IcosahedronGeometry(DT.genRandomBetween(0.1, 1), 0);
        fragment = new THREE.Mesh( geometry, material );
        fragment.position.x = x + Math.random() * numb - 0.5 * numb;
        fragment.position.y = y + Math.random() * numb - 0.5 * numb;
        fragment.rotation.x = Math.random();
        fragment.rotation.y = Math.random();
        arr.push(fragment);
        scene.add(fragment);
    }
};

DT.genCoins = function (scene, arr, spawnCoord, x, y, zAngle) {
    var r = 0.25,
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
    var listOfModels = DT.listOfModels;
    var type = DT.genRandomFloorBetween(0, 2);
    // var type = 2;
    var geometry = listOfModels[type].geometry,
        material = listOfModels[type].material,
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
    var newPos = dx * 2.5;

    if (destPoint.x < 2.5 && dx > 0) {
        destPoint.x += dx * 2.5;
    }
    if (destPoint.x > -2.5 && dx < 0) {
        destPoint.x += dx * 2.5;
    }
    if (destPoint.y < 2.5 && dy > 0) {
        destPoint.y += dy * 2.5;
    }
    if (destPoint.y > -2.5 && dy < 0) {
        destPoint.y += dy * 2.5;
    }
};

DT.moveSphere = function(sphere, destPoint) {
    ["x", "y"].forEach(function(aix) {
        var dx = destPoint[aix] - sphere.position[aix];
        if (Math.abs(dx) > 0.01) {
            sphere.position[aix] += dx > 0 ? 0.1 : -0.1;
        }
    });
};

DT.makeFun = function(time) {
    clearTimeout(DT.makeFunTimer);
    DT.speed.setChanger(-3);
    DT.stopSound(0);
    DT.playSound(1);
    DT.rainbow = setInterval(
                function() {
                    var color;
                    switch (DT.genRandomFloorBetween(0, 5)) {
                        case 0:
                        color = "orange";
                        break;
                        case 1:
                        color = "yellow";
                        break;
                        case 2:
                        color = "green";
                        break;
                        case 3:
                        color = "DeepSkyBlue";
                        break;
                        case 4:
                        color = "blue";
                        break;
                        case 5:
                        color = "DarkSlateBlue";
                        break;
                        default:
                        color = "white";
                        break;
                    }
                    DT.blink.doBlink(color, 2);
                }, 100);
    DT.makeFunTimer = setTimeout(function() {
        DT.speed.setChanger(0);
        DT.stopSound(1);
        DT.playSound(0);
        clearInterval(DT.rainbow);
        clearTimeout(DT.makeFunTimer);
        DT.blink.doBlink("red", 2);
    }, time || 21500);
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

$(function(){
    $(".menu_button").click(function() {
        $(".menu_page").css({"display": "table"});
        DT.soundPause.update();
        DT.soundPause.play();
        DT.pauseSoundOn();
        cancelAnimationFrame(DT.id);
    });
    $(".menu_page").click(function() {
        $(".menu_page").css({"display": "none"});
        DT.soundPause.update();
        DT.soundPause.play();
        DT.pauseSoundOff();
        DT.startGame();
    });
    $(".music_button").click(function() {
        if (DT.param.globalVolume) {
            DT.param.globalVolume = 0;
            $(".music_button").html("N");
        } else {
            DT.param.globalVolume = 1;
            $(".music_button").html("M");
        }
        DT.gainNodes.forEach(function(el) {
                if (el) {
                    el.gain.value = DT.param.globalVolume;
                }
        });
    });
    // control
    $(document).keydown(function() {
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
            DT.speed.setChanger(3);
            if (DT.makeFunTimer) {
                DT.stopSound(1);
                DT.playSound(0);
                clearInterval(DT.rainbow);
                clearTimeout(DT.makeFunTimer);
            }
        }
        if (k === 17) {
            DT.makeFun();
        }
    });

    $(document).keyup(function() {
        var k = event.keyCode;
        // speedDown
        if (k === 16) {
            DT.speed.setChanger(0);
        }
    });

// SOUNDS
DT.soundCoin = DT.webaudio.createSound().load(DT.sounds.soundCoin);
DT.soundGameover = DT.webaudio.createSound().load(DT.sounds.soundGameover);
DT.soundPause = DT.webaudio.createSound().load(DT.sounds.soundPause);
DT.soundStoneDestroy = DT.webaudio.createSound().load(DT.sounds.soundStoneDestroy);
DT.soundStoneMiss = DT.webaudio.createSound().load(DT.sounds.soundStoneMiss);

// MUSIC
var context = new window.AudioContext(),
    counter = 0,
    buffers = [], sources=[], destination, analysers = [],
    startedAt = [], pausedAt = [], stopped = [], paused = [], started = [],
    freqDomain = [],
    initSound, loadSoundFile,
    visualize, getFrequencyValue,
    onRenderFcts = DT.onRenderFcts,
    globalVolume = DT.param.globalVolume;

DT.stopSound = function(index){
    if (stopped[index] === false) {
        if (index === 0 || paused[index] === false) {
            pausedAt[index] = Date.now() - startedAt[index];
        } 
        sources[index].stop(index);
        stopped[index] = true;
        started[index] = false;
    }
};

DT.playSound = function(index){

    var gainNodes = DT.gainNodes = [];
    if (!started[index]) {
        started[index] = true;

        sources[index] = context.createBufferSource();
        sources[index].buffer = buffers[index];

        destination = context.destination;

        gainNodes[index] = context.createGain();
        gainNodes[index].gain.value = globalVolume;

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

        stopped[index] = false;
        if (pausedAt[index]) {
            startedAt[index] = Date.now() - pausedAt[index];
            sources[index].start(index, pausedAt[index] / 1000);
        } else {
            startedAt[index] = Date.now();
            sources[index].start(index);
        }
    }
};

DT.pauseSoundOn = function() {
    stopped.forEach(function(el, i) {
        paused[i] = el;
        DT.stopSound(i);
    });
};

DT.pauseSoundOff = function() {
    paused.forEach(function(el, i) {
        if (!el) DT.playSound(i);
        el = false;
        startedAt[i] = 0;
    });

};

initSound = function(arrayBuffer, bufferIndex) {
    context.decodeAudioData(arrayBuffer, function(decodedArrayBuffer) {
        buffers[bufferIndex] = decodedArrayBuffer;
        console.log("ready sound " + bufferIndex);
        counter += 1;
        if (counter === 3) {
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
                $(".choose_webcam").click(function() {
                    DT.enableWebcam();
                });
            });
        }
    }, function(e) {
        console.log('Error decoding file', e);
    });
}

loadSoundFile = function(url, bufferIndex) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        initSound(this.response, bufferIndex); // this.response is an ArrayBuffer.
    };
    xhr.send();
}

loadSoundFile('sounds/theField_overTheIce.mp3', 0);
loadSoundFile('sounds/dubstep.mp3', 1);
loadSoundFile('sounds/space_ambient.mp3', 2);

visualize = function(index) {
    freqDomain[index] = new Uint8Array(analysers[index].frequencyBinCount);
    analysers[index].getByteFrequencyData(freqDomain[index]);
    DT.valueAudio = getFrequencyValue(400, index);
};

getFrequencyValue = function(frequency, bufferIndex) {
    var nyquist = context.sampleRate/2,
        index = Math.round(frequency/nyquist * freqDomain[bufferIndex].length);
    return freqDomain[bufferIndex][index];
};

// BLUR
var renderer = DT.renderer,
    scene = DT.scene,
    camera = DT.camera,
    composer,
    hblur, vblur,
    bluriness = 0.5,
    winResizeBlur;

composer = new THREE.EffectComposer( renderer );
composer.addPass( new THREE.RenderPass( scene, camera ) );

hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
hblur.uniforms[ "h" ].value *= bluriness;
composer.addPass( hblur );

vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
vblur.uniforms[ "v" ].value *= bluriness;
vblur.renderToScreen = true;
composer.addPass( vblur );
DT.composer = composer;
winResizeBlur   = new THREEx.WindowResize(composer, camera);
// add update function to webaudio prototype
WebAudio.Sound.prototype.update = function() {
    this.volume(DT.param.globalVolume);
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

THREE.DodecahedronGeometry = function ( radius, detail ) {

    // http://en.wikipedia.org/wiki/Dodecahedron#Cartesian_coordinates

    var p = (1 + Math.sqrt(5))/2,
        q = 1/p;

    var vs = [          //  x   y   z
        new THREE.Vector3(  0,  q,  p), //  0  green
        new THREE.Vector3(  0,  q, -p), //  1
        new THREE.Vector3(  0, -q,  p), //  2
        new THREE.Vector3(  0, -q, -p), //  3

        new THREE.Vector3(  p,  0,  q), //  4  pink
        new THREE.Vector3(  p,  0, -q), //  5
        new THREE.Vector3( -p,  0,  q), //  6
        new THREE.Vector3( -p,  0, -q), //  7

        new THREE.Vector3(  q,  p,  0), //  8  blue
        new THREE.Vector3(  q, -p,  0), //  9
        new THREE.Vector3( -q,  p,  0), // 10
        new THREE.Vector3( -q, -p,  0), // 11

        new THREE.Vector3(  1,  1,  1), // 12  orange
        new THREE.Vector3(  1,  1, -1), // 13
        new THREE.Vector3(  1, -1,  1), // 14
        new THREE.Vector3(  1, -1, -1), // 15
        new THREE.Vector3( -1,  1,  1), // 16
        new THREE.Vector3( -1,  1, -1), // 17
        new THREE.Vector3( -1, -1,  1), // 18
        new THREE.Vector3( -1, -1, -1)] // 19

    var faces = [
        [16,0,2,18,6],

        [16,10,8,12,0],
        [0,12,4,14,2],
        [2,14,9,11,18],
        [18,11,19,7,6],
        [6,7,17,10,16],

        [1,17,10,8,13],
        [13,8,12,4,5],
        [5,4,14,9,15],
        [15,9,11,19,3],
        [3,19,7,17,1],

        [1,13,5,15,3]
    ]

    var list = new Array();

    faces.forEach(function(indices) {
        var vertices = indices.map(function(i) { return (vs[i]); }),
            geometry = new THREE.ConvexGeometry(vertices),
            material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, opacity: 0.4 }),
            mesh     = new THREE.Mesh(geometry, material);

        list.push(mesh);
    })

    return list;
};

THREE.DodecahedronGeometry.prototype = Object.create( THREE.Geometry.prototype );
// add method repeat
String.prototype.repeat = function(num) {
    return new Array( num + 1 ).join( this );
};
// LOADER
var loader = new THREE.JSONLoader(), // init the loader util
    loadModel,
    listOfModels = DT.listOfModels;

// init loading
loadModel = function(modelObj) {
    loader.load('js/' + modelObj.name + '.js', function (geometry, materials) {
    // create a new material
    modelObj.material = new THREE.MeshFaceMaterial( materials );
    // shining of bonuses
    modelObj.material.materials.forEach(function(el){
        el.emissive.r = el.color.r * 0.5;
        el.emissive.g = el.color.g * 0.5;
        el.emissive.b = el.color.b * 0.5;
    });

    modelObj.geometry = geometry;

    });
    return modelObj;
};

listOfModels.map(function(el) {
    loadModel(el);
});

});

// STATS
var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
var body = document.getElementsByTagName("body")[0];
    body.appendChild( stats.domElement );