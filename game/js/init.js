var DT = (function () {
    'use strict';
    var DT = {},
        THREE = window.THREE || undefined,
        WebAudio = window.WebAudio || undefined,
        $ = window.$ || undefined,
        requestAnimationFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            undefined,
        cancelAnimationFrame = window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            undefined,
        THREEx = window.THREEx || undefined;
    // Player Singleton Constructor
    DT.Player = function (options) {
        if (!DT.Player.__instance) {
            DT.Player.__instance = this;
        } else {
            return DT.Player.__instance;
        }
        this.currentHelth = options.currentHelth || 100;
        this.currentScore = options.currentScore || 0;
        this.destPoint = options.destPoint || {x: 0, y: 0};
        this.isInvulnerability = options.isInvulnerability || false;
        this.isFun = options.isFun || false;
        this.invulnerTimer = null;
        this.funTimer = null;
        this.jump = options.jump || false;
        this.jumpLength = 0; // not use
        this.jumpOffset = 2.2; // not use
    };

    DT.Player.prototype.changeHelth = function(delta) {
        if (delta > 0 || this.isInvulnerability === false) {
            var helth = this.currentHelth;
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
            this.currentHelth = helth;
            $(function(){
                $('.helth').animate({
                    width: helth + '%'
                });
            });
        }
        return this;
    };

    DT.Player.prototype.makeInvuler = function (time) {
        this.invulnerTimer = (time || 10000) / 1000 * 60;
        this.isInvulnerability = true;
        // TODO: умешьшить связанность
        DT.shiels.addToScene();
        return this;
    };

    DT.Player.prototype.stopInvulner = function () {
        this.invulnerTimer = 0;
        return this;
    };

    DT.Player.prototype.changeScore = function(delta) {
        this.currentScore += delta;
        $(function(){
            $('.current_coins').text(this.currentScore);
        });
        return this;
    };

    DT.Player.prototype.makeFun = function(time) {
        this.isFun = true;
        this.funTimer = (time || 10000) / 1000 * 60;
        // TODO: переделать на метод
        DT.speed.setChanger(-18);
        DT.stopSound(0);
        DT.playSound(1);
        //
        return this;
    };

    DT.Player.prototype.stopFun = function () {
        this.funTimer = 0;
        return this;
    };

    DT.Player.prototype.updateInvulnerability = function () {
        if (this.isInvulnerability) {
            this.invulnerTimer -= 1;
            if (this.invulnerTimer <= 0) {
                this.isInvulnerability = false;
                // TODO: уменьшить связанность
                DT.shield.removeFromScene();
                //
            } else {
                return this;
            }
        }
    };

    DT.Player.prototype.updateFun = function () {
        if (DT.player.isFun) {
            DT.player.funTimer -= 1;
            if (DT.player.funTimer <= 0) {
                DT.player.isFun = false;
                DT.speed.setChanger(0);
                DT.stopSound(1);
                DT.playSound(0);
                clearInterval(DT.rainbow);
                DT.blink.doBlink("red", 5);
            } else {
                if (DT.player.funTimer % 6 === 0) {
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
                }
            }
        }
    };

    DT.Player.prototype.update = function () {
        this.updateInvulnerability();
        this.updateFun();
        return this;
    };

    DT.player = new DT.Player({
        currentHelth: 100,
        currentScore: 0,
        destPoint: {x: 0, y: -2.5},
        isInvulnerability: false,
        isFun: false,
        jump: false
    });

    // TODO: refactor
    DT.param = {
        spacing: 3,
        spawnCoord: -200,
        opacityCoord: 2,
        dieCoord: 30,
        stonesCloseness: 18,
        globalVolume: 1,
        prevGlobalVolume: 1
    };

    DT.speed = {
        value: 36,
        changer: 0,
        step: 0.6,
        increase: function () {
            this.value += (this.step / 60);
        },
        setChanger: function (changer) {
            this.changer = changer;
        },
        getChanger: function() {
            return this.changer;
        },
        getValue: function () {
            return (this.value + this.changer) / 60;
        }
    };

    DT.collections = {
        stones: [],
        fragments: [],
        coins: [],
        bonuses: [],
        caughtBonuses: []
    };

    DT.audio = {
        frequency: { // for audio visualization
            0: 400,
            1: 100
        },
        valueAudio: 0,
        webaudio: new WebAudio(),
        sounds: {
            catchCoin: 'sounds/coin.',
            gameover: 'sounds/gameover.',
            pause: 'sounds/pause.',
            stoneDestroy: 'sounds/stoneDestroy.',
            stoneMiss: 'sounds/stoneMiss.'
        },
        music: {
            0: 'sounds/theField_overTheIce.',
            1: 'sounds/heart.',
            2: 'sounds/space_ambient2.',
            started: [],
            startedAt: [],
            pausedAt: [],
            stopped: [],
            paused: []
        }
    };

    DT.renderer = new THREE.WebGLRenderer();

    DT.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 300);

    DT.scene = new THREE.Scene();

    DT.composer = null; // not use

    DT.onRenderFcts = [];

    DT.sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhongMaterial({color: 0xff0000}));

    DT.lights = {
        light: new THREE.PointLight(0xffffff, 0.75, 100),
        sphereLight: new THREE.PointLight(0xff0000, 1.75, 15),
        sphereLightning: new THREE.PointLight(0xff0000, 0.75, 7.5),
        directionalLight: new THREE.DirectionalLight(0xffffff, 0.25)
    };

    DT.id = null;

    DT.lastTimeMsec = null;

    DT.startGame = function() {
        // for stats
        setStats();
        // for timer
        $('.gameTimer').css({'display': 'block'});
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
                if (k === 38) {
                    changeDestPoint(1, 0, destPoint);
                }
                if (k === 40) {
                    changeDestPoint(-1, 0, destPoint);
                }
                if (k === 37) {
                    changeDestPoint(0, -1, destPoint);
                }
                if (k === 39) {
                    changeDestPoint(0, 1, destPoint);
                }
                // speedUp
                if (k === 16) {
                    DT.speed.setChanger(36);
                    if (DT.player.isFun) {
                        DT.stopSound(1);
                        DT.playSound(0);
                        clearInterval(DT.rainbow);
                        DT.player.isFun = false;
                        DT.blink.doBlink('red', 2);
                    }
                }
                if (k === 17) {
                    DT.player.makeFun();
                }
            });
            $(document).keyup(function(event) {
                var k = event.keyCode;
                // speedDown
                if (k === 16) {
                    DT.speed.setChanger(0);
                    DT.player.stopFun();
                }
            });
            $(document).keyup(DT.handlers.pauseOnSpace);
            DT.gameWasStarted = true;
        }
    };
    // 
    DT.GameObject = function (options) {
        this.tObject = new options.THREEConstructor(
            options.geometry,
            options.material
        );
        this.geometry = this.tObject.geometry;
        this.material = this.tObject.material;
        this.scene = options.scene || DT.scene;
    };
    DT.GameObject.prototype.addToScene = function () {
        this.scene.add(this.tObject);
    };
    DT.GameObject.prototype.removeFromScene = function () {
        this.scene.remove(this.tObject);
    };
    DT.GameObject.prototype.create = function () {
        // empty method
    };
    DT.GameObject.prototype.createAndAdd = function () {
        this.create();
        this.addToScene();
    };
    DT.GameObject.prototype.update = function (options) {
        this.updateGeometry(options.geometry);
        this.updateMaterial(options.material);
    };
    DT.GameObject.prototype.updateGeometry = function (options) {
        // empty method
    };
    DT.GameObject.prototype.updateMaterial = function (options) {
        // empty method
    };
    DT.GameObject.prototype.updateParam = function (param, options) {
        for (var prop in options) if (options.hasOwnProperty(prop)) {
            this.tObject[param][prop] += options[prop];
        }
    };
    DT.GameObject.prototype.setParam = function (param, options) {
        for (var prop in options) if (options.hasOwnProperty(prop)) {
            this.tObject[param][prop] = options[prop];
        }
    };

    // GameCollectionObject Constructor (Stone, Coin, Bonus)
    DT.GameCollectionObject = function (options) {
        DT.GameObject.apply(this, arguments);
        this.collection = options.collection;
    };
    DT.GameCollectionObject.prototype = Object.create(DT.GameObject.prototype);
    DT.GameCollectionObject.prototype.constructor = DT.GameCollectionObject;

    DT.GameCollectionObject.prototype.create = function () {
        this.collection.push(this);
    };

    DT.GameCollectionObject.prototype.removeFromScene = function () {
        DT.GameObject.prototype.removeFromScene.apply(this);
        var ind = this.collection.indexOf(this);
        if (ind !== -1) {
            this.collection.splice(ind, 1);
        }
    };

    // Shield Singleton Constructor
    DT.Shield = function (options) {
        if (!DT.Shield.__instance) {
            DT.Shield.__instance = this;
        } else {
            return DT.Shield.__instance;
        }
        DT.GameObject.apply(this, arguments);
        this.material.color = options.sphere.material.color;
        this.position = options.sphere.position;
    };
    DT.Shield.prototype = Object.create(DT.GameObject.prototype);
    DT.Shield.prototype.constructor = DT.Shield;

    DT.shield = new DT.Shield({
        THREEConstructor: THREE.Mesh,
        geometry: new THREE.CubeGeometry(1.3, 1.3, 1.3, 2, 2, 2),
        material: new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        }),
        sphere: DT.sphere
    });

    // Dust Constructor
    DT.Dust = function (options) {
        DT.GameObject.apply(this, arguments);
        this.number = options.number || 100;
    };
    DT.Dust.prototype = Object.create(DT.GameObject.prototype);
    DT.Dust.prototype.constructor = DT.Dust;

    DT.Dust.prototype.create = function () {
        for (var i = 0; i < this.number; i++) {
            this.geometry.vertices.push(new THREE.Vector3(
                DT.genRandomBetween(-10, 10),
                DT.genRandomBetween(-10, 10),
                DT.genRandomBetween(-100, 0)
            ));
        }
        this.material.visible = false;
    };

    DT.Dust.prototype.updateMaterial = function (options) {
        if (!this.material.visible) {
            this.material.visible = true;
        }
        this.material.color = options.isFun ? options.color : new THREE.Color().setRGB(
            options.valueAudio/1/1 || 70/255,
            options.valueAudio/255/1 || 68/255,
            options.valueAudio/255/1 || 81/255
        );
    };

    DT.Dust.prototype.updateGeometry = function (options) {
        this.geometry.vertices.forEach(function (el) {
            el.z += options.speed;
            if (el.z > 10) {
                el.x = DT.genRandomBetween(-10, 10);
                el.y = DT.genRandomBetween(-10, 10);
                el.z = -100;
            }
        });
        this.geometry.verticesNeedUpdate = true;
    };
    // Dust object 
    DT.dust = new DT.Dust({
        geometry: new THREE.Geometry({}),
        material: new THREE.ParticleSystemMaterial({size: 0.25}),
        THREEConstructor: THREE.ParticleSystem
    });

    DT.Stone = function (options) {
        var collection = options.collection,
            el = collection[collection.length -1];

        if (el) {
            var dist = DT.getDistance(0, 0, DT.param.spawnCoord,
                el.tObject.position.x, el.tObject.position.y, el.tObject.position.z);
            if (dist <= DT.param.stonesCloseness) {
                return;
            }
        }

        var radius, color, x, y, depth, geometry, material,
            part = Math.random();
        // 
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
        //
        if (Math.abs(x) > 5 || Math.abs(y) > 5) {
            radius = DT.genRandomBetween(1.5, 3);
            color = new THREE.Color(0x464451);
        } else {
            radius = DT.genRandomBetween(1, 2);
            depth = DT.genRandomFloorBetween(80, 100) / 255;
            color = new THREE.Color().setRGB(depth, depth, depth);
        }
        geometry = new THREE.IcosahedronGeometry(radius, 0);
        material = new THREE.MeshPhongMaterial({
            shading: THREE.FlatShading,
            color: color,
            specular: 0x111111,
            shininess: 100
        });
        DT.GameCollectionObject.apply(this, [{
            geometry: geometry,
            material: material,
            THREEConstructor: THREE.Mesh,
            collection: collection
        }]);
        this.setParam('position', {
            x: x,
            y: y,
            z: options.spawnCoord
        });
        this.setParam('rotation', {
            x: Math.random(),
            y: Math.random()
        });
        this.createAndAdd();
    };

    DT.Stone.prototype = Object.create(DT.GameCollectionObject.prototype);
    DT.Stone.prototype.constructor = DT.Stone;

    DT.Stone.prototype.update = function (options) {

            var el = this.tObject;

            if (el.position.z > options.dieCoord) {
                this.removeFromScene();
            } 
            if (el.position.z > DT.param.opacityCoord) {
                el.material.transparent = true;
                el.material.opacity = 0.5;
            }
            var distanceBetweenCenters = el.position.distanceTo(options.sphere.position),
                radiusesSum = options.sphere.geometry.radius + el.geometry.radius;
                
            if (distanceBetweenCenters < radiusesSum) {
                DT.audio.sounds.stoneDestroy.play();
                DT.sendSocketMessage({
                    type: 'vibr',
                    time: 200
                });
                this.removeFromScene();

                DT.player.changeHelth(-19);
                // вызвать вспышку экрана
                if (DT.player.isInvulnerability === false) {
                    DT.hit();
                }
            }
            if (distanceBetweenCenters > radiusesSum && distanceBetweenCenters < radiusesSum + 1 && el.position.z - options.sphere.position.z > 1) {
                DT.audio.sounds.stoneMiss.play();
            }
            if (DT.getDistance(options.sphere.position.x, options.sphere.position.y, el.position.z, el.position.x, el.position.y, el.position.z) < radiusesSum) {
                el.material.emissive = new THREE.Color().setRGB(
                    el.material.color.r * 0.5,
                    el.material.color.g * 0.5,
                    el.material.color.b * 0.5);
            } else {
                el.material.emissive = new THREE.Color().setRGB(0,0,0);
            }
            this.updateParam('rotation', {x: 0.014, y: 0.014});
            this.updateParam('position', {z: DT.speed.getValue()});
    };

    DT.makeFunTimer = null;
    DT.rainbow = null;
    DT.listOfModels = [
        {
            name: 'bonusH',
            scale: {x: 0.02, y: 0.02, z: 0.02},
            rotation: {x: Math.PI / 1.3, y: -Math.PI / 1.3, z: -Math.PI / 1.3}
        },
        {
            name: 'bonusI',
            scale: {x: 0.5, y: 0.5, z: 0.5},
            rotation: {x: Math.PI / 1.3, y: -Math.PI / 1.3, z: -Math.PI / 1.3}
        },
        {
            name: 'bonusE',
            scale: {x: 0.025, y: 0.025, z: 0.025},
            rotation: {x: 0, y: 0, z: 0}
        }];

    DT.blink = {
        color: new THREE.Color(),
        frames: 0,
        framesLeft: 0,
        dr: 0,
        dg: 0,
        db: 0,
        doBlink: function (color, frames) {
            var defClr = {r: 1, g: 0, b: 0};
            this.color = new THREE.Color(color);
            this.frames = frames;
            this.framesLeft = frames;
            this.dr = (defClr.r - this.color.r)/frames;
            this.dg = (defClr.g - this.color.g)/frames;
            this.db = (defClr.b - this.color.b)/frames;
        },
        update: function () {
            if (DT.blink.framesLeft === 0) {
                // DT.sphere.material.color = new THREE.Color("red");
                return;
            }
            if (DT.blink.framesLeft === DT.blink.frames) {
                DT.lights.sphereLight.color.r = DT.sphere.material.color.r = DT.blink.color.r;
                DT.lights.sphereLight.color.g = DT.sphere.material.color.g = DT.blink.color.g;
                DT.lights.sphereLight.color.b = DT.sphere.material.color.b = DT.blink.color.b;
            }
            if (DT.blink.framesLeft < DT.blink.frames) {
                DT.lights.sphereLight.color.r = DT.sphere.material.color.r += DT.blink.dr;
                DT.lights.sphereLight.color.g = DT.sphere.material.color.g += DT.blink.dg;
                DT.lights.sphereLight.color.b = DT.sphere.material.color.b += DT.blink.db;
            }
        DT.blink.framesLeft -= 1;
        },
    };

    DT.emittFragments = null; // not use
    DT.bgTexture = THREE.ImageUtils.loadTexture('img/bg.jpg');
    DT.gameWasStarted = false;
    DT.gameWasPaused = false;
    DT.gameWasOver = false;
    DT.handlers = {};
    DT.snapshot = null; // for restart
    DT.server = window.location.origin !== 'http://localhost' ? window.location.origin : 'http://10.0.1.2';
    DT.wasMuted = false;

    // HANDLERS
    DT.handlers.startOnSpace = function(event) {
        var k = event.keyCode;
        if (k === 32) {
            DT.startAfterChooseControl();
        }
    };
    DT.handlers.pauseOnSpace = function(event) {
        var k = event.keyCode;
        if (k === 32) {
            DT.handlers.pause();
        }
    };
    DT.handlers.restartOnSpace = function(event) {
        var k = event.keyCode;
        if (k === 32) {
            DT.handlers.restart();
        }
    };
    DT.handlers.fullscreen = function () {
        var isActivated = THREEx.FullScreen.activated();
        if (isActivated) {
            THREEx.FullScreen.cancel();
        } else {
            THREEx.FullScreen.request(document.body);
        }
    };
    DT.handlers.pause = function () {
        if (!DT.gameWasPaused) {
            DT.pauseOn();
        } else {
            DT.pauseOff();
        }
    };
    DT.handlers.mute = function() {
        if (DT.param.globalVolume === 1) {
            DT.setVolume(0);
            $('.music_button').html('N');
            DT.wasMuted = true;
        } else {
            DT.setVolume(1);
            $('.music_button').html('M');
            DT.wasMuted = false;
        }
    };
    DT.handlers.left = function () {
        DT.changeDestPoint(0, -1, DT.player.destPoint);
    };
    DT.handlers.right = function () {
        DT.changeDestPoint(0, 1, DT.player.destPoint);
    };
    DT.handlers.restart = function () {
        $('.game_over').hide();
        var iterator = function (el) {
            DT.scene.remove(el);
        };
        for (var collection in DT.collections) {
            if (DT.collections.hasOwnProperty(collection)) {
                DT.collections[collection].forEach(iterator);
            }
        }
        DT.player = $.extend(true, {}, DT.snapshot.player);
        $('.current_coins').html('0');
        $('.bonus').html('');
        $('.gameTimer').html('0:00');
        $('.helth').css({width: '100%'});
        DT.speed = $.extend(true, {}, DT.snapshot.speed);
        DT.collections = $.extend(true, {}, DT.snapshot.collections);
        DT.gameTimer = 0;
        // DT.gameWasStarted = false;
        DT.audio.music.startedAt = [];
        DT.audio.music.pausedAt = [];
        DT.audio.music.stopped = [];
        DT.audio.music.paused = [];
        DT.audio.music.started = [];
        DT.startGame();
        DT.playSound(0);
        $(document).bind('keyup', DT.handlers.pauseOnSpace);
        $(document).unbind('keyup', DT.handlers.restartOnSpace);
        $('#one_more_time').unbind('click');
    };
    // auxiliary functions
    DT.setVolume = function (volume) {
        DT.param.globalVolume = volume;
        if (DT.param.prevGlobalVolume !== DT.param.globalVolume) {
            DT.gainNodes.forEach(function(el) {
                if (el) {
                    el.gain.value = DT.param.globalVolume;
                }
            });
            DT.param.prevGlobalVolume = DT.param.globalVolume;
        }
    };
    // возвращает cookie с именем name, если есть или undefined
    DT.getCookie = function (name) {
        var matches = document.cookie.match(
            new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
        );
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    DT.getDistance = function (x1, y1, z1, x2, y2, z2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2));
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
    
    DT.gameOver = function() {
        DT.gameWasOver = true;
        clearTimeout(DT.player.isFun);
        DT.stopSound(0);
        DT.stopSound(1);
        // DT.soundGameover.update();
        DT.audio.sounds.gameover.play();
        $(function(){
            $('.total_coins').text(DT.player.currentScore);
            $('.game_over').css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 1000);
            // $(document).unbind('keydown').unbind('keyup');
        });
        setTimeout(function() {
            cancelAnimationFrame(DT.id);
        }, 300);
        DT.sendSocketMessage('gameover');
        DT.prepareToRestart();
    };

    DT.prepareToRestart = function() {
        $('#one_more_time').click(function () {
            DT.handlers.restart();
        });
        $(document).unbind('keyup', DT.handlers.pauseOnSpace);
        $(document).bind('keyup', DT.handlers.restartOnSpace);
    };

    DT.hit = function() {
        $(function(){
            $('.error').html('ERROR ' + DT.genRandomFloorBetween(500, 511));
            $('.hit').css({'display': 'table'}).fadeOut(250);
        });
    };

    // DT.generateFragments = function (scene, arr, x, y, z, numb) {
    //     var geometry, 
    //         material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading, color: 'red'}),
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
        
        var coin_cap_texture = THREE.ImageUtils.loadTexture('./img/avers.png'),
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
        coin.position.z = spawnCoord;
        coin.rotation.x = 1.5;
        coin.rotation.y = 0;
        coin.rotation.z = zAngle;
        arr.push(coin);
        scene.add(coin);
    };

    DT.genBonus = function (scene, arr, spawnCoord, x, y, listOfModels) {
        var type, geometry, material, bonus;
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
        if (type === 0) DT.player.changeHelth(100);
        // invulnerability
        if (type === 1) DT.player.makeInvuler();
        // entertainment
        if (type === 2) DT.player.makeFun();
    };

    DT.catchBonus = function (type) {
        var caughtBonuses = DT.collections.caughtBonuses;
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
            $('.bonus').text(function(){
                if (arr[0] === 0) return 'H '.repeat(n);
                if (arr[0] === 1) return 'I '.repeat(n);
                if (arr[0] === 2) return 'E '.repeat(n);
            });
        });
        if (n === 3) {
            $('.bonus').fadeOut(300, function(){
                $('.bonus').text('').fadeIn(100);
            });
        }
    };

    DT.changeDestPoint = function(dy, dx, destPoint) {
        if ((destPoint.x < DT.param.spacing && dx > 0) || (destPoint.x > -DT.param.spacing && dx < 0)) {
            destPoint.x += dx * DT.param.spacing;
        }
        // if (DT.sphere.position.y < -2 && dy > 0) {
        //     DT.player.jumpLength = 0;
        //     DT.player.jump = true;
        // }
        // if (dy < 0) {
        //     DT.player.jump = false;
        // }
    };

    DT.moveSphere = function(sphere, destPoint, n) {
        var i,
            iterator = function(aix) {
            var dx = destPoint[aix] - sphere.position[aix];
            if (Math.abs(dx) > 0.01) {
                sphere.position[aix] += dx > 0 ? 0.1 : -0.1;
            }
        };
        for (i = 0; i < n; i++) {
            ['x'].forEach(iterator);
        }
            ['y'].forEach(function(aix) {
                var dx = destPoint[aix] - sphere.position[aix];
                if (Math.abs(dx) > 0.01) {
                    sphere.position[aix] += dx > 0 ? 0.1 : -0.1;
                }
            });
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
        var i;
        for (i = 0; i < 2; i++) {
            amp = amp || 0.15;
            DT.sphere.position.x += DT.getSign() * amp;
            DT.sphere.position.y += DT.getSign() * amp;
        }
     };

    DT.sendSocketMessage = function (options) {
        var data = {
            'type': options.type,
            'time': options.time,
            'gameCode': DT.initSocket.socket.gameCode,
            'sessionid': DT.initSocket.socket.socket.sessionid,
            'coinsCollect': DT.player.currentScore
        };
        if (DT.initSocket.socket) {
            DT.initSocket.socket.emit('message', data);
        }
    };

    DT.startAfterChooseControl = function () {
        if (!DT.gameWasStarted) {
            DT.startGame();
            DT.stopSound(2);
            DT.playSound(0);
            $('.choose_control').fadeOut(250);
            DT.gameWasStarted = true;
            DT.sendSocketMessage('gamestarted');
        }
        $(document).unbind('keyup',DT.handlers.startOnSpace);
    };

    DT.runApp = function () {
        DT.initSocket();
        DT.playSound(2);
        $(function() {
            $('.loader').fadeOut(250);
            $('.choose_control').css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 250);
            $(document).keyup(DT.handlers.startOnSpace);
            $('.choose_wasd').click(function() {
                DT.startAfterChooseControl();
            });
            $('.choose_mobile').click(function() {
                DT.initPhoneControl();
            });
            $('.choose_webcam').click(function() {
                DT.enableWebcam();
            });
        });
    };

    DT.pauseOn = function () {
        if (!DT.gameWasPaused) {
            $('.menu_page').css({'display': 'table'});
            DT.stopSoundBeforPause();
            DT.audio.sounds.pause.play();
            cancelAnimationFrame(DT.id);
            DT.gameWasPaused = !DT.gameWasPaused;
        }
    };

    DT.pauseOff = function () {
        if (DT.gameWasPaused) {
            $('.menu_page').css({'display': 'none'});
            DT.playSoundAfterPause();
            DT.audio.sounds.pause.play();
            DT.startGame();
            DT.gameWasPaused = !DT.gameWasPaused;
        }
    };

    $(function(){
        $('.menu_button').click(function() {
            DT.pauseOn();
        });
        $('.resume').click(function() {
            DT.pauseOff();
        });
        $('.music_button').click(DT.handlers.mute);
        $('.fs_button').click(DT.handlers.fullscreen);
        $(document).keyup(function(event) {
            var k = event.keyCode;
            if (k === 77) {
                DT.handlers.mute();
            }
        });
        $(document).keyup(function(event) {
            var k = event.keyCode;
            if (k === 70) {
                DT.handlers.fullscreen();
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
            onRenderFcts = DT.onRenderFcts;
        var audio = new Audio();
        var canPlayOgg = !!audio.canPlayType && audio.canPlayType('audio/ogg; codecs=\'vorbis\'') !== '';
        console.log('canPlayOgg', canPlayOgg);
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            context = new AudioContext();
        }
        catch(e) {
            alert('Opps.. Your browser do not support audio API');
        }
        DT.stopSound = function(index){
            if (DT.audio.music.stopped[index] === false) {
                if (index === 0 || DT.audio.music.paused[index] === false) {
                    DT.audio.music.pausedAt[index] = Date.now() - DT.audio.music.startedAt[index];
                } 
                sources[index].stop(index);
                DT.audio.music.stopped[index] = true;
                DT.audio.music.started[index] = false;
            }
        };

        DT.gainNodes = [];
        DT.playSound = function(index){
            var gainNodes = DT.gainNodes;
            if (!DT.audio.music.started[index]) {
                DT.audio.music.started[index] = true;
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
                DT.audio.music.stopped[index] = false;
                if (DT.audio.music.pausedAt[index]) {
                    DT.audio.music.startedAt[index] = Date.now() - DT.audio.music.pausedAt[index];
                    sources[index].start(index, DT.audio.music.pausedAt[index] / 1000);
                } else {
                    DT.audio.music.startedAt[index] = Date.now();
                    sources[index].start(index);
                }
            }
        };

        DT.stopSoundBeforPause = function() {
            DT.audio.music.stopped.forEach(function(el, i) {
                DT.audio.music.paused[i] = el;
                DT.stopSound(i);
            });
        };

        DT.playSoundAfterPause = function() {
            DT.audio.music.paused.forEach(function(el, i) {
                if (!el) {
                    DT.playSound(i);
                }
            });
        };


        var initSound = function(arrayBuffer, bufferIndex) {
            context.decodeAudioData(arrayBuffer, function(decodedArrayBuffer) {
                buffers[bufferIndex] = decodedArrayBuffer;
                console.log('ready sound ' + bufferIndex);
                counter += 1;
                yepnope.showLoading(counter);
            }, function(e) {
                console.log('Error decoding file', e);
            });
        };

        // SOUNDS
        var ext = 'ogg';
        if (!canPlayOgg) {
            ext = 'mp3';
        }
        for (var prop in DT.audio.sounds) if (DT.audio.sounds.hasOwnProperty(prop)) {
            DT.audio.sounds[prop] = DT.audio.webaudio.createSound().load(DT.audio.sounds[prop] + ext);
        }

        var loadSoundFile = function(urlArr, bufferIndex) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', urlArr[bufferIndex] + ext, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function(e) {
                initSound(this.response, bufferIndex); // this.response is an ArrayBuffer.
            };
            xhr.send();
        };

        loadSoundFile(DT.audio.music, 0);
        loadSoundFile(DT.audio.music, 1);
        loadSoundFile(DT.audio.music, 2);
        
        var visualize = function(index) {
            freqDomain[index] = new Uint8Array(analysers[index].frequencyBinCount);
            analysers[index].getByteFrequencyData(freqDomain[index]);
            DT.audio.valueAudio = getFrequencyValue(DT.audio.frequency[index], index);
        };
        
        var getFrequencyValue = function(frequency, bufferIndex) {
            var nyquist = context.sampleRate/2,
                index = Math.round(frequency/nyquist * freqDomain[bufferIndex].length);
            return freqDomain[bufferIndex][index];
        };

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
        // hblur.uniforms[ 'h' ].value *= bluriness;
        // composer.addPass( hblur );
        
            // vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
        // vblur.uniforms[ 'v' ].value *= bluriness;
        // vblur.renderToScreen = true;
        // composer.addPass( vblur );
        // DT.composer = composer;
        // winResizeBlur   = new THREEx.WindowResize(composer, camera);
        
            // add update function to webaudio prototype
        WebAudio.Sound.prototype.update = function() {
            this.volume(DT.param.globalVolume);
        };
        WebAudio.Sound.prototype.play = function(time){
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
            };
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
            if (modelObj.name === 'bonusE') {
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
            // // Game config
            // var leftBreakThreshold = -5;
            // var leftTurnThreshold = -10;
            // var rightBreakThreshold = 5;
            // var rightTurnThreshold = 10;
            // // Получаем элементы video и canvas
            
                    // var videoInput = document.getElementById('vid');
            // var canvasInput = document.getElementById('compare');
            // var debugOverlay = document.getElementById('debug');
        
                // var canvasContext = canvasInput.getContext('2d');
            // // переворачиваем canvas зеркально по горизонтали
            // canvasContext.translate(canvasInput.width, 0);
            // canvasContext.scale(-1, 1);
        
                // debugOverlay.style.height = '100%';
            // debugOverlay.style.opacity = '0.1';
            // debugOverlay.style.zIndex = '0';
            
                    // // Определяем сообщения, выдаваемые библиотекой
            
                    // statusMessages = {
            //     'whitebalance' : 'Проверка камеры или баланса белого',
            //     'detecting' : 'Обнаружено лицо',
            //     'hints' : 'Что-то не так, обнаружение затянулось. Попробуйте сместиться относительно камеры',
            //     'redetecting' : 'Лицо потеряно, поиск..',
            //     'lost' : 'Лицо потеряно',
            //     'found' : 'Слежение за лицом'
            // };
            
                    // supportMessages = {
            //     'no getUserMedia' : 'Браузер не поддерживает getUserMedia',
            //     'no camera' : 'Не обнаружена камера.'
            // };
            
                    // document.addEventListener('headtrackrStatus', function(event) {
            //     if (event.status in supportMessages) {
            //         console.log(supportMessages[event.status]);
            //         $('.message').html(supportMessages[event.status])
            //     } else if (event.status in statusMessages) {
            //         console.log(statusMessages[event.status]);
            //         $('.message').html(statusMessages[event.status])
            //     }
            //     if (event.status === 'found' && !DT.gameWasStarted) {
                    // DT.startAfterChooseControl();
            //     }
            // }, true);
            
                    // // Установка отслеживания
            
                    // var htracker = new headtrackr.Tracker({altVideo : {ogv : '', mp4 : ''}, calcAngles : true, ui : false, headPosition : false, debug : debugOverlay});
            // htracker.init(videoInput, canvasInput);
            // htracker.start();
            
                    // // Рисуем прямоугольник вокруг «пойманного» лица
            
                    // document.addEventListener('facetrackingEvent', function( event ) {
            //     // once we have stable tracking, draw rectangle
            //     if (event.detection == 'CS') {
            //         var angle = Number(event.angle *(180/ Math.PI)-90);
            //         // console.log(angle);
            //         if(angle < leftBreakThreshold) {
            //             if(angle > leftTurnThreshold) {
            //                 DT.player.destPoint.x = 0;
            //             } else {
            //                 DT.player.destPoint.x = -DT.param.spacing;
            //             }
            //         } else if (angle > rightBreakThreshold) {
            //             if(angle < rightTurnThreshold) {
            //                 DT.player.destPoint.x = 0;
            //             } else {
            //                 DT.player.destPoint.x = DT.param.spacing;
            //             }
            //         } else {
            //             DT.player.destPoint.x = 0;
            //         }
            //     }
            // });
        
            // alt realization
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;
        window.URL = window.URL || window.webkitURL;
        
        var camvideo = document.getElementById('vid');

        if (!navigator.getUserMedia) {
            $('.message').html('Sorry. <code>navigator.getUserMedia()</code> is not available.');
        }
        navigator.getUserMedia({video: true}, gotStream, noStream);
        
        function gotStream(stream) {
            if (window.URL) {
                camvideo.src = window.URL.createObjectURL(stream);
            } 
            else { // Opera
                camvideo.src = stream;
            }
            camvideo.onerror = function(e) {
                stream.stop();
            };
            stream.onended = noStream;
            //start game
            DT.startAfterChooseControl();
        }
        
        function noStream(e) {
            var msg = 'No camera available.';
            if (e.code == 1) 
            {   msg = 'User denied access to use camera.';   }
            console.log(msg);
        }
        
        // assign global variables to HTML elements
        console.log(window.innerHeight, window.innerWidth);
        var video = document.getElementById( 'vid' );
        var videoCanvas = document.getElementById( 'debug' );
        var videoContext = videoCanvas.getContext( '2d' );
        $('#debug').css({
            'height': window.innerHeight,
            'width': window.innerWidth,
            'opacity': 0.2
        });
        
        var blendCanvas  = document.getElementById( 'compare' );
        var blendContext = blendCanvas.getContext('2d');
        $('#compare').css({
            'height': window.innerHeight,
            'width': window.innerWidth,
            'opacity': 0.2
        });
        
        $('.cam').css({
            'background-color': 'rgba(255,255,255,0.2)'
        });
        $('.center').css({
            'background-color': 'rgba(0,0,0,0.2)',
            'width': '33%',
            'height': '100%',
            'margin-left': '33%'
        });
        
        // these changes are permanent
        videoContext.translate(320, 0);
        videoContext.scale(-1, 1);
        
        // background color if no video present
        videoContext.fillStyle = '#005337';
        videoContext.fillRect( 0, 0, videoCanvas.width, videoCanvas.height );
        
        var buttons = [];
        
        var button1 = new Image();
        button1.src ='img/lr.png';
        var buttonData1 = { name:'left', image:button1, x:0, y:0, w:100, h:240, coord: -DT.param.spacing };
        buttons.push( buttonData1 );
        
            var button2 = new Image();
        button2.src ='img/lr.png';
        var buttonData2 = { name:'right', image:button2, x:220, y:0, w:100, h:240, coord: DT.param.spacing };
        buttons.push( buttonData2 );
        
        var button3 = new Image();
        button3.src ='img/c.png';
        var buttonData3 = { name:'center', image:button3, x:100, y:0, w:120, h:240, coord: 0 };
        buttons.push( buttonData3 );
        
        // start the loop
        animate();
        function animate() {
            requestAnimationFrame( animate );
            render();
            blend();
            checkAreas();
        }
        
        function render() { 
            if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
                // mirror video
                videoContext.drawImage( video, 0, 0, videoCanvas.width, videoCanvas.height );
            }
        }
        var lastImageData;
        function blend() {
            var width  = videoCanvas.width;
            var height = videoCanvas.height;
            // get current webcam image data
            var sourceData = videoContext.getImageData(0, 0, width, height);
            // create an image if the previous image doesn't exist
            if (!lastImageData) lastImageData = videoContext.getImageData(0, 0, width, height);
            // create a ImageData instance to receive the blended result
            var blendedData = videoContext.createImageData(width, height);
            // blend the 2 images
            differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
            // draw the result in a canvas
            blendContext.putImageData(blendedData, 0, 0);
            // store the current webcam image
            lastImageData = sourceData;
        }
        function differenceAccuracy(target, data1, data2) {
            if (data1.length != data2.length) return null;
            var i = 0;
            while (i < (data1.length * 0.25)) {
                var average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
                var average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
                var diff = threshold(fastAbs(average1 - average2));
                target[4*i]   = diff;
                target[4*i+1] = diff;
                target[4*i+2] = diff;
                target[4*i+3] = 0xFF;
                ++i;
            }
        }
        function fastAbs(value) {
            return (value ^ (value >> 31)) - (value >> 31);
        }
        function threshold(value) {
            return (value > 0x15) ? 0xFF : 0;
        }
        
            // check if white region from blend overlaps area of interest (e.g. handlers)
        function checkAreas() {
            var b, l = buttons.length;
            for (b = 0; b < l; b++) {
                // get the pixels in a note area from the blended image
                // calculate the average lightness of the blended data
                var blendedData = blendContext.getImageData( buttons[b].x, buttons[b].y, buttons[b].w, buttons[b].h ),
                    i = 0,
                    sum = 0,
                    countPixels = blendedData.data.length * 0.25;
                while (i < countPixels) {
                    sum += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]);
                    ++i;
                }
                // calculate an average between of the color values of the note area [0-255]
                var average = Math.round(sum / (3 * countPixels));
                // more than 20% movement detected
                if (average > 30) {
                    console.log( 'Button ' + buttons[b].name + ' triggered.' ); // do stuff
                    // messageArea.innerHTML = '<font size='+4' color=white>'+ buttons[b].name + '</b></font>';
                    DT.player.destPoint.x = buttons[b].coord;
                }
            }
        }
    };

    DT.initPhoneControl = function() {
        $('.message').html('Please open <span style=\'color: red\'>' + DT.server +'/m</span> with your phone and enter code <span style=\'font-weight:bold; color: red\' id=\'socketId\'></span>');
        $('#socketId').html(DT.initSocket.socket.gameCode);
    };

    DT.initSocket = function() {
        // Game config
        var leftBreakThreshold = -3,
            leftTurnThreshold = -20,
            rightBreakThreshold = 3,
            rightTurnThreshold = 20,
            // set socket
            socket = DT.initSocket.socket = io.connect(DT.server);
        // When initial welcome message, reply with 'game' device type
        socket.on('welcome', function(data) {
            socket.emit('device', {'type':'game', 'cookieUID': DT.getCookie('UID')});
        });
        // We receive our game code to show the user
        socket.on('initialize', function(gameCode) {
            socket.gameCode = gameCode;
        });
        // When the user inputs the code into the phone client,
        //  we become 'connected'.  Start the game.
        socket.on('connected', function(data) {
            $('#gameConnect').hide();
            $('#status').hide();
            DT.startAfterChooseControl();
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
            DT.handlers[click]();
        });
    };
    DT.updateGameTimer = function (timer) {
            var sec, min;
            sec = timer / 60;
            min = Math.floor(sec / 60);
            sec = sec % 60;
            sec = sec < 10 ? '0' + sec.toString() : sec;
            $('.gameTimer').html(min + ':' + sec);
            $('title').html(min + ':' + sec + ' in digital trip');
        };
    });
    // STATS
    var setStats = function () {
        var body = document.getElementsByTagName('body')[0];
        DT.stats = DT.stats|| new Stats();
        DT.stats.domElement.style.position = 'absolute';
        DT.stats.domElement.style.top = '0px';
        DT.stats.domElement.style.zIndex = 100;
        body.appendChild( DT.stats.domElement );
        DT.stats2 = DT.stats2 || new Stats();
        DT.stats2.setMode(1); // 0: fps, 1: ms
        DT.stats2.domElement.style.position = 'absolute';
        DT.stats2.domElement.style.top = '0px';
        DT.stats2.domElement.style.left = '80px';
        DT.stats2.domElement.style.zIndex = 100;
        body.appendChild( DT.stats2.domElement );
    };
    return DT;
} ());