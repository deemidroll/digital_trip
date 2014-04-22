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
        requestAnimationFrame = function () {
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
        cancelAnimationFrame = function () {
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

    DT.animate = function (nowMsec) {
        nowMsec = nowMsec || Date.now();
        DT.animate.lastTimeMsec = DT.animate.lastTimeMsec || nowMsec - 1000 / 60;
        var deltaMsec = Math.min(200, nowMsec - DT.animate.lastTimeMsec);
        // keep looping
        DT.animate.id = requestAnimationFrame(DT.animate);
        // change last time
        DT.animate.lastTimeMsec = nowMsec;
        // call each update function
        $(document).trigger('update', {
            delta: deltaMsec / 1000,
            now: nowMsec / 1000
        });
    };

    // TODO: передедать коллекции
    DT.collections = {
        caughtBonuses: []
    };
    // TODO: рефакторинг
    

    DT.renderer = new THREE.WebGLRenderer();

    DT.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 300);

    DT.scene = new THREE.Scene();

    DT.composer = null; // not use
    // TODO: объединить с объектом player
    DT.sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhongMaterial({color: 0xff0000}));
    
    DT.lights = {
        light: new THREE.PointLight(0xffffff, 0.75, 100),
        sphereLight: new THREE.PointLight(0xff0000, 1.75, 15),
        sphereLightning: new THREE.PointLight(0xff0000, 0.75, 7.5),
        directionalLight: new THREE.DirectionalLight(0xffffff, 0.25)
    };
    $(document).on('update', function (e, data) {
        DT.moveSphere(DT.sphere, DT.player.destPoint, 3);
        DT.lights.sphereLight.position.x = DT.sphere.position.x;
        DT.lights.sphereLight.position.y = DT.sphere.position.y;
    });

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

    // TODO: refactor
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
                // DT.sphere.material.color = new THREE.Color('red');
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
    $(document).on('update', function (e, data) {
        DT.blink.update();
    });

    DT.bgTexture = THREE.ImageUtils.loadTexture('img/bg.jpg');
    DT.handlers = {};
    // DT.snapshot = null; // for restart
    DT.server = window.location.origin !== 'http://localhost' ? window.location.origin : 'http://192.168.1.36';

// ██╗     ██╗███████╗████████╗███████╗███╗   ██╗███████╗██████╗ ███████╗
// ██║     ██║██╔════╝╚══██╔══╝██╔════╝████╗  ██║██╔════╝██╔══██╗██╔════╝
// ██║     ██║███████╗   ██║   █████╗  ██╔██╗ ██║█████╗  ██████╔╝███████╗
// ██║     ██║╚════██║   ██║   ██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗╚════██║
// ███████╗██║███████║   ██║   ███████╗██║ ╚████║███████╗██║  ██║███████║
// ╚══════╝╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚══════╝
                                                                      
    $(document).on('changeScore', function (e, data) {
        $('.current_coins').text(data.score);
    });
    $(document).on('changeHelth', function (e, data) {
        $('.helth').animate({width: data.helth + '%'});
    });
    $(document).on('gameOver', function (e, data) {
        DT.gameOver();
    });
    $(document).on('fun', function (e, data) {
        if (data.isFun) {
            DT.game.speed.setChanger(-18);
            DT.stopSound(0);
            DT.playSound(1);
        } else {
            DT.game.speed.setChanger(0);
            DT.stopSound(1);
            DT.playSound(0);
        }
    });
    $(document).on('resetGame', function (e, data) {

    });
    $(document).on('startGame', function (e, data) {
        DT.setStats();
        $('.gameTimer').css({'display': 'block'});
    });
    $(document).on('update', function (e, data) {
        DT.game.update();
    });

// ██╗  ██╗ █████╗ ███╗   ██╗██████╗ ██╗     ███████╗██████╗ ███████╗
// ██║  ██║██╔══██╗████╗  ██║██╔══██╗██║     ██╔════╝██╔══██╗██╔════╝
// ███████║███████║██╔██╗ ██║██║  ██║██║     █████╗  ██████╔╝███████╗
// ██╔══██║██╔══██║██║╚██╗██║██║  ██║██║     ██╔══╝  ██╔══██╗╚════██║
// ██║  ██║██║  ██║██║ ╚████║██████╔╝███████╗███████╗██║  ██║███████║
// ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝
                                                                  
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
            DT.pauseOff();
        } else {
            DT.pauseOn();
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
        DT.changeDestPoint(0, -1, DT.player.destPoint);
    };
    DT.handlers.right = function () {
        DT.changeDestPoint(0, 1, DT.player.destPoint);
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
        DT.collections = {
            caughtBonuses: []
        };
        DT.audio.reset();
        DT.game.startGame();
        DT.playSound(0);
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

    // game
    DT.gameOver = function() {
        DT.game.wasOver = true;
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
            cancelAnimationFrame(DT.animate.id);
        }, 300);
        DT.sendSocketMessage('gameover');
        DT.prepareToRestart();
    };
    // game
    DT.prepareToRestart = function() {
        $('#one_more_time').click(function () {
            DT.handlers.restart();
        });
        $(document).unbind('keyup', DT.handlers.pauseOnSpace);
        $(document).bind('keyup', DT.handlers.restartOnSpace);
    };
    // interface
    DT.hit = function() {
        $(function(){
            $('.error').html('ERROR ' + DT.genRandomFloorBetween(500, 511));
            $('.hit').css({'display': 'table'}).fadeOut(250);
        });
    };
    // player
    DT.changeDestPoint = function(dy, dx, destPoint) {
        if ((destPoint.x < DT.game.param.spacing && dx > 0) || (destPoint.x > -DT.game.param.spacing && dx < 0)) {
            destPoint.x += dx * DT.game.param.spacing;
        }
        // if (DT.sphere.position.y < -2 && dy > 0) {
        //     DT.player.jumpLength = 0;
        //     DT.player.jump = true;
        // }
        // if (dy < 0) {
        //     DT.player.jump = false;
        // }
    };
    // player
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

    // player
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
    // game
    DT.startAfterChooseControl = function () {
        if (!DT.game.wasStarted) {
            DT.game.startGame();
            DT.stopSound(2);
            DT.playSound(0);
            $('.choose_control').fadeOut(250);
            DT.game.wasStarted = true;
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
        
        DT.initKeyboardControl = function () {
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
                    DT.game.speed.setChanger(36);
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
                    DT.game.speed.setChanger(0);
                    DT.player.stopFun();
                }
            });
            $(document).keyup(DT.handlers.pauseOnSpace);
            DT.game.wasStarted = true;
        };
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
    });
    // STATS
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
    return DT;
} ());