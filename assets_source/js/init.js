// ██████╗ ██╗ ██████╗ ██╗████████╗ █████╗ ██╗         ████████╗██████╗ ██╗██████╗ 
// ██╔══██╗██║██╔════╝ ██║╚══██╔══╝██╔══██╗██║         ╚══██╔══╝██╔══██╗██║██╔══██╗
// ██║  ██║██║██║  ███╗██║   ██║   ███████║██║            ██║   ██████╔╝██║██████╔╝
// ██║  ██║██║██║   ██║██║   ██║   ██╔══██║██║            ██║   ██╔══██╗██║██╔═══╝ 
// ██████╔╝██║╚██████╔╝██║   ██║   ██║  ██║███████╗       ██║   ██║  ██║██║██║     
// ╚═════╝ ╚═╝ ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝       ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝     
                                                                                
var DT = (function () {
    'use strict';
    var DT = {},
        THREE = window.THREE || undefined,
        WebAudio = window.WebAudio || undefined,
        $ = window.$ || undefined,
        THREEx = window.THREEx || undefined,
        requestAnimFrame = function () {
            return (
                window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function(/* function */ callback){
                    window.setTimeout(callback, 1000 / 60);
                }
            );
        }(),
        cancelAnimFrame = function () {
            return (
                window.cancelAnimationFrame       ||
                window.webkitCancelAnimationFrame ||
                window.mozCancelAnimationFrame    ||
                window.oCancelAnimationFrame      ||
                window.msCancelAnimationFrame     ||
                function(id){
                    window.clearTimeout(id);
                }
            );
        }();

// ███████╗███████╗██████╗ ██╗   ██╗██╗ ██████╗███████╗    ███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗
// ██╔════╝██╔════╝██╔══██╗██║   ██║██║██╔════╝██╔════╝    ██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
// ███████╗█████╗  ██████╔╝██║   ██║██║██║     █████╗      █████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║
// ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██║██║     ██╔══╝      ██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║
// ███████║███████╗██║  ██║ ╚████╔╝ ██║╚██████╗███████╗    ██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
// ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝    ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
                                                                                                                          
    DT.getCookie = function (name) {
        var matches = document.cookie.match(
            new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
        );
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };
    DT.getDistance = function (x1, y1, z1, x2, y2, z2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2));
    };
    DT.genCoord = function (delta) {
        var offset = delta || DT.game.param.spacing,
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
    DT.genRandomFloorBetween = function (min, max) {
        var rand = min - 0.5 + Math.random()*(max-min+1);
        rand = Math.round(rand);
        return rand;
    };
    DT.genRandomBetween = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    DT.genRandomSign = function () {
        var signVal = Math.random() - 0.5;
        return Math.abs(signVal)/signVal;
    };

    DT.animate = function (nowMsec) {
        nowMsec = nowMsec || Date.now();
        DT.animate.lastTimeMsec = DT.animate.lastTimeMsec || nowMsec - 1000 / 60;
        var deltaMsec = Math.min(200, nowMsec - DT.animate.lastTimeMsec);
        // keep looping
        DT.animate.id = requestAnimFrame(DT.animate);
        // change last time
        DT.animate.lastTimeMsec = nowMsec;
        // call each update function
        $(document).trigger('update', {
            delta: deltaMsec / 1000,
            now: nowMsec / 1000
        });
    };

// ████████╗██╗  ██╗██████╗ ███████╗███████╗    ██╗    ██╗ ██████╗ ██████╗ ██╗     ██████╗ 
// ╚══██╔══╝██║  ██║██╔══██╗██╔════╝██╔════╝    ██║    ██║██╔═══██╗██╔══██╗██║     ██╔══██╗
   // ██║   ███████║██████╔╝█████╗  █████╗      ██║ █╗ ██║██║   ██║██████╔╝██║     ██║  ██║
   // ██║   ██╔══██║██╔══██╗██╔══╝  ██╔══╝      ██║███╗██║██║   ██║██╔══██╗██║     ██║  ██║
   // ██║   ██║  ██║██║  ██║███████╗███████╗    ╚███╔███╔╝╚██████╔╝██║  ██║███████╗██████╔╝
   // ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝     ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝ 
                                                                                        
    DT.renderer = new THREE.WebGLRenderer();
    DT.renderer.setSize(window.innerWidth, window.innerHeight);
    DT.renderer.physicallyBasedShading = true;
    document.body.appendChild(DT.renderer.domElement);

    DT.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 300);
    DT.camera.position.set(0, 0.5, 15);
    DT.camera.position.z = DT.camera.z = 15;
    var lens = DT.camera.lens = 35;

    // when resize
    new THREEx.WindowResize(DT.renderer, DT.camera);

    DT.scene = new THREE.Scene();
    $(document).on('update', function (e, data) {
        DT.renderer.render(DT.scene, DT.camera);
    });
    
    // LIGHTS
    DT.lights = {
        light: new THREE.PointLight(0xffffff, 0.75, 100),
        directionalLight: new THREE.DirectionalLight(0xffffff, 0.25)
    };
    DT.lights.light.position.set(0, 0, -1);
    DT.scene.add(DT.lights.light);

    DT.lights.directionalLight.position.set(0, 0, 1);
    DT.scene.add(DT.lights.directionalLight);

    // BACKGROUND
    DT.backgroundMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(44, 22, 0),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/bg.jpg')
        })
    );
    DT.backgroundMesh.material.depthTest = false;  
    DT.backgroundMesh.material.depthWrite = false;
    DT.backgroundMesh.visible = false;
    DT.scene.add(DT.backgroundMesh);
    $(document).on('update', function (e, data) {
        if (!DT.backgroundMesh.visible) {
            DT.backgroundMesh.visible = true;
        }
    });

    // EFFECT
    DT.effect = new THREE.AnaglyphEffect(DT.renderer);
    DT.effect.on = false;
    $(document).on('update', function (e, data) {
        if (DT.effect.on) {
            DT.effect.render(DT.scene, DT.camera);
            DT.effect.setSize( window.innerWidth, window.innerHeight );
        }
    });
    $(document).on('makeFun', function (e, data) {
        DT.effect.on = true;
    });
    $(document).on('stopFun', function (e, data) {
        DT.effect.on = false;
    });

    // TODO: refactor
    // LENS
    $(document).on('update', function (e, data) {
        var camOffset = 6, camDelta = 0.1,
            lensOffset = 18, lensDelta = 0.3;
        if (DT.game.speed.getChanger() > 0) {
            DT.camera.position.z = Math.max(DT.camera.position.z -= camDelta, DT.camera.z - camOffset);
            lens = Math.max(lens -= lensDelta, DT.camera.lens - lensOffset);
        } else if (DT.game.speed.getChanger() < 0) {
            DT.camera.position.z = Math.min(DT.camera.position.z += camDelta, DT.camera.z + camOffset);
            lens = Math.min(lens += lensDelta, DT.camera.lens + lensOffset);
        } else {
            var delta = DT.camera.lens - lens;
            if (delta < 0) {
                DT.camera.position.z = Math.max(DT.camera.position.z -= camDelta, DT.camera.z);
                lens = Math.max(lens -= lensDelta, DT.camera.lens);
            } else {
                DT.camera.position.z = Math.min(DT.camera.position.z += camDelta, DT.camera.z);
                lens = Math.min(lens += lensDelta, DT.camera.lens);
            }
        }
        DT.camera.setLens(lens);
    });
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
    THREE.IcosahedronGeometry.prototype = Object.create(THREE.Geometry.prototype);

// ███████╗██╗  ██╗████████╗███████╗██████╗ ███╗   ██╗ █████╗ ██╗         ███╗   ███╗ ██████╗ ██████╗ ███████╗██╗     ███████╗
// ██╔════╝╚██╗██╔╝╚══██╔══╝██╔════╝██╔══██╗████╗  ██║██╔══██╗██║         ████╗ ████║██╔═══██╗██╔══██╗██╔════╝██║     ██╔════╝
// █████╗   ╚███╔╝    ██║   █████╗  ██████╔╝██╔██╗ ██║███████║██║         ██╔████╔██║██║   ██║██║  ██║█████╗  ██║     ███████╗
// ██╔══╝   ██╔██╗    ██║   ██╔══╝  ██╔══██╗██║╚██╗██║██╔══██║██║         ██║╚██╔╝██║██║   ██║██║  ██║██╔══╝  ██║     ╚════██║
// ███████╗██╔╝ ██╗   ██║   ███████╗██║  ██║██║ ╚████║██║  ██║███████╗    ██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗███████╗███████║
// ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝

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
        }
    ];
    // LOADER
    var loader = new THREE.JSONLoader(true), // init the loader util
        loadModel;
    
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
    DT.listOfModels.map(loadModel);

// ███████╗██╗   ██╗███████╗███╗   ██╗████████╗███████╗
// ██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝██╔════╝
// █████╗  ██║   ██║█████╗  ██╔██╗ ██║   ██║   ███████╗
// ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   ╚════██║
// ███████╗ ╚████╔╝ ███████╗██║ ╚████║   ██║   ███████║
// ╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
                                                    
    DT.events = {
        'startGame'     : 'custom',
        'pauseGame'     : 'custom',
        'resumeGame'    : 'custom',
        'resetGame'     : 'custom',
        'update'        : 'custom',
        'changeSpeed'   : 'custom',
        'makeFun'       : 'custom',
        'stopFun'       : 'custom',
        'changeHelth'   : 'custom',
        'showHelth'     : 'custom',
        'changeScore'   : 'custom',
        'showScore'     : 'custom',
        'blink'         : 'custom',
        'focus'         : 'native',
        'blur'          : 'native',
    };

    $(document).on('startGame', function (e, data) {
        DT.animate.id = requestAnimFrame(DT.animate);
    });
    $(document).on('pauseGame', function () {
        cancelAnimFrame(DT.animate.id);
    });
    $(document).on('resumeGame', function (e, data) {
        DT.animate.id = requestAnimFrame(DT.animate);
    });
    $(document).on('gameOver', function (e, data) {
        setTimeout(function() {
            cancelAnimFrame(DT.animate.id);
        }, 300);
    });

 // ██████╗  █████╗ ███╗   ███╗███████╗
// ██╔════╝ ██╔══██╗████╗ ████║██╔════╝
// ██║  ███╗███████║██╔████╔██║█████╗  
// ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  
// ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗
 // ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
                                    
    DT.Game = function () {
        this.param = {
            spacing: 3,
            spawnCoord: -200,
            opacityCoord: 2,
            dieCoord: 30,
            stonesCloseness: 18,
            globalVolume: 1,
            prevGlobalVolume: 1
        };
        this.speed = {
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
        this.wasStarted = false;
        this.wasPaused = false;
        this.wasOver = false;
        this.wasMuted = false;
        this.timer = 0;
    };
    DT.Game.prototype.startGame = function() {
        this.wasStarted = true;
    };

    DT.Game.prototype.updateTimer = function () {
        this.timer += 1;
        if (this.timer % 60 === 0) {
            var sec, min;
            sec = this.timer / 60;
            min = Math.floor(sec / 60);
            sec = sec % 60;
            sec = sec < 10 ? '0' + sec.toString() : sec;
            $('.gameTimer').html(min + ':' + sec);
            $('title').html(min + ':' + sec + ' in digital trip');
        }
    };
    DT.Game.prototype.update = function() {
        this.updateTimer();
        this.speed.increase();
    };
    DT.Game.prototype.reset = function() {
        $(document).trigger('resetGame', {});
        this.timer = 0;
    };
    DT.Game.prototype.gameOver = function() {
        this.wasOver = true;
    };

    DT.game = new DT.Game();

    $(document).on('startGame', function (e, data) {
        DT.game.startGame();
    });
    $(document).on('pauseGame', function () {
        DT.game.wasPaused = true;
    });
    $(document).on('resumeGame', function (e, data) {
        DT.game.wasPaused = false;
        DT.game.startGame();
    });
    $(document).on('update', function (e, data) {
        DT.game.update();
    });
    $(document).on('changeSpeed', function (e, data) {
        DT.game.speed.setChanger(data.changer);
    });
    $(document).on('gameOver', function (e, data) {
        DT.game.gameOver();
    });

// ██████╗ ██╗      █████╗ ██╗   ██╗███████╗██████╗ 
// ██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗
// ██████╔╝██║     ███████║ ╚████╔╝ █████╗  ██████╔╝
// ██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗
// ██║     ███████╗██║  ██║   ██║   ███████╗██║  ██║
// ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
                                                 
    DT.Player = function (options) {
        if (!DT.Player.__instance) {
            DT.Player.__instance = this;
        } else {
            return DT.Player.__instance;
        }
        var self = this;
        this.scene = options.scene || DT.scene;
        this.currentHelth = options.currentHelth || 100;
        this.currentScore = options.currentScore || 0;
        this.destPoint = options.destPoint || {x: 0, y: 0};
        this.isInvulnerability = options.isInvulnerability || false;
        this.isFun = options.isFun || false;
        this.invulnerTimer = null;
        this.funTimer = null;
        this.sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhongMaterial({color: 0xff0000}));
        this.sphere.position.set(0, -2.5, 0);
        this.light = new THREE.PointLight(0xff0000, 1.75, 15);
        this.light.position.set(0, 0, 0);
        this.light.color = this.sphere.material.color;
        this.scene.add(this.light);
        this.blink = {
            color: new THREE.Color('red'),
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
        };
        this.emitter = Fireworks.createEmitter({nParticles : 100})
        .effectsStackBuilder()
            .spawnerSteadyRate(25)
            .position(Fireworks.createShapePoint(0, 0, 0))
            .velocity(Fireworks.createShapePoint(0, 0, 2))
            .lifeTime(0.7, 0.7)
            .randomVelocityDrift(Fireworks.createVector(0, 0, 0))
            .renderToThreejsParticleSystem({
                particleSystem  : function(emitter){
                    var i,
                        geometry    = new THREE.Geometry(),
                        texture = Fireworks.ProceduralTextures.buildTexture(),
                        material    = new THREE.ParticleBasicMaterial({
                            color       : new THREE.Color().setHSL(1, 0, 0.3).getHex(),
                            size        : 100,
                            sizeAttenuation : false,
                            vertexColors    : true,
                            map     : texture,
                            blending    : THREE.AdditiveBlending,
                            depthWrite  : false,
                            transparent : true
                        }),
                        particleSystem = new THREE.ParticleSystem(geometry, material);
                        particleSystem.dynamic  = true;
                        particleSystem.sortParticles = true;
                    // init vertices
                    for(i = 0; i < emitter.nParticles(); i++){
                        geometry.vertices.push( new THREE.Vector3() );
                    }
                    // init colors
                    geometry.colors = new Array(emitter.nParticles());
                    for(i = 0; i < emitter.nParticles(); i++){
                        geometry.colors[i]  = self.sphere.material.color;
                    }
                    
                    self.scene.add(particleSystem);
                    particleSystem.position = self.sphere.position;
                    return particleSystem;
                }
            }).back()
        .start();
    };

    DT.Player.prototype.updateBlink = function () {
        // TODO: refactor
        if (this.blink.framesLeft === 0) {
            return;
        }
        if (this.blink.framesLeft === 1) {
            this.sphere.material.color.setRGB(1,0,0)
        }
        if (this.blink.framesLeft === this.blink.frames) {
            this.sphere.material.color.setRGB(this.blink.color.r,this.blink.color.g,this.blink.color.b);
        }
        if (this.blink.framesLeft < this.blink.frames) {
            this.sphere.material.color.r += this.blink.dr;
            this.sphere.material.color.g += this.blink.dg;
            this.sphere.material.color.b += this.blink.db;
        }
        this.blink.framesLeft -= 1;
        return this;
    };

    DT.Player.prototype.changeHelth = function(delta) {
        if (delta > 0 || this.isInvulnerability === false) {
            var helth = this.currentHelth;
            if (helth > 0) {
                helth += delta;
                if (helth < 0) {
                    helth = 0;
                    $(document).trigger('gameOver', {});
                }
                if (helth > 100) {
                    helth = 100;
                }
            }
            this.currentHelth = helth;
            $(document).trigger('showHelth', {helth: this.currentHelth});
        }
        return this;
    };

    DT.Player.prototype.makeInvulner = function (time) {
        this.invulnerTimer = (time || 10000) / 1000 * 60;
        this.isInvulnerability = true;
        $(document).trigger('showInvulner', {invulner: true});
        return this;
    };

    DT.Player.prototype.stopInvulner = function () {
        this.invulnerTimer = 0;
        this.isInvulnerability = false;
        $(document).trigger('showInvulner', {invulner: false});
        return this;
    };

    DT.Player.prototype.changeScore = function(delta) {
        this.currentScore += delta;
        $(document).trigger('showScore', {score: this.currentScore});
        return this;
    };

    DT.Player.prototype.makeFun = function(time) {
        this.isFun = true;
        this.funTimer = (time || 10000) / 1000 * 60;
        $(document).trigger('showFun', {isFun: true});
        return this;
    };

    DT.Player.prototype.stopFun = function () {
        this.isFun = false;
        this.funTimer = 0;
        $(document).trigger('showFun', {isFun: false});
        return this;
    };

    DT.Player.prototype.updateInvulnerability = function () {
        if (this.isInvulnerability) {
            this.invulnerTimer -= 1;
            if (this.invulnerTimer <= 0) {
                this.isInvulnerability = false;
                $(document).trigger('showInvulner', {invulner: false});
            } else {
                return this;
            }
        }
        return this;
    };

    DT.Player.prototype.updateFun = function () {
        if (this.isFun) {
            this.funTimer -= 1;
            if (this.funTimer <= 0) {
                this.stopFun();
            } else if (this.funTimer % 6 === 0) {
                var color = new THREE.Color().setRGB(
                    DT.genRandomFloorBetween(0, 3),
                    DT.genRandomFloorBetween(0, 3),
                    DT.genRandomFloorBetween(0, 3)
                );
                this.blink.doBlink(color, 10);
            }
        }
        return this;
    };

    DT.Player.prototype.update = function () {
        this.updateInvulnerability();
        this.updateFun();
        this.updateBlink();
        return this;
    };

    DT.Player.prototype.reset = function () {
        this.currentHelth = 100;
        this.currentScore = 0;
        this.destPoint = {x: 0, y: -2.5};
        this.isInvulnerability = false;
        this.isFun = false;
        return this;
    };

    DT.Player.prototype.changeDestPoint = function(dy, dx) {
        if ((this.destPoint.x < DT.game.param.spacing && dx > 0) || (this.destPoint.x > -DT.game.param.spacing && dx < 0)) {
            this.destPoint.x += dx * DT.game.param.spacing;
        }
        return this;
    };

    DT.Player.prototype.moveSphere = function(n) {
        // TODO: refactor
        var i, self = this,
            iterator = function(aix) {
            var dx = self.destPoint[aix] - self.sphere.position[aix];
            if (Math.abs(dx) > 0.01) {
                self.sphere.position[aix] += dx > 0 ? 0.1 : -0.1;
            }
        };
        for (i = 0; i < n; i++) {
            ['x'].forEach(iterator);
        }
            ['y'].forEach(function(aix) {
                var dx = self.destPoint[aix] - self.sphere.position[aix];
                if (Math.abs(dx) > 0.01) {
                    self.sphere.position[aix] += dx > 0 ? 0.1 : -0.1;
                }
            });
        return this;
    };

    DT.Player.prototype.bump = function (amp) {
        if (this.isInvulnerability) return;
        for (var i = 0; i < 2; i++) {
            amp = amp || 0.15;
            this.sphere.position.x += DT.genRandomSign() * amp;
            this.sphere.position.y += DT.genRandomSign() * amp;
        }
        return this;
     };

    DT.player = new DT.Player({
        currentHelth: 100,
        currentScore: 0,
        destPoint: {x: 0, y: -2.5},
        isInvulnerability: false,
        isFun: false
    });
    $(document).on('update', function (e, data) {
        DT.player.update();
    });
    // TODO: refactor
    $(document).on('update', function (e, data) {
        DT.player.moveSphere(3);
        DT.player.light.position.x = DT.player.sphere.position.x;
        DT.player.light.position.y = DT.player.sphere.position.y;
    });
    $(document).on('update', function (e, data) {
        DT.player.emitter.update(data.delta).render();
        DT.player.emitter._particles.forEach(function(el) {
            el.velocity.vector.z += DT.audio.valueAudio/28;
        });
    });
    $(document).on('makeFun', function (e, data) {
        DT.player.makeFun();
    });
    $(document).on('stopFun', function (e, data) {
        DT.player.stopFun();
    });
    $(document).on('changeScore', function (e, data) {
        DT.player.changeScore(data.delta);
    });
    $(document).on('changeHelth', function (e, data) {
        DT.player.changeHelth(data.delta);
    });
    $(document).on('makeInvulner', function (e, data) {
        DT.player.makeInvulner();
    });
    $(document).on('stopInvulner', function (e, data) {
        DT.player.stopInvulner();
    });
    $(document).on('blink', function (e, data) {
        DT.player.blink.doBlink(data.color, data.frames);
    });
    $(document).on('gameOver', function (e, data) {
        clearTimeout(DT.player.isFun);
    });

 // ██████╗  █████╗ ███╗   ███╗███████╗     ██████╗ ██████╗      ██╗███████╗ ██████╗████████╗
// ██╔════╝ ██╔══██╗████╗ ████║██╔════╝    ██╔═══██╗██╔══██╗     ██║██╔════╝██╔════╝╚══██╔══╝
// ██║  ███╗███████║██╔████╔██║█████╗      ██║   ██║██████╔╝     ██║█████╗  ██║        ██║   
// ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝      ██║   ██║██╔══██╗██   ██║██╔══╝  ██║        ██║   
// ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗    ╚██████╔╝██████╔╝╚█████╔╝███████╗╚██████╗   ██║   
 // ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝     ╚═════╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   
                                                                                          
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
        return this;
    };
    DT.GameObject.prototype.removeFromScene = function () {
        this.scene.remove(this.tObject);
        return this;
    };
    DT.GameObject.prototype.create = function () {
        // empty method
        console.log('try to call empty method');
        return this;
    };
    DT.GameObject.prototype.createAndAdd = function () {
        return this.create()
            .addToScene();
    };
    DT.GameObject.prototype.update = function (options) {
        return this.updateGeometry(options.geometry)
            .updateMaterial(options.material);
    };
    DT.GameObject.prototype.updateGeometry = function (options) {
        // empty method
        console.log('try to call empty method');
        return this;
    };
    DT.GameObject.prototype.updateMaterial = function (options) {
        // empty method
        console.log('try to call empty method');
        return this;
    };
    DT.GameObject.prototype.updateParam = function (param, options) {
        for (var prop in options) if (options.hasOwnProperty(prop)) {
            this.tObject[param][prop] += options[prop];
        }
        return this;
    };
    DT.GameObject.prototype.setParam = function (param, options) {
        for (var prop in options) if (options.hasOwnProperty(prop)) {
            this.tObject[param][prop] = options[prop];
        }
        return this;
    };

 // ██████╗  █████╗ ███╗   ███╗███████╗     ██████╗ ██████╗ ██╗     ██╗          ██████╗ ██████╗      ██╗
// ██╔════╝ ██╔══██╗████╗ ████║██╔════╝    ██╔════╝██╔═══██╗██║     ██║         ██╔═══██╗██╔══██╗     ██║
// ██║  ███╗███████║██╔████╔██║█████╗      ██║     ██║   ██║██║     ██║         ██║   ██║██████╔╝     ██║
// ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝      ██║     ██║   ██║██║     ██║         ██║   ██║██╔══██╗██   ██║
// ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗    ╚██████╗╚██████╔╝███████╗███████╗    ╚██████╔╝██████╔╝╚█████╔╝
 // ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝     ╚═════╝ ╚═════╝ ╚══════╝╚══════╝     ╚═════╝ ╚═════╝  ╚════╝ 
                                                                                                      
    DT.GameCollectionObject = function (options) {
        DT.GameObject.apply(this, arguments);
        this.collection = options.collection;
    };
    DT.GameCollectionObject.prototype = Object.create(DT.GameObject.prototype);
    DT.GameCollectionObject.prototype.constructor = DT.GameCollectionObject;

    DT.GameCollectionObject.prototype.create = function () {
        this.collection.push(this);
        return this;
    };

    DT.GameCollectionObject.prototype.update = function (options) {
        if (this.tObject.position.z > options.dieCoord) {
            this.removeFromScene();
        } 
        if (this.tObject.position.z > options.opacityCoord) {
            if (this.tObject.children.length > 0) {
                this.tObject.children.forEach(function (el) {
                    el.material.transparent = true;
                    el.material.opacity = 0.5; 
                });
            } else {
                this.tObject.material = new THREE.MeshLambertMaterial({
                     shading: THREE.FlatShading,
                     transparent: true,
                     opacity: 0.5
                 });
            }
        }
        return this;
    };

    DT.GameCollectionObject.prototype.removeFromScene = function () {
        DT.GameObject.prototype.removeFromScene.apply(this, arguments);
        var ind = this.collection.indexOf(this);
        if (ind !== -1) {
            this.collection.splice(ind, 1);
        }
        return this;
    };

// ███████╗██╗  ██╗██╗███████╗██╗     ██████╗ 
// ██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗
// ███████╗███████║██║█████╗  ██║     ██║  ██║
// ╚════██║██╔══██║██║██╔══╝  ██║     ██║  ██║
// ███████║██║  ██║██║███████╗███████╗██████╔╝
// ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝ 
                                           
    DT.Shield = function (options) {
        if (!DT.Shield.__instance) {
            DT.Shield.__instance = this;
        } else {
            return DT.Shield.__instance;
        }
        DT.GameObject.apply(this, arguments);
        this.material.color = options.sphere.material.color;
        this.tObject.position = options.sphere.position;
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
        sphere: DT.player.sphere
    });
    $(document).on('showInvulner', function (e, data) {
        console.log('showInvulner');
        if (data.invulner) {
            DT.shield.addToScene();
        } else {
            DT.shield.removeFromScene();
        }
    });

// ██████╗ ██╗   ██╗███████╗████████╗
// ██╔══██╗██║   ██║██╔════╝╚══██╔══╝
// ██║  ██║██║   ██║███████╗   ██║   
// ██║  ██║██║   ██║╚════██║   ██║   
// ██████╔╝╚██████╔╝███████║   ██║   
// ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   
                                  
    DT.Dust = function (options) {
        DT.GameObject.apply(this, arguments);
        this.number = options.number || 100;
        this.createAndAdd();
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
        return this;
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
        return this;
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
        return this;
    };
    // Dust object 
    DT.dust = new DT.Dust({
        geometry: new THREE.Geometry({}),
        material: new THREE.ParticleSystemMaterial({size: 0.25}),
        THREEConstructor: THREE.ParticleSystem
    });
    $(document).on('update', function (e, data) {
        DT.dust.update({
            material: {
                isFun: DT.player.isFun,
                valueAudio: DT.audio.valueAudio,
                color: DT.player.sphere.material.color
            }, 
            geometry: {
                speed: DT.game.speed.getValue()
            }
        });
    });

// ███████╗████████╗ ██████╗ ███╗   ██╗███████╗
// ██╔════╝╚══██╔══╝██╔═══██╗████╗  ██║██╔════╝
// ███████╗   ██║   ██║   ██║██╔██╗ ██║█████╗  
// ╚════██║   ██║   ██║   ██║██║╚██╗██║██╔══╝  
// ███████║   ██║   ╚██████╔╝██║ ╚████║███████╗
// ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚══════╝
                                            
    DT.Stone = function (options) {
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
            collection: options.collection
        }]);
        this.setParam('position', {
            x: x,
            y: y,
            z: options.spawnCoord
        })
        .setParam('rotation', {
            x: Math.random(),
            y: Math.random()
        })
        .createAndAdd();
        this.distanceToSphere = null;
    };
    DT.Stone.prototype = Object.create(DT.GameCollectionObject.prototype);
    DT.Stone.prototype.constructor = DT.Stone;

    DT.Stone.prototype.update = function (options) {
        DT.GameCollectionObject.prototype.update.apply(this, arguments);
        var el = this.tObject;
        this.distanceToSphere = el.position.distanceTo(options.sphere.position);
        this.minDistance = options.sphere.geometry.radius + el.geometry.radius;
            
        if (this.distanceToSphere < this.minDistance) {
            DT.audio.sounds.stoneDestroy.play();
            DT.sendSocketMessage({
                type: 'vibr',
                time: 200
            });
            this.removeFromScene();

            $(document).trigger('changeHelth', {delta: -19});
            // вызвать вспышку экрана
            if (DT.player.isInvulnerability === false) {
                DT.hit();
            }
        }
        if (this.distanceToSphere > this.minDistance && this.distanceToSphere < this.minDistance + 1 && el.position.z - options.sphere.position.z > 1) {
            DT.audio.sounds.stoneMiss.play();
        }
        if (DT.getDistance(options.sphere.position.x, options.sphere.position.y, el.position.z, el.position.x, el.position.y, el.position.z) < this.minDistance) {
            el.material.emissive = new THREE.Color().setRGB(
                el.material.color.r * 0.5,
                el.material.color.g * 0.5,
                el.material.color.b * 0.5);
        } else {
            el.material.emissive = new THREE.Color().setRGB(0,0,0);
        }
        this.updateParam('rotation', {x: 0.014, y: 0.014})
            .updateParam('position', {z: DT.game.speed.getValue()});
        return this;
    };

 // ██████╗ ██████╗ ██╗███╗   ██╗
// ██╔════╝██╔═══██╗██║████╗  ██║
// ██║     ██║   ██║██║██╔██╗ ██║
// ██║     ██║   ██║██║██║╚██╗██║
// ╚██████╗╚██████╔╝██║██║ ╚████║
 // ╚═════╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝
                              
    DT.Coin = function (options) {
        var r = 0.5, i,
            coin_sides_geo = new THREE.CylinderGeometry( r, r, 0.05, 32, 1, true ),
            coin_cap_geo = new THREE.Geometry();
        for (i = 0; i < 100; i++) {
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

        DT.GameCollectionObject.apply(this, [{
            THREEConstructor: THREE.Object3D,
            collection: options.collection
        }]);
        
        this.tObject.add(coin_sides);
        this.tObject.add(coin_cap_top);
        this.tObject.add(coin_cap_bottom);
        
        this.setParam('position', {
            x: options.x,
            y: options.y,
            z: options.z
        })
            .setParam('rotation', {
            x: 1.5,
            y: 0,
            z: options.zAngle
        })
            .createAndAdd();
    };
    DT.Coin.prototype = Object.create(DT.GameCollectionObject.prototype);
    DT.Coin.prototype.constructor = DT.Coin;

    DT.Coin.prototype.update = function (options) {
        DT.GameCollectionObject.prototype.update.apply(this, arguments);
        this.updateParam('rotation', {z: 0.05})
            .updateParam('position', {z: DT.game.speed.getValue()});
        var positon = this.tObject.position;
        var distanceBerweenCenters = positon.distanceTo(options.sphere.position);
        if (distanceBerweenCenters < 0.9) {
            this.removeFromScene();
            $(document).trigger('changeScore', {delta: 1});
            DT.audio.sounds.catchCoin.play();
            DT.sendSocketMessage({
                type: 'vibr',
                time: 10
            });
            $(document).trigger('blink', {color: 0xcfb53b, frames: 60});
            DT.player.bump();
        }
        return this;
    };

// ██████╗  ██████╗ ███╗   ██╗██╗   ██╗███████╗
// ██╔══██╗██╔═══██╗████╗  ██║██║   ██║██╔════╝
// ██████╔╝██║   ██║██╔██╗ ██║██║   ██║███████╗
// ██╔══██╗██║   ██║██║╚██╗██║██║   ██║╚════██║
// ██████╔╝╚██████╔╝██║ ╚████║╚██████╔╝███████║
// ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚══════╝
                                            
    DT.Bonus = function (options) {
        this.type = DT.genRandomFloorBetween(0, 2);
        DT.GameCollectionObject.apply(this, [{
            geometry: DT.listOfModels[this.type].geometry,
            material: DT.listOfModels[this.type].material,
            THREEConstructor: THREE.Mesh,
            collection: options.collection
        }]);
        this.setParam('position', {
                x: options.x,
                y: options.y,
                z: options.spawnCoord * 2
            })
            .setParam('scale', {
                x: DT.listOfModels[this.type].scale.x || 1,
                y: DT.listOfModels[this.type].scale.y || 1,
                z: DT.listOfModels[this.type].scale.z || 1
            })
            .setParam('rotation', {
                x: DT.listOfModels[this.type].rotation.x || 0,
                y: DT.listOfModels[this.type].rotation.y || 0,
                z: DT.listOfModels[this.type].rotation.z || 0
            })
            .createAndAdd();
        // TODO: сделать расширяемой возможность анимации
        if (this.type === 2) {
            this.animation = new THREE.MorphAnimation(this.tObject);
            this.animation.play();
        }
    };

    DT.Bonus.prototype = Object.create(DT.GameCollectionObject.prototype);
    DT.Bonus.prototype.constructor = DT.Bonus;

    DT.Bonus.prototype.update = function (options) {
        var self = this;
        if (this.type === 0) {
            this.updateParam('rotation', {z: 0.05});
        }
        if (this.type === 1) {
            this.updateParam('rotation', {z: 0.05});
        }
        if (this.type === 2) {
            // this.updateParam('rotation', {z: 0.05});
        }
        if (this.animation) {
            this.animation.update(options.delta);
        }
        
        this.updateParam('position', {z: DT.game.speed.getValue()});
        DT.GameCollectionObject.prototype.update.apply(this, arguments);
        if (DT.getDistance(this.tObject.position.x, this.tObject.position.y, this.tObject.position.z,
                options.sphere.position.x, options.sphere.position.y, options.sphere.position.z) < 10) {
            
            this.tObject.scale.x *= 0.9;
            this.tObject.scale.y *= 0.9;
            this.tObject.scale.z *= 0.9;
            
            if (DT.getDistance(this.tObject.position.x, this.tObject.position.y, this.tObject.position.z,
                    options.sphere.position.x, options.sphere.position.y, options.sphere.position.z) < 0.9) {
                this.removeFromScene();
                $(document).trigger('catchBonus', {type: self.type});
            }
        }
    };

 // ██████╗ ██████╗ ██╗     ██╗     ███████╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗
// ██╔════╝██╔═══██╗██║     ██║     ██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
// ██║     ██║   ██║██║     ██║     █████╗  ██║        ██║   ██║██║   ██║██╔██╗ ██║
// ██║     ██║   ██║██║     ██║     ██╔══╝  ██║        ██║   ██║██║   ██║██║╚██╗██║
// ╚██████╗╚██████╔╝███████╗███████╗███████╗╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
 // ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
                                                                                
    DT.Collection = function (options) {
        this.collection = [];
        this.constructor = options.constructor;
    };

    DT.Collection.prototype.createObjects = function (options) {
        options.number = options.number || 1;
        options.collection = this.collection;
        return this;
    };

    DT.Collection.prototype.update = function (options) {
        this.collection.forEach(function (el) {
            el.update(options);
        });
        return this;
    };

    DT.Collection.prototype.removeObjects = function () {
        this.collection.forEach(function (el) {
            ei.removeFromScene();
        });
        return this;
    };

    DT.StonesCollection = function () {
        if (!DT.StonesCollection.__instance) {
            DT.StonesCollection.__instance = this;
        } else {
            return DT.StonesCollection.__instance;
        }
        DT.Collection.apply(this, [{
            constructor: DT.Stone
        }]);
    };
    DT.StonesCollection.prototype = Object.create(DT.Collection.prototype);
    DT.StonesCollection.prototype.constructor = DT.StonesCollection;

    DT.StonesCollection.prototype.createObjects = function (options) {
        DT.Collection.prototype.createObjects.apply(this, arguments);
        var el = this.collection[this.collection.length -1];

        if (el) {
            var dist = DT.getDistance(0, 0, DT.game.param.spawnCoord,
                el.tObject.position.x, el.tObject.position.y, el.tObject.position.z);
            if (dist <= DT.game.param.stonesCloseness) {
                return this;
            }
        }
        for (var i = 0; i < options.number; i++) {
            new this.constructor(options);
        }
        return this;
    };
    $(document).on('update', function (e, data) {
        new DT.StonesCollection()
            .createObjects({
                spawnCoord: DT.game.param.spawnCoord,
            })
            .update({
                dieCoord: DT.game.param.dieCoord,
                opacityCoord: DT.game.param.opacityCoord,
                sphere: DT.player.sphere
            });
    });

    DT.CoinsCollection = function () {
        if (!DT.CoinsCollection.__instance) {
            DT.CoinsCollection.__instance = this;
        } else {
            return DT.CoinsCollection.__instance;
        }
        DT.Collection.apply(this, [{
            constructor: DT.Coin
        }]);
    };
    DT.CoinsCollection.prototype = Object.create(DT.Collection.prototype);
    DT.CoinsCollection.prototype.constructor = DT.CoinsCollection;

    DT.CoinsCollection.prototype.createObjects = function (options) {
        DT.Collection.prototype.createObjects.apply(this, arguments);
        if (!this.collection.length) {
            for (var i = 0; i < options.number; i++) {
                options.zAngle = i * 0.25;
                options.z = options.spawnCoord - i * 10;
                new this.constructor(options);
            }
        }
        return this;
    };
    $(document).on('update', function (e, data) {
        new DT.CoinsCollection()
            .createObjects({
                x: DT.genCoord(),
                y: -2.5,
                spawnCoord: DT.game.param.spawnCoord,
                zAngle: 0,
                number: 10
            })
            .update({
                dieCoord: DT.game.param.dieCoord,
                opacityCoord: DT.game.param.opacityCoord,
                sphere: DT.player.sphere
            });
    });

    DT.BonusesCollection = function (options) {
        if (!DT.BonusesCollection.__instance) {
            DT.BonusesCollection.__instance = this;
        } else {
            return DT.BonusesCollection.__instance;
        }
        DT.Collection.apply(this, [{
            constructor: DT.Bonus
        }]);
        this.caughtBonuses = [];
    };
    DT.BonusesCollection.prototype = Object.create(DT.Collection.prototype);
    DT.BonusesCollection.prototype.constructor = DT.BonusesCollection;

    DT.BonusesCollection.prototype.createObjects = function (options) {
        DT.Collection.prototype.createObjects.apply(this, arguments);
        if (!this.collection.length) {
            for (var i = 0; i < options.number; i++) {
                new this.constructor(options);
            }
        }
        return this;
    };
    DT.BonusesCollection.prototype.useBonuses = function (type) {
        // helth
        if (type === 0) $(document).trigger('changeHelth', {delta: 100});
        // invulnerability
        if (type === 1) $(document).trigger('makeInvuler', {});
        // entertainment
        if (type === 2) $(document).trigger('makeFun', {});
        return this;
    };

    DT.BonusesCollection.prototype.catchBonus = function (type) {
        var self = this;
        if (!this.caughtBonuses.length || this.caughtBonuses[0] === type) {
            this.caughtBonuses.push(type);
            if (this.caughtBonuses.length === 3) {
                this.useBonuses(type);
                var refreshBonus = setTimeout(function() {
                    self.caughtBonuses.length = 0;
                    clearTimeout(refreshBonus);
                }, 100);
            }
        } else {
            this.caughtBonuses.length = 0;
            this.caughtBonuses.push(type);
        }
        $(document).trigger('showBonuses', {caughtBonuses: this.caughtBonuses});
        return this;
    };
    $(document).on('update', function (e, data) {
        new DT.BonusesCollection()
            .createObjects({
                x: DT.genCoord(),
                y: -2.5,
                spawnCoord: DT.game.param.spawnCoord,
            })
            .update({
                dieCoord: DT.game.param.dieCoord,
                opacityCoord: DT.game.param.opacityCoord,
                sphere: DT.player.sphere,
                delta: data.delta*1000
            });
    });
    $(document).on('catchBonus', function (e, data) {
        new DT.BonusesCollection().catchBonus(data.type);
    });

 // █████╗ ██╗   ██╗██████╗ ██╗ ██████╗ 
// ██╔══██╗██║   ██║██╔══██╗██║██╔═══██╗
// ███████║██║   ██║██║  ██║██║██║   ██║
// ██╔══██║██║   ██║██║  ██║██║██║   ██║
// ██║  ██║╚██████╔╝██████╔╝██║╚██████╔╝
// ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ 
                                     
    // TODO: рефакторинг
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
    DT.audio.reset = function () {
        DT.audio.music.startedAt = [];
        DT.audio.music.pausedAt = [];
        DT.audio.music.stopped = [];
        DT.audio.music.paused = [];
        DT.audio.music.started = [];
    };

    DT.setVolume = function (volume) {
        DT.game.param.globalVolume = volume;
        if (DT.game.param.prevGlobalVolume !== DT.game.param.globalVolume) {
            DT.gainNodes.forEach(function(el) {
                if (el) {
                    el.gain.value = DT.game.param.globalVolume;
                }
            });
            DT.game.param.prevGlobalVolume = DT.game.param.globalVolume;
        }
    };

    $(window).on('focus', function() {
        if (!DT.game.wasMuted) {
            DT.setVolume(1);
        }
    });
    $(window).on('blur', function() {
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver) {
            $(document).trigger('pauseGame', {});
        }
        DT.setVolume(0);
    });
    $(document).on('startGame', function (e, data) {
        DT.stopSound(2);
        DT.playSound(0);
    });
    $(document).on('pauseGame', function () {
        DT.stopSoundBeforPause();
        DT.audio.sounds.pause.play();
    });
    $(document).on('resumeGame', function (e, data) {
        DT.playSoundAfterPause();
        DT.audio.sounds.pause.play();
    });
    $(document).on('gameOver', function (e, data) {
        DT.stopSound(0);
        DT.stopSound(1);
    });
    $(document).on('gameOver', function (e, data) {
        DT.audio.sounds.gameover.play();
    });

        $(function(){
        // MUSIC
        var context,
            counter = 0,
            buffers = [], sources=[], destination, analysers = [],
            freqDomain = [];
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
                gainNodes[index].gain.value = DT.game.param.globalVolume;
                analysers[index] = context.createAnalyser();
                analysers[index].fftSize = 2048;
                analysers[index].minDecibels = -50;
                analysers[index].maxDecibels = -20;
                sources[index].connect(gainNodes[index]);
                gainNodes[index].connect(analysers[index]);
                analysers[index].connect(destination);
                $(document).on('update', function (e, data) {
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
        // add update function to webaudio prototype
        WebAudio.Sound.prototype.update = function() {
            this.volume(DT.game.param.globalVolume);
        };
        WebAudio.Sound.prototype.play = function(time){
            this.volume(DT.game.param.globalVolume);
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
    });

// ██╗  ██╗███████╗██╗   ██╗██████╗  ██████╗  █████╗ ██████╗ ██████╗ 
// ██║ ██╔╝██╔════╝╚██╗ ██╔╝██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔══██╗
// █████╔╝ █████╗   ╚████╔╝ ██████╔╝██║   ██║███████║██████╔╝██║  ██║
// ██╔═██╗ ██╔══╝    ╚██╔╝  ██╔══██╗██║   ██║██╔══██║██╔══██╗██║  ██║
// ██║  ██╗███████╗   ██║   ██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝
// ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ 

    DT.initKeyboardControl = function () {
        $(document).keydown(function(event) {
            var k = event.keyCode;
            // arrows control
            if (k === 38) {
                DT.player.changeDestPoint(1, 0);
            }
            if (k === 40) {
                DT.player.changeDestPoint(-1, 0);
            }
            if (k === 37) {
                DT.player.changeDestPoint(0, -1);
            }
            if (k === 39) {
                DT.player.changeDestPoint(0, 1);
            }
            // speedUp
            if (k === 16) { //shift
                $(document).trigger('stopFun', {});
                $(document).trigger('changeSpeed', {changer: 36});
            }
            if (k === 17) {
                $(document).trigger('makeFun', {});
            }
        });
        $(document).keyup(function(event) {
            var k = event.keyCode;
            if (k === 16) { //shift
                $(document).trigger('changeSpeed', {changer: 0});
            }
        });
        $(document).keyup(DT.handlers.pauseOnSpace);
    };
    
    $(document).on('startGame', function (e, data) {
        DT.initKeyboardControl();
    });
    $(document).on('gameOver', function (e, data) {
        $(document).unbind('keyup', DT.handlers.pauseOnSpace);
        $(document).bind('keyup', DT.handlers.restartOnSpace);
    });

// ███████╗ ██████╗  ██████╗██╗  ██╗███████╗████████╗
// ██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝
// ███████╗██║   ██║██║     █████╔╝ █████╗     ██║   
// ╚════██║██║   ██║██║     ██╔═██╗ ██╔══╝     ██║   
// ███████║╚██████╔╝╚██████╗██║  ██╗███████╗   ██║   
// ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   
                                                  
    DT.server = window.location.origin !== 'http://localhost' ? window.location.origin : 'http://192.168.1.36';
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
                    DT.player.destPoint.x = -DT.game.param.spacing;
                }
            } else if (turn > rightBreakThreshold) {
                if(turn < rightTurnThreshold) {
                    DT.player.destPoint.x = 0;
                } else {
                    DT.player.destPoint.x = DT.game.param.spacing;
                }
            } else {
                DT.player.destPoint.x = 0;
            }
        });
        socket.on('click', function(click) {
            DT.handlers[click]();
        });
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

    $(document).on('startGame', function (e, data) {
        DT.sendSocketMessage('gamestarted');
    });
    $(document).on('gameOver', function (e, data) {
        DT.sendSocketMessage('gameover');
    });

// ███╗   ███╗ ██████╗ ██████╗ ██╗██╗     ███████╗
// ████╗ ████║██╔═══██╗██╔══██╗██║██║     ██╔════╝
// ██╔████╔██║██║   ██║██████╔╝██║██║     █████╗  
// ██║╚██╔╝██║██║   ██║██╔══██╗██║██║     ██╔══╝  
// ██║ ╚═╝ ██║╚██████╔╝██████╔╝██║███████╗███████╗
// ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝╚══════╝╚══════╝

    DT.initPhoneControl = function() {
        $('.message').html('Please open <span style=\'color: red\'>' + DT.server +'/m</span> with your phone and enter code <span style=\'font-weight:bold; color: red\' id=\'socketId\'></span>');
        $('#socketId').html(DT.initSocket.socket.gameCode);
    };

// ██╗    ██╗███████╗██████╗  ██████╗ █████╗ ███╗   ███╗
// ██║    ██║██╔════╝██╔══██╗██╔════╝██╔══██╗████╗ ████║
// ██║ █╗ ██║█████╗  ██████╔╝██║     ███████║██╔████╔██║
// ██║███╗██║██╔══╝  ██╔══██╗██║     ██╔══██║██║╚██╔╝██║
// ╚███╔███╔╝███████╗██████╔╝╚██████╗██║  ██║██║ ╚═╝ ██║
 // ╚══╝╚══╝ ╚══════╝╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝
    // headtracker realization
    // DT.enableWebcam = function () {
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
        //     if (event.status === 'found' && !DT.game.wasStarted) {
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
        //                 DT.player.destPoint.x = -DT.game.param.spacing;
        //             }
        //         } else if (angle > rightBreakThreshold) {
        //             if(angle < rightTurnThreshold) {
        //                 DT.player.destPoint.x = 0;
        //             } else {
        //                 DT.player.destPoint.x = DT.game.param.spacing;
        //             }
        //         } else {
        //             DT.player.destPoint.x = 0;
        //         }
        //     }
        // });
    // };

 // █████╗ ██╗  ████████╗    ██╗    ██╗███████╗██████╗  ██████╗ █████╗ ███╗   ███╗
// ██╔══██╗██║  ╚══██╔══╝    ██║    ██║██╔════╝██╔══██╗██╔════╝██╔══██╗████╗ ████║
// ███████║██║     ██║       ██║ █╗ ██║█████╗  ██████╔╝██║     ███████║██╔████╔██║
// ██╔══██║██║     ██║       ██║███╗██║██╔══╝  ██╔══██╗██║     ██╔══██║██║╚██╔╝██║
// ██║  ██║███████╗██║       ╚███╔███╔╝███████╗██████╔╝╚██████╗██║  ██║██║ ╚═╝ ██║
// ╚═╝  ╚═╝╚══════╝╚═╝        ╚══╝╚══╝ ╚══════╝╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝

    // virtual button realization
    DT.enableWebcam = function () {
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
        var buttonData1 = { name:'left', image:button1, x:0, y:0, w:100, h:240, coord: -DT.game.param.spacing };
        buttons.push( buttonData1 );
        
            var button2 = new Image();
        button2.src ='img/lr.png';
        var buttonData2 = { name:'right', image:button2, x:220, y:0, w:100, h:240, coord: DT.game.param.spacing };
        buttons.push( buttonData2 );
        
        var button3 = new Image();
        button3.src ='img/c.png';
        var buttonData3 = { name:'center', image:button3, x:100, y:0, w:120, h:240, coord: 0 };
        buttons.push( buttonData3 );
        
        // start the loop
        $(document).on('update', function (e, data) {
            render();
            blend();
            checkAreas();
        });
        
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

// ██╗     ██╗███████╗████████╗███████╗███╗   ██╗███████╗██████╗ ███████╗
// ██║     ██║██╔════╝╚══██╔══╝██╔════╝████╗  ██║██╔════╝██╔══██╗██╔════╝
// ██║     ██║███████╗   ██║   █████╗  ██╔██╗ ██║█████╗  ██████╔╝███████╗
// ██║     ██║╚════██║   ██║   ██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗╚════██║
// ███████╗██║███████║   ██║   ███████╗██║ ╚████║███████╗██║  ██║███████║
// ╚══════╝╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚══════╝

    $(document).on('showFun', function (e, data) {
        if (data.isFun) {
            $(document).trigger('changeSpeed', {changer: -18});
            DT.stopSound(0);
            DT.playSound(1);
        } else {
            $(document).trigger('changeSpeed', {changer: 0});
            DT.stopSound(1);
            DT.playSound(0);
        }
    });
    $(document).on('resetGame', function (e, data) {

    });

// ██╗  ██╗ █████╗ ███╗   ██╗██████╗ ██╗     ███████╗██████╗ ███████╗
// ██║  ██║██╔══██╗████╗  ██║██╔══██╗██║     ██╔════╝██╔══██╗██╔════╝
// ███████║███████║██╔██╗ ██║██║  ██║██║     █████╗  ██████╔╝███████╗
// ██╔══██║██╔══██║██║╚██╗██║██║  ██║██║     ██╔══╝  ██╔══██╗╚════██║
// ██║  ██║██║  ██║██║ ╚████║██████╔╝███████╗███████╗██║  ██║███████║
// ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝

    DT.handlers = {};
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
        if (DT.game.wasPaused) {
            $(document).trigger('resumeGame', {});
        } else {
            $(document).trigger('pauseGame', {});
        }
    };
    DT.handlers.mute = function() {
        if (DT.game.param.globalVolume === 1) {
            DT.setVolume(0);
            $('.music_button').html('N');
            DT.game.wasMuted = true;
        } else {
            DT.setVolume(1);
            $('.music_button').html('M');
            DT.game.wasMuted = false;
        }
    };
    DT.handlers.left = function () {
        DT.player.changeDestPoint(0, -1);
    };
    DT.handlers.right = function () {
        DT.player.changeDestPoint(0, 1);
    };
    DT.handlers.restart = function () {
        DT.game.reset();
        DT.player.reset();
        $('.current_coins').html('0');
        $('.bonus').html('');
        $('.gameTimer').html('0:00');
        $('.helth').css({width: '100%'});
        $('.game_over').hide();
        $(document).bind('keyup', DT.handlers.pauseOnSpace);
        $(document).unbind('keyup', DT.handlers.restartOnSpace);
        $('#one_more_time').unbind('click');
        DT.audio.reset();
        $(document).trigger('startGame', {});
        DT.playSound(0);
    };

// ██╗███╗   ██╗████████╗███████╗██████╗ ███████╗ █████╗  ██████╗███████╗
// ██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝
// ██║██╔██╗ ██║   ██║   █████╗  ██████╔╝█████╗  ███████║██║     █████╗  
// ██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██╔══╝  ██╔══██║██║     ██╔══╝  
// ██║██║ ╚████║   ██║   ███████╗██║  ██║██║     ██║  ██║╚██████╗███████╗
// ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝
                                                                      
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
    DT.startAfterChooseControl = function () {
        if (!DT.game.wasStarted) {
            $(document).trigger('startGame', {});
        }
        $(document).unbind('keyup',DT.handlers.startOnSpace);
    };
    DT.hit = function() {
        $(function(){
            $('.error').html('ERROR ' + DT.genRandomFloorBetween(500, 511));
            $('.hit').css({'display': 'table'}).fadeOut(250);
        });
    };

    $('.menu_button').click(function() {
        $(document).trigger('pauseGame', {});
    });
    $('.resume').click(function() {
        $(document).trigger('resumeGame', {});
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

    $(document).on('startGame', function (e, data) {
        $('.choose_control').fadeOut(250);
    });
    $(document).on('pauseGame', function () {
        $('.menu_page').css({'display': 'table'});
    });
    $(document).on('resumeGame', function (e, data) {
        $('.menu_page').css({'display': 'none'});
    });
    $(document).on('startGame', function (e, data) {
        $('.gameTimer').css({'display': 'block'});
    });
    $(document).on('showScore', function (e, data) {
        $('.current_coins').text(data.score);
    });
    $(document).on('showHelth', function (e, data) {
        $('.helth').animate({width: data.helth + '%'});
    });
    $(document).on('showBonuses', function (e, data) {
        $('.bonus').text(data.caughtBonuses.join(' '));
        if (data.caughtBonuses.length === 3) {
            $('.bonus').fadeOut(300, function(){
                $('.bonus').text('').fadeIn(100);
            });
        }
    });
    $(document).on('gameOver', function (e, data) {
        $('.total_coins').text(DT.player.currentScore);
        $('.game_over').css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 1000);
        $('#one_more_time').click(function () {
            DT.handlers.restart();
        });
    });

// ███████╗████████╗ █████╗ ████████╗███████╗
// ██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝
// ███████╗   ██║   ███████║   ██║   ███████╗
// ╚════██║   ██║   ██╔══██║   ██║   ╚════██║
// ███████║   ██║   ██║  ██║   ██║   ███████║
// ╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝

    DT.setStats = function () {
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
    $(document).on('startGame', function (e, data) {
        DT.setStats();
    });
    $(document).on('update', function (e, data) {
        DT.stats.update();
        DT.stats2.update();
    });

// ████████╗██╗  ██╗███████╗    ███████╗███╗   ██╗██████╗ 
// ╚══██╔══╝██║  ██║██╔════╝    ██╔════╝████╗  ██║██╔══██╗
   // ██║   ███████║█████╗      █████╗  ██╔██╗ ██║██║  ██║
   // ██║   ██╔══██║██╔══╝      ██╔══╝  ██║╚██╗██║██║  ██║
   // ██║   ██║  ██║███████╗    ███████╗██║ ╚████║██████╔╝
   // ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚══════╝╚═╝  ╚═══╝╚═════╝ 

    return DT;
} ());