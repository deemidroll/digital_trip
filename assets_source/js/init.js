// ██████╗ ██╗ ██████╗ ██╗████████╗ █████╗ ██╗         ████████╗██████╗ ██╗██████╗ 
// ██╔══██╗██║██╔════╝ ██║╚══██╔══╝██╔══██╗██║         ╚══██╔══╝██╔══██╗██║██╔══██╗
// ██║  ██║██║██║  ███╗██║   ██║   ███████║██║            ██║   ██████╔╝██║██████╔╝
// ██║  ██║██║██║   ██║██║   ██║   ██╔══██║██║            ██║   ██╔══██╗██║██╔═══╝ 
// ██████╔╝██║╚██████╔╝██║   ██║   ██║  ██║███████╗       ██║   ██║  ██║██║██║     
// ╚═════╝ ╚═╝ ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝       ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝     

window.DT = (function (window, document, undefined) {
    'use strict';
    var DT = {},
        THREE = window.THREE,
        WebAudio = window.WebAudio,
        $ = window.$,
        THREEx = window.THREEx,
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
    DT.gameOverTime = 6000;
    DT.scale = 3;

    DT.$document = $(document);
    DT.$window = $(window);
    DT.$title = $('title');
    DT.$body = $('body');
    DT.$chooseControl = $('.choose_control');
    DT.$pause = $('.pause');
    DT.$share = $('.share');

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
    //faster than Math.min with two args
    DT.getMin = function (a, b) {
        return a < b ? a : b;
    };
    //faster than Math.max with two args
    DT.getMax = function (a, b) {
        return a > b ? a : b;
    };
    DT.normalizeT = function (t) {
        t = t % 1;
        t = t < 0 ? 1 + t : t;
        return t;
    };
    DT.getNormalAt = function (t, tube, normals) {
        tube = tube || DT.tube;
        normals = normals || 'normals';
        var normal = new THREE.Vector3(),
            segments = tube[normals].length,
            pickt = t * segments,
            pick = Math.floor( pickt ),
            pickNext = ( pick + 1 ) % segments;

        if (pick < 0) pick = 0;

        tube = tube || DT.tube;
        if (!tube[normals][ pickNext ] || !tube[normals][ pick ]) console.log(pickNext, pick);
        normal.subVectors( tube[normals][ pickNext ], tube[normals][ pick ] );
        normal.multiplyScalar( pickt - pick ).add( tube[normals][ pick ] );
        return normal;
    };
    DT.getBinormalAt = function (t, tube) {
        return DT.getNormalAt(t, tube, 'binormals');
    };
    DT.createGeometry = function (circumradius) {
        var geometry = new THREE.Geometry(),
            x,
            innerradius = circumradius * 0.97,
            n = 60;

        function setMainVert (rad, numb) {
            var vert = [];
            for (var i = 0; i < numb; i++) {
                var vec3 = new THREE.Vector3(
                    rad * Math.sin((Math.PI / numb) + (i * ((2 * Math.PI)/ numb))),
                    rad * Math.cos((Math.PI / numb) + (i * ((2 * Math.PI)/ numb))),
                    0
                );
                // vec3.i = i;
                vert.push(vec3);
            }
            return vert;
        }

        function fillVert (vert) {
            var nFilled, nUnfilled, result = [];

            nFilled = vert.length;
            nUnfilled = n/nFilled;
            vert.forEach(function (el, i, arr) {
                var nextInd = i === arr.length - 1 ? 0 : i + 1;
                var vec = el.clone().sub(arr[nextInd]);
                for (var j = 0; j < nUnfilled; j++) {
                    result.push(vec.clone().multiplyScalar(1/nUnfilled).add(el));
                }
            });
            return result;
        }

        // set morph targets
        [60, 5, 4, 3, 2].forEach(function (el, i, arr) {
            var vert,
                vertOuter,
                vertInner;

            vertOuter = fillVert(setMainVert(circumradius, el).slice(0)).slice(0);
            vertInner = fillVert(setMainVert(innerradius, el).slice(0)).slice(0);

            vert = vertOuter.concat(vertInner);

            geometry.morphTargets.push({name: 'vert'+i, vertices: vert});

            if (i === 0) {
                geometry.vertices = vert.slice(0);
            }
        });
        
        // Generate the faces of the n-gon.
        for (x = 0; x < n; x++) {
            var next = x === n - 1 ? 0 : x + 1;
            geometry.faces.push(new THREE.Face3(x, next, x + n));
            geometry.faces.push(new THREE.Face3(x + n, next, next + n));
        }

        return geometry;
    };
    DT.lookAt = function (t, tube, tObject) {
        var tLook = DT.normalizeT(t),
            normalLook = DT.getNormalAt(tLook),
            binormalLook = DT.getBinormalAt(tLook),
            vectorLook = tube.path.getTangentAt(tLook)
                .multiplyScalar(DT.scale)
                .add(tObject.position);

        var m1 = new THREE.Matrix4().copy( tObject.matrix );
        m1.lookAt( vectorLook, tObject.position, normalLook );
        tObject.rotation.setFromRotationMatrix( m1 );
    };
    DT.animate = function (nowMsec) {
        nowMsec = nowMsec || Date.now();
        DT.animate.lastTimeMsec = DT.animate.lastTimeMsec || nowMsec - 1000 / 60;
        var deltaMsec = DT.getMin(100, nowMsec - DT.animate.lastTimeMsec);
        // keep looping
        DT.animate.id = requestAnimFrame(DT.animate);
        // change last time
        DT.animate.lastTimeMsec = nowMsec;
        // call each update function
        DT.$document.trigger('updatePath', {
            delta: deltaMsec / 1000,
            now: nowMsec / 1000,
        });
    };
    DT.$document.on('startGame', function (e, data) {
        DT.animate.id = requestAnimFrame(DT.animate);
    });
    DT.$document.on('pauseGame', function () {
        cancelAnimFrame(DT.animate.id);
    });
    DT.$document.on('resumeGame', function (e, data) {
        DT.animate.id = requestAnimFrame(DT.animate);
    });
    // coupling
    DT.$document.on('gameOver', function (e, data) {
        $('.restart').bind('click',DT.handlers.restart);
        $('.change_controls.gameover_control').bind('click', DT.handlers.chooseControlAfterGameOver);
        DT.$document.bind('keyup', DT.handlers.restartOnSpace);
        if (data.cause === 'death') {
            DT.gameOverTimeout = setTimeout(function() {
                cancelAnimFrame(DT.animate.id);
            }, DT.gameOverTime);
        } else {
            cancelAnimFrame(DT.animate.id);
        }
    });
    DT.$document.on('resetGame', function (e, data) {
        clearTimeout(DT.gameOverTimeout);
        cancelAnimFrame(DT.animate.id); 
    });

// ████████╗██╗  ██╗██████╗ ███████╗███████╗    ██╗    ██╗ ██████╗ ██████╗ ██╗     ██████╗ 
// ╚══██╔══╝██║  ██║██╔══██╗██╔════╝██╔════╝    ██║    ██║██╔═══██╗██╔══██╗██║     ██╔══██╗
   // ██║   ███████║██████╔╝█████╗  █████╗      ██║ █╗ ██║██║   ██║██████╔╝██║     ██║  ██║
   // ██║   ██╔══██║██╔══██╗██╔══╝  ██╔══╝      ██║███╗██║██║   ██║██╔══██╗██║     ██║  ██║
   // ██║   ██║  ██║██║  ██║███████╗███████╗    ╚███╔███╔╝╚██████╔╝██║  ██║███████╗██████╔╝
   // ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝     ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝ 

    DT.renderer = new THREE.WebGLRenderer({antialiasing: true});
    DT.renderer.setSize(window.innerWidth, window.innerHeight);
    DT.renderer.physicallyBasedShading = true;
    DT.renderer.domElement.style.position = 'absolute';
    DT.renderer.domElement.style.left = 0;
    DT.renderer.domElement.style.top = 0;
    DT.renderer.domElement.style.zIndex = -1;
    document.body.appendChild(DT.renderer.domElement);
    $(DT.renderer.domElement).css({webkitFilter:'blur(0px)'});

    DT.scene = new THREE.Scene();

    // PATH
    var parent = new THREE.Object3D();
    DT.scene.add(parent);
    DT.splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
    parent.add(DT.splineCamera);

    // when resize
    new THREEx.WindowResize(DT.renderer, DT.splineCamera);

    // var extrudePath = new THREE.Curves.GrannyKnot(); 
    // var extrudePath = new THREE.Curves.KnotCurve();
    // var extrudePath = new THREE.Curves.TrefoilKnot();
    var extrudePath = new THREE.Curves.TorusKnot();
    // var extrudePath = new THREE.Curves.CinquefoilKnot();

    var tube = new THREE.TubeGeometry(extrudePath, 100, 3, 8, true, true);

    DT.tube = tube;

    // var tubeMesh = THREE.SceneUtils.createMultiMaterialObject( tube, [
    //             new THREE.MeshLambertMaterial({
    //                 opacity: 0,
    //                 transparent: true
    //             }),
    //             new THREE.MeshBasicMaterial({
    //                 opacity: 0,
    //                 transparent: true
    //         })]);
    // parent.add(tubeMesh);
    // tubeMesh.scale.set( DT.scale, DT.scale, DT.scale );

    var binormal = new THREE.Vector3();
    var normal = new THREE.Vector3();

    // coupling
    DT.$document.on('updatePath', function (e, data) {
        DT.renderer.render(DT.scene, DT.splineCamera);
        var dtime = data.delta,
            speed0 = DT.game.speed.getSpeed0(),
            path, dpath, t, pos;
        
        dpath = speed0 * dtime;
        DT.game.path += dpath;
        path = DT.game.path;
        
        t = path % 1;
        pos = tube.path.getPointAt( t );

        pos.multiplyScalar(DT.scale);

        // interpolation
        var segments = tube.binormals.length,
            pickt = t * segments,
            pick = Math.floor( pickt ),
            pickNext = ( pick + 1 ) % segments;

        binormal.subVectors( tube.binormals[ pickNext ], tube.binormals[ pick ] );
        binormal.multiplyScalar( pickt - pick ).add( tube.binormals[ pick ] );

        var dir = tube.path.getTangentAt( DT.normalizeT(t + 0.01) ),
            offset = 0;

        normal.copy( binormal ).cross( dir );

        // DT.angleSign = t > 0.5 ? 1 : -1;

        DT.splineCamera.position = pos;

        var lookAt = new THREE.Vector3().copy( pos ).add( dir );

        DT.splineCamera.matrix.lookAt(DT.splineCamera.position, lookAt, normal);
        DT.splineCamera.rotation.setFromRotationMatrix( DT.splineCamera.matrix, DT.splineCamera.rotation.order );

        parent.rotation.y += ( -parent.rotation.y ) * 0.05;

        data.tube = tube;
        data.t = t;
        data.normal = normal;
        data.binormal = binormal;
        DT.$document.trigger('update', data);
    });

    // LIGHTS
    DT.lights = {
        light: new THREE.PointLight(0xffffff, 0.75, 100),
        directionalLight: new THREE.DirectionalLight(0xffffff, 0.5)
    };
    DT.scene.add(DT.lights.light);
    DT.scene.add(DT.lights.directionalLight);

    DT.$document.on('update', function (e, data) {
        var posLight = data.tube.path.getPointAt(DT.normalizeT(data.t));
        posLight.multiplyScalar(DT.scale);
        DT.lights.light.position = posLight;

        var posDirectLight = data.tube.path.getPointAt(DT.normalizeT(data.t + 0.006));
        posDirectLight.multiplyScalar(DT.scale);
        DT.lights.directionalLight.position = posDirectLight;
    });

    // BACKGROUND
    var geomBG = new THREE.SphereGeometry(500, 32, 32);
    var matBG = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/background5.jpg'),
        });
    var worldBG = new THREE.Mesh(geomBG, matBG);
    worldBG.material.side = THREE.BackSide;
    worldBG.rotation.x = Math.PI/8;
    worldBG.rotation.y = -Math.PI/2;
    worldBG.rotation.z = Math.PI/2;
    DT.scene.add(worldBG);

    // EFFECT
    DT.effectComposer = new THREE.EffectComposer( DT.renderer );
    DT.effectComposer.addPass( new THREE.RenderPass( DT.scene, DT.splineCamera ) );
    DT.effectComposer.on = false;

    var badTVParams = {
        mute:true,
        show: true,
        distortion: 3.0,
        distortion2: 1.0,
        speed: 0.3,
        rollSpeed: 0.1
    }
    
    var badTVPass = new THREE.ShaderPass( THREE.BadTVShader );
    badTVPass.on = false;
    badTVPass.renderToScreen = true;
    DT.effectComposer.addPass(badTVPass);

    DT.$document.on('update', function (e, data) {
        if (DT.effectComposer.on) {
            badTVPass.uniforms[ "distortion" ].value = badTVParams.distortion;
            badTVPass.uniforms[ "distortion2" ].value = badTVParams.distortion2;
            badTVPass.uniforms[ "speed" ].value = badTVParams.speed;
            badTVPass.uniforms[ "rollSpeed" ].value = badTVParams.rollSpeed;
            DT.effectComposer.render();
                badTVParams.distortion+=0.3;
                badTVParams.distortion2+=0.1;
                badTVParams.speed+=0.03;
                badTVParams.rollSpeed+=0.01;
        };
    });
    DT.$document.on('gameOver', function (e, data) {
        DT.effectComposer.on = true;
    });
    DT.$document.on('resetGame', function (e, data) {
        DT.effectComposer.on = false;
        badTVParams = {
            distortion: 3.0,
            distortion2: 1.0,
            speed: 0.3,
            rollSpeed: 0.1
        }
    });

    // change IcosahedronGeometry prototype
    THREE.IcosahedronGeometry = function (radius, detail) {
        this.radius = radius;
        this.detail = detail;
        var t = (1 + Math.sqrt(5)) / 2;
        var vertices = [
            [ -1,  t,  0 ], [  1, t, 0 ], [ -1, -t,  0 ], [  1, -t,  0 ],
            [  0, -1,  t ], [  0, 1, t ], [  0, -1, -t ], [  0,  1, -t ],
            [  t,  0, -1 ], [  t, 0, 1 ], [ -t,  0, -1 ], [ -t,  0,  1 ]
        ];
        vertices = vertices.map(function (el) {
            return el.map(function (el) {
                return el * Math.random();
            });
        });
        var faces = [
            [ 0, 11,  5 ], [ 0,  5,  1 ], [  0,  1,  7 ], [  0,  7, 10 ], [  0, 10, 11 ],
            [ 1,  5,  9 ], [ 5, 11,  4 ], [ 11, 10,  2 ], [ 10,  7,  6 ], [  7,  1,  8 ],
            [ 3,  9,  4 ], [ 3,  4,  2 ], [  3,  2,  6 ], [  3,  6,  8 ], [  3,  8,  9 ],
            [ 4,  9,  5 ], [ 2,  4, 11 ], [  6,  2, 10 ], [  8,  6,  7 ], [  9,  8,  1 ]
        ];
        THREE.PolyhedronGeometry.call(this, vertices, faces, radius, detail);
    };
    THREE.IcosahedronGeometry.prototype = Object.create(THREE.Geometry.prototype);

// ███████╗██╗  ██╗████████╗███████╗██████╗ ███╗   ██╗ █████╗ ██╗         ███╗   ███╗ ██████╗ ██████╗ ███████╗██╗     ███████╗
// ██╔════╝╚██╗██╔╝╚══██╔══╝██╔════╝██╔══██╗████╗  ██║██╔══██╗██║         ████╗ ████║██╔═══██╗██╔══██╗██╔════╝██║     ██╔════╝
// █████╗   ╚███╔╝    ██║   █████╗  ██████╔╝██╔██╗ ██║███████║██║         ██╔████╔██║██║   ██║██║  ██║█████╗  ██║     ███████╗
// ██╔══╝   ██╔██╗    ██║   ██╔══╝  ██╔══██╗██║╚██╗██║██╔══██║██║         ██║╚██╔╝██║██║   ██║██║  ██║██╔══╝  ██║     ╚════██║
// ███████╗██╔╝ ██╗   ██║   ███████╗██║  ██║██║ ╚████║██║  ██║███████╗    ██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗███████╗███████║
// ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝

    DT.listOfModels = [{
            name: 'bonusH1',
            scale: 0.1,
            rotaion: new THREE.Vector3(0, 0, 0),
            color: 0xff0000,
        }, {
            name: 'bonusI',
            scale: 0.02,
            rotaion: new THREE.Vector3(0, 0, 0),
            color: 0x606060,
            '5': 0xffffff,
            'html': 0xffffff,
            'orange': 0xD0671F,
            'shield': 0xC35020,
        }, {
            name: 'bonusE1',
            scale: 0.75,
            rotaion: new THREE.Vector3(0, 0, 0),
            color: 0x606060,
        }, {
            name: 'bonusH2',
            scale: 0.1,
            rotaion: new THREE.Vector3(0, 0, 0),
            color: 0xff0000,
        }, {
            name: 'shield',
            scale: 0.16,
            rotaion: new THREE.Vector3(0, 0, 0),
            color: 0x606060,
        }, {
            name: 'bonusE2',
            scale: 0.75,
            rotaion: new THREE.Vector3(0, 0, 0),
            color: 0x606060,
        }
    ];
    // LOADER
    var manager = new THREE.LoadingManager();

    manager.onProgress = function (item, loaded, total) {
        console.info('loaded item', loaded, 'of', total, '('+item+')');
    };
    
    var loader = new THREE.OBJLoader(manager);

    DT.listOfModels.forEach(function (el, i, a) {
        loader.load('objects/' + el.name + '.obj', function ( object ) {
            object.traverse( function ( child ) {
                var color = el[child.name] || el.color; 
                child.material = new THREE.MeshPhongMaterial({
                    color: color,
                    shading: THREE.SmoothShading,
                    emissive: new THREE.Color(color).multiplyScalar(0.5),
                    shininess: 100,
                });
            });
            if (i === 1) {
                a[i].object = object
            } else {
                a[i].object = object.children[0];
            }
            DT.$document.trigger('externalObjectLoaded', {index: i});
        });
    });

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
        'gameOver'      : 'custom',
        'resetGame'     : 'custom',

        'update'        : 'custom',
        'updatePath'    : 'custom',

        'changeSpeed'   : 'custom',

        'makeFun'       : 'custom',
        'stopFun'       : 'custom',
        'showFun'       : 'custom',

        'makeInvulner'  : 'custom',
        'stopInvulner'  : 'custom',
        'showInvulner'  : 'custom',

        'changeHelth'   : 'custom',
        'showHelth'     : 'custom',

        'changeScore'   : 'custom',
        'showScore'     : 'custom',

        'catchBonus'    : 'custom',

        'blink'         : 'custom',
        'bump'          : 'custom',

        'focus'         : 'native',
        'blur'          : 'native',
    };

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
            stonesCloseness: 30,
            globalVolume: 1,
            prevGlobalVolume: 1
        };
        this.speed = {
            speed0: 1/60,
            speed: 1/60,
            acceleration: 1/2500,
            changer: 0,
            speedIncTimer: 0,
            divirer: 1,
            setChanger: function (changer) {
                this.changer = changer;
            },
            increaseSpeed: function (dtime) {
                this.speedIncTimer += 1;
                this.speed = this.speed0 + this.acceleration * Math.sqrt(this.speedIncTimer);
                // this.speed0 += this.acceleration * dtime;
            },
            slowDown: function (mult) {
                this.speedIncTimer *= mult;
            },
            getChanger: function() {
                return this.changer;
            },
            getSpeed0: function () {
                return (this.speed + this.changer) / this.divider;
            },
            getAcceleration: function () {
                return this.acceleration;
            }
        };
        this.wasStarted = false;
        this.wasPaused = false;
        this.wasOver = false;
        this.wasMuted = false;
        this.timer = 0;
        this.path = 0;
    };
    DT.Game.prototype.startGame = function() {
        this.wasStarted = true;
    };

    DT.Game.prototype.updateTimer = function (dtime) {
        var sec, min;
        this.timer += dtime;
        sec = Math.floor(this.timer);
        if (sec > Math.floor(this.timer - dtime) ) {
            min = Math.floor(sec / 60);
            sec = sec % 60;
            sec = sec < 10 ? '0' + sec.toString() : sec;
            DT.$title.html(min + ':' + sec + ' in digital trip');
        }
    };
    DT.Game.prototype.update = function(data) {
        this.updateTimer(data.delta);
        this.speed.increaseSpeed(data.delta);
    };
    DT.Game.prototype.reset = function() {
        this.timer = 0;
        this.path = 0;
        this.speed.changer = 0;
        this.speed.speed0 = 1/60;
        this.wasOver = false;
        this.wasPaused = false; // ?
        this.wasStarted = false;
        this.speed.speedIncTimer = 0;
    };
    DT.Game.prototype.gameOver = function() {
        this.wasOver = true;
    };

    DT.game = new DT.Game();

    DT.$document.on('startGame', function (e, data) {
        DT.game.startGame();
        DT.game.speed.divider = data.control === 'webcam' ? 2 : 1;
    });
    DT.$document.on('pauseGame', function () {
        DT.game.wasPaused = true;
    });
    DT.$document.on('resumeGame', function (e, data) {
        DT.game.wasPaused = false;
    });
    DT.$document.on('update', function (e, data) {
        DT.game.update(data);
    });
    DT.$document.on('changeSpeed', function (e, data) {
        DT.game.speed.setChanger(data.changer);
    });
    DT.$document.on('gameOver', function (e, data) {
        DT.game.gameOver();
    });
    DT.$document.on('resetGame', function (e, data) {
        DT.game.reset();
    });
    DT.$document.on('showFun', function (e, data) {
        if (data.isFun) {
            DT.$document.trigger('changeSpeed', {changer: -DT.game.speed.getSpeed0()/2});
            DT.game.speed.slowDown(0.5);
        } else {
            DT.$document.trigger('changeSpeed', {changer: 0});
        }
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
        this.position = new THREE.Vector3();
        this.destPoint = options.destPoint || new THREE.Vector3(0, 0, 0);
        this.isInvulnerability = options.isInvulnerability || false;
        this.isFun = options.isFun || false;
        this.invulnerTimer = null;
        this.funTimer = null;

        this.sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhongMaterial({color: 0xff0000}));
        this.sphere.position = this.position;

        this.t = 0;

        this.light = new THREE.PointLight(0xff0000, 1.75, 15);
        this.light.position = this.position;
        this.light.color = this.sphere.material.color;
        this.scene.add(this.light);

        this.firstMove = true;
        this.moveIterator = 0;

        this.lines = new THREE.Object3D();
        this.scene.add(this.lines);

        var lineGeom = DT.createGeometry(2),
            limeMat = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                // wireframe: true,
                transparent: true,
                opacity: 0.6,
                morphTargets: true,
                // emissive: 0xff0000,
                // shading: THREE.FlatShading,
                // specular: 0x111111,
                // shininess: 100
            }),
            limeMat2 = new THREE.MeshBasicMaterial({
                color: 0x00ffc6,
                // wireframe: true,
                transparent: true,
                opacity: 0.4,
                morphTargets: true,
                // emissive: 0x00ffc6,
                // shading: THREE.FlatShading,
                // specular: 0x111111,
                // shininess: 100
            });

        this.line = new THREE.Mesh(lineGeom, limeMat);
        this.line2 = new THREE.Mesh(lineGeom, limeMat2);

        this.line.position.z = +0.5;
        this.lines.add(this.line);

        this.line2.position.z = -0.5;
        this.lines.add(this.line2);

        this.blink = {
            defColor: new THREE.Color('red'),
            color: new THREE.Color('white'),
            bColor: new THREE.Color(0, 0, 0),
            frames: 0,
            framesLeft: 0,
            doBlink: function (color, frames) {
                var tempColor = new THREE.Color(color).multiplyScalar(-1);
                this.color = new THREE.Color(color);
                this.framesLeft = this.frames = frames;
                this.bColor.addColors(this.defColor, tempColor).multiplyScalar(1/frames);
            },
        };

        this.emitter = Fireworks.createEmitter({nParticles : 100})
        .effectsStackBuilder()
            .spawnerSteadyRate(30)
            .position(Fireworks.createShapePoint(0, 0, 0))
            .velocity(Fireworks.createShapePoint(0, 0, 0))
            .lifeTime(0.2, 0.7)
            .renderToThreejsParticleSystem({
                particleSystem  : function(emitter){
                    var i,
                        geometry    = new THREE.Geometry(),
                        texture = Fireworks.ProceduralTextures.buildTexture(),
                        material    = new THREE.ParticleBasicMaterial({
                            color       : new THREE.Color().setHSL(1, 0, 0.6).getHex(),
                            size        : 1.3,
                            sizeAttenuation : true,
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
                    
                    parent.add(particleSystem);
                    self.particleSystem = particleSystem;
                    return particleSystem;
                }
            }).back()
        .start();
    };

    DT.Player.prototype.updateBlink = function () {
        // TODO: refactor
        if (this.blink.framesLeft === 0) {
            return this;
        }
        if (this.blink.framesLeft === 1) {
            this.sphere.material.color.copy(this.blink.defColor);
        }
        if (this.blink.framesLeft === this.blink.frames) {
            this.sphere.material.color.copy(this.blink.color);
        }
        if (this.blink.framesLeft < this.blink.frames) {
            this.sphere.material.color.add(this.blink.bColor);
        }
        this.blink.framesLeft -= 1;
        return this;
    };

    DT.Player.prototype.changeHelth = function(delta) {
        if (delta > 0 || this.isInvulnerability === false) {
            var helth = this.currentHelth;
            if (helth > 0) {
                helth += delta;
                if (helth <= 0) {
                    helth = 0;
                    DT.$document.trigger('gameOver', {cause: 'death'});
                }
                if (helth > 100) {
                    helth = 100;
                }
            }
            this.currentHelth = helth;
            DT.$document.trigger('showHelth', {delta: delta, helth: this.currentHelth});
        }
        return this;
    };

    DT.Player.prototype.makeInvulner = function (time) {
        this.invulnerTimer = (time || 10000) / 1000 * 60;
        this.isInvulnerability = true;
        DT.$document.trigger('showInvulner', {invulner: true});
        return this;
    };

    DT.Player.prototype.stopInvulner = function () {
        if (!this.isInvulnerability) return;
        this.invulnerTimer = 0;
        this.isInvulnerability = false;
        DT.$document.trigger('showInvulner', {invulner: false});
        return this;
    };

    DT.Player.prototype.changeScore = function(delta) {
        this.currentScore += delta;
        this.currentScore = parseFloat(this.currentScore.toFixed(1));
        // DT.$document.trigger('showScore', {score: this.currentScore % 1 ? this.currentScore : this.currentScore.toString() + '.0' });
        DT.$document.trigger('showScore', {score: this.currentScore});
        return this;
    };

    DT.Player.prototype.makeFun = function(time) {
        this.isFun = true;
        this.funTimer = (time || 10000) / 1000 * 60;
        DT.$document.trigger('showFun', {isFun: true});
        return this;
    };

    DT.Player.prototype.stopFun = function () {
        this.isFun = false;
        this.funTimer = 0;
        DT.$document.trigger('showFun', {isFun: false});
        return this;
    };

    DT.Player.prototype.updateInvulnerability = function () {
        if (this.isInvulnerability) {
            this.invulnerTimer -= 1;
            if (this.invulnerTimer <= 0) {
                this.isInvulnerability = false;
                DT.$document.trigger('showInvulner', {invulner: false});
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

    DT.Player.prototype.update = function (data) {
        // var self = this;
        this.t = DT.normalizeT(data.t + 0.004);
        var pos = data.tube.path.getPointAt(this.t);
        var posPlayer = pos.clone().multiplyScalar(DT.scale);
        data.normalPos = posPlayer.clone();

        posPlayer.add(binormal.multiplyScalar(DT.scale * this.destPoint.x));
        data.actualPos = posPlayer.clone();

        this.updateInvulnerability();
        this.updateFun();
        this.updateBlink();

        this.moveSphere(data);

        this.lines.position = this.position.clone();

        DT.lookAt(data.t + 0.006, data.tube, this.lines);

        this.lines.children.forEach(function (el, i) {
            DT.angleSign = i === 0 ? 1 : -1;
            el.rotation.z += Math.PI/360/2 * DT.angleSign;
            el.scale = new THREE.Vector3(1,1,1).addScalar(DT.audio.valueAudio/256/30);
        });

        this.particleSystem.position.copy(this.position);

        // visualize audio
        // var dt = DT.audio.valueAudio/10;
        var posVel = data.tube.path.getTangentAt(data.t).negate().multiplyScalar(DT.scale * 2)
            // .setLength(3 + dt);

        this.emitter.update(data.delta).render();
        this.emitter._particles.forEach(function(el) {
            el.velocity.vector = posVel;
        });
        return this;
    };

    DT.Player.prototype.reset = function () {
        this.currentHelth = 100;
        this.currentScore = 0;
        this.destPoint = new THREE.Vector3(0, 0, 0);
        this.isInvulnerability = false;
        this.isFun = false;
        return this;
    };

    DT.Player.prototype.changeDestPoint = function(vector3) {
        if (!vector3.equals(this.destPoint)) {
            this.destPoint.add(vector3);
        }
        return this;
    };

    DT.Player.prototype.moveSphere = function(data) {
        var normalPos = data.normalPos,
            actualPos = data.actualPos,
            offsetForw,
            offsetSide,
            max = 7;

        if (this.firstMove) {
            this.position = actualPos;
            this.prevActualPos = actualPos;
            this.prevNormalPos = normalPos;
            this.firstMove = !this.firstMove;
        }

        offsetForw = normalPos.clone().sub(this.position);
        this.position.add(offsetForw);
        this.prevActualPos.add(normalPos.clone().sub(this.prevNormalPos));
        this.prevNormalPos.add(normalPos.clone().sub(this.prevNormalPos));

        if (!this.position.equals(actualPos)) {
            this.prevActualPos = actualPos;
            this.moveIterator += 1;
        } else {
            this.moveIterator -= 1;
        }
        
        if (this.moveIterator > max) this.moveIterator = max;
        if (this.moveIterator <  0) this.moveIterator =  0;

        offsetSide = this.prevActualPos.clone().sub(normalPos).multiplyScalar(this.moveIterator / max);
        
        this.position.add(offsetSide);

        if (!normalPos.equals(actualPos)) {
            this.prevActualPos = actualPos;
        }

        this.light.position = this.sphere.position = this.position;

        DT.moveIterator = this.moveIterator
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
        destPoint: new THREE.Vector3(0, 0, 0),
        isInvulnerability: false,
        isFun: false,
    });
    DT.$document.on('update', function (e, data) {
        DT.player.update(data);
    });
    DT.$document.on('makeFun', function (e, data) {
        if (!DT.game.wasOver) DT.player.makeFun();
    });
    DT.$document.on('stopFun', function (e, data) {
        DT.player.stopFun();
    });
    DT.$document.on('changeScore', function (e, data) {
        DT.player.changeScore(data.delta);
    });
    DT.$document.on('changeHelth', function (e, data) {
        DT.player.changeHelth(data.delta);
    });
    DT.$document.on('makeInvulner', function (e, data) {
        DT.player.makeInvulner();
    });
    DT.$document.on('stopInvulner', function (e, data) {
        DT.player.stopInvulner();
    });
    DT.$document.on('blink', function (e, data) {
        DT.player.blink.doBlink(data.color, data.frames);
    });
    DT.$document.on('gameOver', function (e, data) {
        DT.player.stopFun();
    });
    DT.$document.on('resetGame', function (e, data) {
        DT.player.reset();
    });
    // lines
    DT.$document.on('showHelth', function (e, data) {
        var mt = (100 - data.helth) / 25,
            counter = 0;
        clearInterval(DT.lineChangeInterval);
        DT.lineChangeInterval = setInterval(function () {
            var max = 40;
            counter++
            DT.player.lines.children.forEach(function (el, ind) {
                if (ind > 1) return;
                el.morphTargetInfluences.forEach(function (e, i, a) {
                    if (e !== 0 && i !== mt) a[i] = DT.getMax(a[i] - 1/max, 0);
                });
                el.morphTargetInfluences[ mt ] = DT.getMin(el.morphTargetInfluences[ mt ] + 1/max, 1);
            });
            if (counter === max) clearInterval(DT.lineChangeInterval);
        }, 20);
    });
    DT.$document.on('resetGame', function (e, data) {
        clearInterval(DT.lineChangeInterval);
        DT.player.lines.children.forEach(function (el, ind) {
            if (ind > 1) return;
            el.morphTargetInfluences.forEach(function (e, i, a) {
                a[i] = 0;
            });
            el.morphTargetInfluences[ 0 ] = 1;
        });
    });
    DT.$document.on('showInvulner', function (e, data) {
        DT.handlers.triggerOpacityOnLines(data.invulner);
    });
    DT.$document.on('showFun', function (e, data) {
        DT.handlers.triggerOpacityOnLines(data.isFun);
    });

 // ██████╗  █████╗ ███╗   ███╗███████╗     ██████╗ ██████╗      ██╗███████╗ ██████╗████████╗
// ██╔════╝ ██╔══██╗████╗ ████║██╔════╝    ██╔═══██╗██╔══██╗     ██║██╔════╝██╔════╝╚══██╔══╝
// ██║  ███╗███████║██╔████╔██║█████╗      ██║   ██║██████╔╝     ██║█████╗  ██║        ██║   
// ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝      ██║   ██║██╔══██╗██   ██║██╔══╝  ██║        ██║   
// ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗    ╚██████╔╝██████╔╝╚█████╔╝███████╗╚██████╗   ██║   
 // ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝     ╚═════╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   

    DT.GameObject = function (options) {
        this.tObject = options.tObject || new options.THREEConstructor(
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
        // this.tObject.children.forEach(function (el) {
            // if (el.geometry && el.geometry.dispose ) el.geometry.dispose();
        //     if (el.material && el.material.dispose ) el.material.dispose();
        //     if (el.texture && el.texture.dispose ) el.texture.dispose();
        // });
        // if (this.tObject.geometry && this.tObject.geometry.dispose ) this.tObject.geometry.dispose();
        // if (this.tObject.material && this.tObject.material.dispose ) this.tObject.material.dispose();
        // if (this.tObject.texture && this.tObject.texture.dispose ) this.tObject.texture.dispose();
        return this;
    };
    DT.GameObject.prototype.create = function () {
        // empty method
        console.warn('try to call empty method');
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
        console.warn('try to call empty method');
        return this;
    };
    DT.GameObject.prototype.updateMaterial = function (options) {
        // empty method
        console.warn('try to call empty method');
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
        if (this.tObject.position.distanceTo(options.dieCoord) < 10) {
            this.removeFromScene();
        } 
        var dist = this.tObject.position.distanceTo(options.opacityCoord),
            far = 10;
        if (dist < far) {
            var opacity = dist / far;
            if (this.tObject.children.length > 0) {
                this.tObject.children.forEach(function (el) {
                    el.material.transparent = true;
                    if (el.material.opacity > 0) el.material.opacity = opacity;
                });
            } else {
                this.tObject.material.transparent = true;
                this.tObject.material.opacity = opacity;
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
        this.tObject.scale.multiplyScalar(DT.listOfModels[4].scale);
        this.tObject.position = options.player.position;
        this.tObject.material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            refractionRatio: 0,
            emissive:0xffffff,
            transparent: true,
            opacity: 0.05,
            wireframe: true,
            wireframeLinewidth: 3,
            shading: THREE.FlatShading,
        });
        this.player = options.player;
        this.interval;
    };
    DT.Shield.prototype = Object.create(DT.GameObject.prototype);
    DT.Shield.prototype.constructor = DT.Shield;

    DT.Shield.prototype.update = function () {
        this.tObject.position = this.player.position;
        DT.lookAt(DT.player.t - 0.004, DT.tube, this.tObject);
    };

DT.$document.on('externalObjectLoaded', function (e, data) {
    if (data.index !== 4) return;
    DT.shield = new DT.Shield({
        tObject: DT.listOfModels[4].object.clone(),
        player: DT.player
    });

    DT.$document.on('update', function (e, data) {
        DT.shield.update();
    });

    DT.$document.on('showInvulner', function (e, data) {
        if (data.invulner) {
            clearInterval(DT.shield.interval);
            DT.shield.tObject.material.opacity = 0.05
            DT.shield.tObject.scale.set(DT.listOfModels[4].scale, DT.listOfModels[4].scale, DT.listOfModels[4].scale);
            DT.shield.addToScene();
        } else {
            DT.shield.interval = setInterval(function () {
                DT.shield.tObject.material.opacity -= 0.0025;
                DT.shield.tObject.scale.addScalar(DT.listOfModels[4].scale/20);
                if (DT.shield.tObject.material.opacity < 0) {
                    DT.shield.removeFromScene();
                    clearInterval(DT.shield.interval);
                }
            }, 20);
        }
    });
});

// ██████╗ ██╗   ██╗███████╗████████╗
// ██╔══██╗██║   ██║██╔════╝╚══██╔══╝
// ██║  ██║██║   ██║███████╗   ██║   
// ██║  ██║██║   ██║╚════██║   ██║   
// ██████╔╝╚██████╔╝███████║   ██║   
// ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   

    DT.Dust = function (options) {
        DT.GameObject.apply(this, arguments);
        this.number = options.number || 2000;
        this.createAndAdd();
    };
    DT.Dust.prototype = Object.create(DT.GameObject.prototype);
    DT.Dust.prototype.constructor = DT.Dust;

    DT.Dust.prototype.create = function () {
        for (var i = 0; i < this.number; i++) {
            this.geometry.vertices.push(new THREE.Vector3(
                DT.genRandomBetween(-120, 120),
                DT.genRandomBetween(-120, 120),
                DT.genRandomBetween(-50, 50)
            ));
        }
        this.material.visible = false;
        this.material.transparent = true;
        this.material.opacity = 0;
        return this;
    };

    DT.Dust.prototype.updateMaterial = function (options) {
        if (!this.material.visible) {
            this.material.visible = true;
        }
        this.material.color = options.isFun ? options.color : new THREE.Color().setRGB(1,0,0);
        this.material.opacity = 0.5 + DT.audio.valueAudio/256;
        return this;
    };

    // Dust object 
    DT.dust = new DT.Dust({
        geometry: new THREE.Geometry({}),
        material: new THREE.ParticleSystemMaterial({size: 0.25}),
        THREEConstructor: THREE.ParticleSystem
    });
    DT.$document.on('update', function (e, data) {
        DT.dust.updateMaterial({
            isFun: DT.player.isFun,
            valueAudio: DT.audio.valueAudio,
            color: DT.player.sphere.material.color
        });
    });

// ███████╗████████╗ ██████╗ ███╗   ██╗███████╗
// ██╔════╝╚══██╔══╝██╔═══██╗████╗  ██║██╔════╝
// ███████╗   ██║   ██║   ██║██╔██╗ ██║█████╗  
// ╚════██║   ██║   ██║   ██║██║╚██╗██║██╔══╝  
// ███████║   ██║   ╚██████╔╝██║ ╚████║███████╗
// ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚══════╝

    DT.Stone = function (options) {
        var radius, color, depth, tObject;

        radius = DT.genRandomBetween(1, 2);
        depth = DT.genRandomFloorBetween(80, 100) / 255;
        color = new THREE.Color().setRGB(depth, depth, depth);

        tObject = THREE.SceneUtils.createMultiMaterialObject( new THREE.IcosahedronGeometry(radius, 0), [
            new THREE.MeshPhongMaterial({
                shading: THREE.FlatShading,
                color: color,
                specular: 0x111111,
                shininess: 100,
                transparent: true,
                opacity: new DT.StonesCollection().opacity,
            }),
            new THREE.MeshPhongMaterial({
                shading: THREE.FlatShading,
                color: color,
                specular: 0x111111,
                shininess: 100,
                transparent: true,
                opacity: 1 - new DT.StonesCollection().opacity,
                wireframe: true,
                wireframeLinewidth: 2,
            })]);

        DT.GameCollectionObject.apply(this, [{
            tObject: tObject,
            collection: options.collection
        }]);
        this.t = options.t;
        this.tObject.position = options.position;
        this.setParam('rotation', {
            x: Math.random(),
            y: Math.random()
        })
        .createAndAdd();
        this.distanceToSphere = null;
        this.wasMissed = false;
    };
    DT.Stone.prototype = Object.create(DT.GameCollectionObject.prototype);
    DT.Stone.prototype.constructor = DT.Stone;

    DT.Stone.prototype.update = function (options) {
        DT.GameCollectionObject.prototype.update.apply(this, arguments);
        var el = this.tObject;
        this.distanceToSphere = el.position.distanceTo(options.sphere.position);
        this.minDistance = options.sphere.geometry.radius + el.children[0].geometry.radius;
            
        if (this.distanceToSphere < this.minDistance) {
            this.removeFromScene();
            // coupling
            if (!DT.game.wasOver) {
                DT.$document.trigger('changeHelth', {delta: -25});
                DT.$document.trigger('bump', {});
                DT.audio.sounds.stoneDestroy.play();
                DT.sendSocketMessage({
                    type: 'vibr',
                    time: 200
                });
            }
            if (!DT.game.wasOver && DT.player.isInvulnerability === false) {
                DT.$document.trigger('blink', {color: 0x000000, frames: 60});
                DT.$document.trigger('hit', {});
            }
        }
        if (!DT.game.wasOver && !this.wasMissed && this.distanceToSphere > this.minDistance && this.distanceToSphere < this.minDistance * 1.2 && this.t < DT.player.t) {
            DT.audio.sounds.stoneMiss.play();
            this.wasMissed = true;
        }
        var binormal = DT.getBinormalAt(this.t),
            estimatedPlayerPosition = options.data.tube.path.getPointAt(this.t)
                .multiplyScalar(DT.scale)
                .add(binormal.multiplyScalar(DT.scale * DT.player.destPoint.x));

        if (el.position.distanceTo(estimatedPlayerPosition) < this.minDistance) {
            if (DT.player.isFun) {
                el.children[1].material.emissive = new THREE.Color().setRGB(1,0,0);
            } else {
                el.children[0].material.emissive = new THREE.Color().setRGB(0.5,0,0);
            }
        } else {
            if (DT.player.isFun) {
                el.children[1].material.emissive = new THREE.Color().setRGB(0,1,0);
            } else {
                el.children[0].material.emissive = new THREE.Color().setRGB(0,0,0);
            }
        }

        this.updateParam('rotation', {x: 0.014, y: 0.014});
        return this;
    };

    DT.StaticStone = function (options) {
        DT.Stone.apply(this, [options]);
    };
    DT.StaticStone.prototype = Object.create(DT.Stone.prototype);
    DT.StaticStone.prototype.constructor = DT.StaticStone;

    DT.StaticStone.prototype.update = function (options) {
        if (DT.player.isFun) {
            this.tObject.children[1].material.emissive = new THREE.Color().setRGB(0,1,0);
        } else {
            this.tObject.children[0].material.emissive = new THREE.Color().setRGB(0,0,0);
        }

        this.updateParam('rotation', {x: 0.007, y: 0.007});
        return this;
    };

 // ██████╗ ██████╗ ██╗███╗   ██╗
// ██╔════╝██╔═══██╗██║████╗  ██║
// ██║     ██║   ██║██║██╔██╗ ██║
// ██║     ██║   ██║██║██║╚██╗██║
// ╚██████╗╚██████╔╝██║██║ ╚████║
 // ╚═════╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝
(function () {
    var coin_cap_texture = THREE.ImageUtils.loadTexture('./img/avers.png'),
        r = 0.5, i,
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

    DT.Coin = function (options) {
        var tObject = new THREE.Object3D();

        var coin_sides_mat = new THREE.MeshPhongMaterial({emissive: 0xcfb53b, color: 0xcfb53b}),
            coin_sides = new THREE.Mesh( coin_sides_geo, coin_sides_mat ),
            coin_cap_mat = new THREE.MeshPhongMaterial({emissive: 0xcfb53b, color: 0xcfb53b, map: coin_cap_texture}),
            coin_cap_top = new THREE.Mesh( coin_cap_geo, coin_cap_mat ),
            coin_cap_bottom = new THREE.Mesh( coin_cap_geo, coin_cap_mat );

        coin_cap_top.position.y = 0.05;
        coin_cap_bottom.position.y = -0.05;
        coin_cap_top.rotation.x = Math.PI;
        
        tObject.add(coin_sides);
        tObject.add(coin_cap_top);
        tObject.add(coin_cap_bottom);
        
        DT.GameCollectionObject.apply(this, [{
            tObject: tObject.clone(),
            collection: options.collection
        }]);

        var t = DT.normalizeT(options.t + 0.25 + options.dt);
        var binormal = DT.getBinormalAt(t);
        
        var pos = options.tube.path.getPointAt(t)
            .multiplyScalar(DT.scale)
            .add(binormal.clone().multiplyScalar(options.offset * DT.scale));

        this.tObject.position = pos;
        this.tObject.children.forEach(function (el) {
            el.material.transparent = false;
        });
        this.setParam('rotation', {
            x: 1.5,
            y: 0,
            z: options.zAngle
        }).createAndAdd();
    };
    DT.Coin.prototype = Object.create(DT.GameCollectionObject.prototype);
    DT.Coin.prototype.constructor = DT.Coin;

    DT.Coin.prototype.update = function (options) {
        DT.GameCollectionObject.prototype.update.apply(this, arguments);
        this.updateParam('rotation', {z: 0.05});
        var positon = this.tObject.position;
        var distanceBerweenCenters = positon.distanceTo(options.sphere.position);
        if (distanceBerweenCenters < 0.9) {
            this.removeFromScene();
            if (!DT.game.wasOver) {
                DT.$document.trigger('changeScore', {delta: 0.1});
            }
            DT.$document.trigger('blink', {color: 0xcfb53b, frames: 60});
        }
        return this;
    };
})();

// ██████╗  ██████╗ ███╗   ██╗██╗   ██╗███████╗
// ██╔══██╗██╔═══██╗████╗  ██║██║   ██║██╔════╝
// ██████╔╝██║   ██║██╔██╗ ██║██║   ██║███████╗
// ██╔══██╗██║   ██║██║╚██╗██║██║   ██║╚════██║
// ██████╔╝╚██████╔╝██║ ╚████║╚██████╔╝███████║
// ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚══════╝

    DT.Bonus = function (options) {
        this.type = DT.genRandomFloorBetween(0, 2);
        // this.type = 1;

        var tObject;

        if (this.type === 0 || this.type === 2) {
            var geometry = DT.listOfModels[this.type].object.clone().geometry,
                material = DT.listOfModels[this.type].object.clone().material;

            material.transparent = false;
            material.opacity = 1;

            material.morphTargets = true;

            var mt1 = DT.listOfModels[this.type].object.geometry.vertices.slice(0),
                mt2 = DT.listOfModels[this.type + 3].object.geometry.vertices.slice(0);

            geometry.morphTargets.push({name: 'closed', vertices: mt1});
            geometry.morphTargets.push({name: 'open', vertices: mt2});

            tObject = new THREE.Mesh(geometry, material);
        } else {
            tObject = DT.listOfModels[this.type].object.clone();
            tObject.children.forEach(function (el) {
                el.material.transparent = false;
                el.material.opacity = 1;
            });
        }

        DT.GameCollectionObject.apply(this, [{
            tObject: tObject,
            collection: options.collection
        }]);

        var t = DT.normalizeT(options.t + 0.25),
            binormal = DT.getBinormalAt(t),
            pos = options.tube.path.getPointAt(t)
                .multiplyScalar(DT.scale)
                .add(binormal.clone().multiplyScalar(options.offset * DT.scale));

        this.tObject.position = pos;

        DT.lookAt(t - 0.002, options.tube, this.tObject);

        this.tObject.scale.multiplyScalar(DT.listOfModels[this.type].scale);
        this.createAndAdd();

        this.blink = {
            defColor: new THREE.Color('red'),
            color: new THREE.Color('white'),
            bColor: new THREE.Color(0, 0, 0),
            frames: 0,
            framesLeft: 0,
            doBlink: function (color, frames) {
                var tempColor = new THREE.Color(color).multiplyScalar(-1);
                this.color = new THREE.Color(color);
                this.framesLeft = this.frames = frames;
                this.bColor.addColors(this.defColor, tempColor).multiplyScalar(1/frames);
            },
        };
    };

    DT.Bonus.prototype = Object.create(DT.GameCollectionObject.prototype);
    DT.Bonus.prototype.constructor = DT.Bonus;

    DT.Bonus.prototype.updateBlink = function () {
        // TODO: refactor
        if (this.blink.framesLeft === 0) {
            return this;
        }
        if (this.blink.framesLeft === 1) {
            this.tObject.material.color.copy(this.blink.defColor);
        }
        if (this.blink.framesLeft === this.blink.frames) {
            this.tObject.material.color.copy(this.blink.color);
        }
        if (this.blink.framesLeft < this.blink.frames) {
            this.tObject.material.color.add(this.blink.bColor);
        }
        this.blink.framesLeft -= 1;
        return this;
    };

    DT.Bonus.prototype.update = function (options) {
        var self = this;
        DT.GameCollectionObject.prototype.update.apply(this, arguments);

        if (this.type === 2) {
            if (DT.animate.id % 6 === 0) {
                var color = new THREE.Color().setRGB(
                    DT.genRandomBetween(0, 3),
                    DT.genRandomBetween(0, 3),
                    DT.genRandomBetween(0, 3)
                );
                this.blink.doBlink(color, 10);
            }
            this.updateBlink();
        }

        var dist = this.tObject.position.distanceTo(options.sphere.position);

        if (this.type === 0 && dist < 30) {
            this.tObject.morphTargetInfluences[1] = 5 - dist/6;
        }

        if (this.type === 2 && dist < 30) {
            this.tObject.morphTargetInfluences[1] = 1 - dist/30;
        }

        if (this.type === 0 && dist > 30) {
            var step = 120,
                n = (DT.animate.id % step) / (step - 1);
                n = n > 0.5 ? 2 * (1 - n) : 2 * n;
                
            this.tObject.morphTargetInfluences[0] = n;
            this.tObject.morphTargetInfluences[1] = 1 - n;
        }

        if (dist < 0.9) {
            this.removeFromScene();
            if (!DT.game.wasOver) {
                DT.$document.trigger('catchBonus', {type: self.type});
                DT.$document.trigger('blink', {color: 0xff2222, frames: 60});
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
        this.opacity = 1;
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
            el.removeFromScene();
        });
        return this;
    };

    DT.Collection.prototype.reset = function () {
        this.collection.forEach(function (el) {
            el.scene.remove(el.tObject);
            // el.tObject.children.forEach(function (elt) {
                // if (elt.geometry && elt.geometry.dispose ) elt.geometry.dispose();
                //     if (elt.material && elt.material.dispose ) elt.material.dispose();
                //     if (elt.texture && elt.texture.dispose ) elt.texture.dispose();
            // });
            // if (el.tObject.geometry && el.tObject.geometry.dispose ) el.tObject.geometry.dispose();
            // if (el.tObject.material && el.tObject.material.dispose ) el.tObject.material.dispose();
            // if (el.tObject.texture && el.tObject.texture.dispose ) el.tObject.texture.dispose();
        });
        this.collection.length = 0;
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
            var dist = el.tObject.position.distanceTo(options.position)
            if (dist <= DT.game.param.stonesCloseness) {
                return this;
            }
        }
        var near = 5
        var isCoinsNear = ! new DT.CoinsCollection().collection.every(function (coin) {
                return coin.tObject.position.distanceTo(options.position) > near;
            });
        var isBonusesNear = ! new DT.BonusesCollection().collection.every(function (bonus) {
                return bonus.tObject.position.distanceTo(options.position) > near;
            });

        if (isCoinsNear || isBonusesNear) {
            return this;
        }
        for (var i = 0; i < options.number; i++) {
            new this.constructor(options);
        }
        return this;
    };

    DT.$document.on('update', function (e, data) {
        var t = DT.normalizeT(data.t + 0.08),
            binormal = DT.getBinormalAt(t);

        new DT.StonesCollection()
            .createObjects({
                position: data.tube.path.getPointAt(t)
                    .multiplyScalar(DT.scale)
                    .add(binormal.multiplyScalar(DT.scale * DT.genRandomFloorBetween(-1, 1))),
                t: t,
                sphere: DT.player.sphere,
            })
            .update({
                dieCoord: data.tube.path.getPointAt(DT.normalizeT(data.t - 0.008)).multiplyScalar(DT.scale),
                opacityCoord: data.tube.path.getPointAt(DT.normalizeT(data.t)).multiplyScalar(DT.scale),
                sphere: DT.player.sphere,
                data: data
            });
    });
    DT.$document.on('showFun', function (e, data) {
        if (data.isFun) {
            clearInterval(DT.StonesCollection.transitionInterval);
            DT.StonesCollection.transitionInterval = setInterval(function () {
                new DT.StonesCollection().collection.forEach(function (el) {
                    el.tObject.children[0].material.opacity -= 0.1;
                    el.tObject.children[1].material.opacity += 0.1;
                });
                new DT.StonesCollection().opacity -= 0.1;
                if (new DT.StonesCollection().opacity < 0) {
                    clearInterval(DT.StonesCollection.transitionInterval);
                }
            }, 50);
        } else {
            clearInterval(DT.StonesCollection.transitionInterval);
            DT.StonesCollection.transitionInterval = setInterval(function () {
                new DT.StonesCollection().collection.forEach(function (el) {
                    el.tObject.children[0].material.opacity += 0.1
                    el.tObject.children[1].material.opacity -= 0.1
                });
                new DT.StonesCollection().opacity += 0.1;
                if (new DT.StonesCollection().opacity > 1) {
                    clearInterval(DT.StonesCollection.transitionInterval);
                }
            }, 50);
        }
    });
    DT.$document.on('resetGame', function (e, data) {
        new DT.StonesCollection().reset();
    });

    DT.StaticStonesCollection = function () {
        if (!DT.StaticStonesCollection.__instance) {
            DT.StaticStonesCollection.__instance = this;
        } else {
            return DT.StaticStonesCollection.__instance;
        }
        DT.Collection.apply(this, [{
            constructor: DT.StaticStone
        }]);
    };
    DT.StaticStonesCollection.prototype = Object.create(DT.Collection.prototype);
    DT.StaticStonesCollection.prototype.constructor = DT.StaticStonesCollection;

    DT.StaticStonesCollection.prototype.createObjects = function (options) {
        DT.Collection.prototype.createObjects.apply(this, arguments);
        var el = this.collection[this.collection.length -1];

        if (el) {
            var dist = el.tObject.position.distanceTo(options.position)
            if (dist <= DT.game.param.stonesCloseness) {
                return this;
            }
        }
        var near = 10;
        var isAnotherStoneNear = ! new DT.StaticStonesCollection().collection.every(function (coin) {
                return coin.tObject.position.distanceTo(options.position) > near;
            });

        if (isAnotherStoneNear) {
            return this;
        }
        for (var i = 0; i < options.number; i++) {
            new this.constructor(options);
        }
        return this;
    };

    for (var i = 500; i > 0; i--) {
        new DT.StaticStonesCollection()
            .createObjects({
                position: DT.tube.vertices[DT.genRandomFloorBetween(0, DT.tube.vertices.length-1)].clone().multiplyScalar(DT.scale),
                // t: t,
                sphere: DT.player.sphere,
            });
    }

    DT.$document.on('update', function (e, data) {
        new DT.StaticStonesCollection()
            .update();
    });
    DT.$document.on('showFun', function (e, data) {
        if (data.isFun) {
            clearInterval(DT.StaticStonesCollection.transitionInterval);
            DT.StaticStonesCollection.transitionInterval = setInterval(function () {
                new DT.StaticStonesCollection().collection.forEach(function (el) {
                    el.tObject.children[0].material.opacity -= 0.1;
                    el.tObject.children[1].material.opacity += 0.1;
                });
                new DT.StaticStonesCollection().opacity -= 0.1;
                if (new DT.StaticStonesCollection().opacity < 0) {
                    clearInterval(DT.StaticStonesCollection.transitionInterval);
                }
            }, 50);
        } else {
            clearInterval(DT.StaticStonesCollection.transitionInterval);
            DT.StaticStonesCollection.transitionInterval = setInterval(function () {
                new DT.StaticStonesCollection().collection.forEach(function (el) {
                    el.tObject.children[0].material.opacity += 0.1
                    el.tObject.children[1].material.opacity -= 0.1
                });
                new DT.StaticStonesCollection().opacity += 0.1;
                if (new DT.StaticStonesCollection().opacity > 1) {
                    clearInterval(DT.StaticStonesCollection.transitionInterval);
                }
            }, 50);
        }
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
                options.dt = i * 0.004 ;
                new this.constructor(options);
            }
        }
        return this;
    };
    DT.$document.on('update', function (e, data) {
        new DT.CoinsCollection()
            .createObjects({
                offset: DT.genRandomFloorBetween(-1, 1),
                tube: data.tube,
                t: data.t,
                zAngle: 0,
                number: 10
            })
            .update({
                dieCoord: data.tube.path.getPointAt(DT.normalizeT(data.t - 0.008)).multiplyScalar(DT.scale),
                opacityCoord: data.tube.path.getPointAt(DT.normalizeT(data.t)).multiplyScalar(DT.scale),
                sphere: DT.player.sphere,
                data: data
            });
    });
    DT.$document.on('resetGame', function (e, data) {
        new DT.CoinsCollection().reset()
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
        if (!this.collection.length && DT.animate.id % 900 === 0) {
            for (var i = 0; i < options.number; i++) {
                new this.constructor(options);
            }
        }
        return this;
    };
    DT.BonusesCollection.prototype.useBonuses = function (type) {
        // helth
        if (type === 0) DT.$document.trigger('changeHelth', {delta: 25});
        // invulnerability
        if (type === 1) DT.$document.trigger('makeInvulner', {});
        // entertainment
        if (type === 2) DT.$document.trigger('makeFun', {});
        return this;
    };

    DT.BonusesCollection.prototype.catchBonus = function (type) {
        var self = this;
        if (!this.caughtBonuses.length || this.caughtBonuses[0] === type) {
            this.caughtBonuses.push(type);
            if (this.caughtBonuses.length === 1) {
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
        DT.$document.trigger('showBonuses', {type: type, caughtBonuses: this.caughtBonuses});
        return this;
    };
    DT.BonusesCollection.prototype.reset = function () {
        DT.Collection.prototype.reset.apply(this, arguments);
        this.caughtBonuses.length = 0;
        return this;
    };
    DT.$document.on('update', function (e, data) {
        new DT.BonusesCollection()
            .createObjects({
                offset: DT.genRandomFloorBetween(-1, 1),
                tube: data.tube,
                t: data.t + DT.genRandomBetween(0, 0.1),
            })
            .update({
                dieCoord: data.tube.path.getPointAt(DT.normalizeT(data.t - 0.008)).multiplyScalar(DT.scale),
                opacityCoord: data.tube.path.getPointAt(DT.normalizeT(data.t)).multiplyScalar(DT.scale),
                sphere: DT.player.sphere,
                delta: data.delta * 1000
            });
    });
    DT.$document.on('catchBonus', function (e, data) {
        new DT.BonusesCollection().catchBonus(data.type);
    });
    DT.$document.on('resetGame', function (e, data) {
        new DT.BonusesCollection().reset(); 
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
            0: 43,
            1: 65,
            2: 43,
            3: 75,
        },
        valueAudio: 0,
        sounds: {
            catchCoin: 'sounds/coin.',
            gameover: 'sounds/gameover.',
            pause: 'sounds/pause.',
            stoneDestroy: 'sounds/stoneDestroy.',
            stoneMiss: 'sounds/stoneMiss.',
            catchBonus0: 'sounds/catchBonus0.',
            catchBonus1: 'sounds/catchBonus1.',
            catchBonus2: 'sounds/catchBonus2.',
            muv8: 'sounds/muv8.',
        },
        music: {
            0: 'sounds/main.',
            1: 'sounds/fun.',
            2: 'sounds/intro.',
            3: 'sounds/invulner.',
            started: [],
            paused: []
        }
    };
    DT.audio.reset = function () {
        DT.audio.music.paused.forEach(function (el) {el = false});
        DT.audio.music.started.forEach(function (el) {el = false});
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

    DT.$window.on('focus', function() {
        if (!DT.game.wasMuted) {
            DT.setVolume(1);
        }
    });
    DT.$window.on('blur', function() {
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver) {
            DT.$document.trigger('pauseGame', {});
        }
        DT.setVolume(0);
    });
    DT.$document.on('startGame', function (e, data) {
        DT.stopSound(2);
        DT.playSound(0);
    });
    DT.$document.on('resetGame', function (e, data) {
        DT.audio.reset();
    });
    DT.$document.on('pauseGame', function () {
        DT.stopSoundBeforPause();
        DT.audio.sounds.pause.play();
    });
    DT.$document.on('resumeGame', function (e, data) {
        DT.playSoundAfterPause();
        DT.audio.sounds.pause.play();
    });
    DT.$document.on('gameOver', function (e, data) {
        DT.stopSound(0);
        DT.stopSound(1);
    });
    DT.$document.on('gameOver', function (e, data) {
        if (data.cause === 'death') {
            DT.audio.sounds.gameover.play();
        }
    });
    DT.$document.on('changeScore', function (e, data) {
        DT.audio.sounds.catchCoin.play();
    });

    (function () {
        // MUSIC
        var context,
            counter = 0,
            buffers = [], sources=[], destination, analysers = [],
            freqDomain = [];
        var audio = new Audio();
        var canPlayOgg = !!audio.canPlayType && audio.canPlayType('audio/ogg; codecs=\'vorbis\'') !== '';
        console.info('canPlayOgg', canPlayOgg);
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            context = new AudioContext();
        }
        catch(e) {
            alert('Opps.. Your browser do not support audio API');
        }
        DT.stopSound = function(index){
            if (DT.audio.music.started[index] === true) {
                sources[index].stop(index);
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
                DT.$document.on('update', function (e, data) {
                    visualize(index);
                });
                sources[index].start(index);
                DT.audio.music.started[index] = true;
            }
        };
        DT.stopSoundBeforPause = function() {
            DT.audio.music.started.forEach(function(el, i) {
                DT.audio.music.paused[i] = el;
                DT.stopSound(i);
            });
        };
        DT.playSoundAfterPause = function() {
            DT.audio.music.paused.forEach(function(el, i) {
                if (el) DT.playSound(i);
            });
        };
        var initSound = function(arrayBuffer, bufferIndex) {
            context.decodeAudioData(arrayBuffer, function(decodedArrayBuffer) {
                buffers[bufferIndex] = decodedArrayBuffer;
                console.info('ready sound ' + bufferIndex);
                counter += 1;
                yepnope.showLoading(counter);
            }, function(e) {
                console.warn('Error decoding file', e);
            });
        };
        // SOUNDS
        var ext = canPlayOgg ? 'ogg' : 'mp3';

        function SFX(context, file) {
          var ctx = this;
          var loader = new BufferLoader(context, [file], onLoaded);
        
          function onLoaded(buffers) {
            ctx.buffers = buffers;
          };
        
          loader.load();
        }
        
        SFX.prototype.play = function() {
          var time = context.currentTime;
          // Make multiple sources using the same buffer and play in quick succession.
            var source = this.makeSource(this.buffers[0]);
            source.start(0);
        }
        
        SFX.prototype.makeSource = function(buffer) {
          var source = context.createBufferSource();
          var compressor = context.createDynamicsCompressor();
          var gain = context.createGain();
          gain.gain.value = DT.game.param.globalVolume;
          source.buffer = buffer;
          source.connect(gain);
          gain.connect(compressor);
          compressor.connect(context.destination);
          return source;
        };

        for (var prop in DT.audio.sounds) if (DT.audio.sounds.hasOwnProperty(prop)) {
            DT.audio.sounds[prop] = new SFX(context, DT.audio.sounds[prop] + ext);
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
        for (var i = 0; i < 4; i++) {
            loadSoundFile(DT.audio.music, i);
        }
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
    })();

    DT.$document.on('showBonuses', function (e, data) {
        DT.audio.sounds['catchBonus' + data.type].play();
    });
    DT.$document.on('showFun', function (e, data) {
        if (data.isFun) {
            DT.stopSound(0);
            DT.stopSound(3);
            DT.playSound(1);
        } else {
            DT.stopSound(1);
            DT.stopSound(3);
            DT.playSound(0);
        }
    });
    DT.$document.on('showInvulner', function (e, data) {
        if (DT.player.isFun) return;
        if (data.invulner) {
            DT.stopSound(0);
            DT.stopSound(1);
            DT.playSound(3);
        } else {
            DT.stopSound(3);
            DT.stopSound(1);
            DT.playSound(0);
        }
    });

// ██╗  ██╗███████╗██╗   ██╗██████╗  ██████╗  █████╗ ██████╗ ██████╗ 
// ██║ ██╔╝██╔════╝╚██╗ ██╔╝██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔══██╗
// █████╔╝ █████╗   ╚████╔╝ ██████╔╝██║   ██║███████║██████╔╝██║  ██║
// ██╔═██╗ ██╔══╝    ╚██╔╝  ██╔══██╗██║   ██║██╔══██║██╔══██╗██║  ██║
// ██║  ██╗███████╗   ██║   ██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝
// ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ 

(function () {
    var keydownArrows = function(event) {
        var k = event.keyCode
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver) {
                // arrows control
            if (k === 38) { // up arrow
                //
            }
            if (k === 40) { // down arrow
                // 
            }
            if (k === 37) { // left arrow
                DT.handlers.toTheLeft();
            }
            if (k === 39) { // right arrow
                DT.handlers.toTheRight();
            }
        }
    };
    var keyupHandler = function(event) {
        var k = event.keyCode;
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver) {
            if (k === 16) { //shift
                DT.$document.trigger('changeSpeed', {changer: 0});
            }
        }
    };
    DT.$document.on('startGame', function (e, data) {
        if (data.control === 'keyboard') {
            DT.$document.bind('keydown', keydownArrows);
        }
    });
    DT.$document.on('resetGame', function (e, data) {
        // if (data.cause === 'chooseControl') {
            DT.$document.unbind('keydown', keydownArrows);
        // }
    });
    DT.$document.bind('keydown', function(event) {
        var k = event.keyCode
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver) {
            // speedUp
            if (k === 16) { //shift
                DT.$document.trigger('stopFun', {});
                DT.$document.trigger('changeSpeed', {changer: DT.game.speed.getSpeed0()});
            }
            if (k === 17) {
                DT.$document.trigger('makeFun', {});
            }
        }
    });
    DT.$document.bind('keyup', keyupHandler);
    DT.$document.on('startGame', function (e, data) {
        DT.$document.bind('keyup', DT.handlers.pauseOnSpace);
    });
    DT.$document.on('gameOver', function (e, data) {
        DT.$document.unbind('keyup', DT.handlers.pauseOnSpace);
    });
})();

// ███████╗ ██████╗  ██████╗██╗  ██╗███████╗████████╗
// ██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝
// ███████╗██║   ██║██║     █████╔╝ █████╗     ██║   
// ╚════██║██║   ██║██║     ██╔═██╗ ██╔══╝     ██║   
// ███████║╚██████╔╝╚██████╗██║  ██╗███████╗   ██║   
// ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   

    DT.server = window.location.origin !== 'http://localhost' ? window.location.origin : 'http://192.168.1.44';
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
            // if (socket.gameCode !== gameCode) {
                socket.gameCode = gameCode;
                DT.$document.trigger('socketInitialized', gameCode);
            // }
        });
        // When the user inputs the code into the phone client, we become 'connected'. Start the game.
        socket.on('connected', function(data) {
        });
        // When the phone is turned, change destPoint
        socket.on('turn', function(turn) {
            if (DT.enableMobileSatus === 'enabled' && DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver) {
                if(turn < leftBreakThreshold) {
                    if(turn > leftTurnThreshold) {
                        DT.handlers.center();
                    } else {
                        DT.handlers.left();
                    }
                } else if (turn > rightBreakThreshold) {
                    if(turn < rightTurnThreshold) {
                        DT.handlers.center();
                    } else {
                        DT.handlers.right();
                    }
                } else {
                    DT.handlers.center();
                }
            }
        });
        socket.on('click', function(click) {
            if (DT.enableMobileSatus === 'enabled') DT.handlers[click]();
        });
        socket.on('message', function(data) {
            if (data.type === 'paymentCheck') DT.$document.trigger('paymentCheck', data);
        });
        socket.on('start', function(data) {
            if (!DT.game.wasStarted) {
                DT.$document.trigger('startGame', {control: 'mobile'});
                DT.lastControl = 'mobile';
            }
        });
        DT.$document.on('changeScore', function (e, data) {
            DT.sendSocketMessage({type: 'vibr', time: 10});
        });
        // socket.on('disconnectController', function(data) {
        //     DT.$document.trigger('pauseGame', {});
        // });
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

    DT.$document.on('startGame', function (e, data) {
        DT.sendSocketMessage({type: 'gamestarted'});
    });
    DT.$document.on('startGame', function (e, data) {
        if (data.control === 'mobile') DT.enableMobileSatus = 'enabled';
    });
    DT.$document.on('resetGame', function (e, data) {
        if (data.cause === 'chooseControl') DT.enableMobileSatus = 'disabled';
    });
    DT.$document.on('gameOver', function (e, data) {
        DT.sendSocketMessage({type: 'gameover'});
    });
    DT.$document.on('checkUp', function (e, data) {
        DT.sendSocketMessage({type: 'checkup'});
    });
    DT.$document.on('resetGame', function (e, data) {
        DT.sendSocketMessage({type: 'resetGame'});
    });

// ██╗    ██╗███████╗██████╗  ██████╗ █████╗ ███╗   ███╗
// ██║    ██║██╔════╝██╔══██╗██╔════╝██╔══██╗████╗ ████║
// ██║ █╗ ██║█████╗  ██████╔╝██║     ███████║██╔████╔██║
// ██║███╗██║██╔══╝  ██╔══██╗██║     ██╔══██║██║╚██╔╝██║
// ╚███╔███╔╝███████╗██████╔╝╚██████╗██║  ██║██║ ╚═╝ ██║
 // ╚══╝╚══╝ ╚══════╝╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝
(function () {
    // headtracker realization
    // get video and canvas
    var videoInput = document.getElementById('vid');
    var canvasInput = document.getElementById('compare');
    var canvasOverlay = document.getElementById('overlay')
    // var debugOverlay = document.getElementById('debug');
    var canvasContext = canvasInput.getContext('2d');
    var overlayContext = canvasOverlay.getContext('2d');
    // set mirror view to canvas
    canvasContext.translate(canvasInput.width, 0);
    // overlayContext.translate(canvasOverlay.width, 0);
    canvasContext.scale(-1, 1);
    // overlayContext.scale(1, -1);

    DT.enableWebcam = function () {
        if (DT.enableWebcam.satus === undefined) {
            DT.enableWebcam.satus = 'init';
            $('#compare, #overlay').show();
            // Game config
            var leftBreakThreshold = 60;
            var leftTurnThreshold =  50;
            var rightBreakThreshold =60;
            var rightTurnThreshold = 70;
            
            // Defime lib messages
            var statusMessages = {
                'whitebalance' : 'Checking cam and white balance',
                'detecting' : 'Head detected',
                'hints' : 'Something wrong. Try move your head',
                'redetecting' : 'Head lost, search',
                'lost' : 'Head lost',
                'found' : 'Now turn to start'
            };
            
            var supportMessages = {
                'no getUserMedia' : 'Browser not allowed getUserMedia',
                'no camera' : 'Camera not found'
            };

            var headtrackrStatusHandler = function(event) {
                if (event.status in supportMessages) {
                    console.log(supportMessages[event.status]);
                } else if (event.status in statusMessages) {
                    console.log(statusMessages[event.status]);
                }
                if (event.status === 'camera found') {
                    $('#head').show();
                    $('.webcam_message').html('Tilt your head left and right<br>to steer the sphere');
                }
            };

            DT.$document.on('startGame', function (e, data) {
                // $('#compare, #overlay').hide();
            });

            var facetrackingEventHandler = function( event ) {
                // once we have stable tracking, draw rectangle
                if (event.detection == 'CS' && DT.enableWebcam.satus !== 'disabled' && !DT.game.wasPaused) {
                    // var angle = Number(event.angle *(180/ Math.PI)-90);
                    var x = (event.x/120)*canvasInput.width,
                        y = (event.y/90)*canvasInput.height;
                    var posX = x;
                    // console.log(posX);
                    if(posX < leftBreakThreshold) {
                        if(posX > leftTurnThreshold) {
                            DT.handlers.center();
                        } else {
                            if (!DT.enableWebcam.checkLeft) {
                                DT.enableWebcam.checkLeft = true;
                                $('#left_v_check').show();
                                if (DT.enableWebcam.checkRight) $('.turn_to_start span').html('Now turn to start')
                            }
                            DT.handlers.left();
                        }
                    } else if (posX > rightBreakThreshold) {
                        if(posX < rightTurnThreshold) {
                            DT.handlers.center();
                        } else {
                            if (!DT.enableWebcam.checkRight) {
                                DT.enableWebcam.checkRight = true;
                                $('#right_v_check').show();
                                if (DT.enableWebcam.checkLeft) $('.turn_to_start span').html('Now turn to start')
                            }
                            DT.handlers.right();
                        }
                    } else {
                        DT.handlers.center();
                        if (!DT.game.wasStarted && !DT.enableWebcam.turnToStart && DT.enableWebcam.checkLeft && DT.enableWebcam.checkRight) {
                            DT.enableWebcam.turnToStart = true;
                            DT.enableWebcam.satus = 'enabled';
                            DT.$document.trigger('startGame', {control: 'webcam'});
                            DT.lastControl = 'webcam';
                        }
                    }
                }
            }
            
            document.addEventListener('headtrackrStatus', headtrackrStatusHandler, true);
            
            // Set heastrackr
            DT.htracker = DT.htracker || new headtrackr.Tracker({
                altVideo : {"ogv" : "/media/facekat/nocamfallback.ogv", "mp4" : "/media/facekat/nocamfallback.mp4"},
                smoothing : false,
                fadeVideo : true,
                ui : false
            });
            DT.htracker.init(videoInput, canvasInput);
            DT.htracker.start();


            var drawIdent = function(cContext,x,y) {
            
                // normalise values
                x = (x/120)*canvasInput.width;
                y = (y/90)*canvasInput.height;
            
                // flip horizontally
                // x = canvasInput.width - x;
            
                // clean canvas
                cContext.clearRect(0,0,canvasInput.width,canvasInput.height);
            
                // draw rectangle around canvas
                cContext.strokeRect(0,0,canvasInput.width,canvasInput.height);
            
                // draw marker, from x,y position
                cContext.strokeStyle = "#00CC00";
                cContext.beginPath();
                cContext.moveTo(x-5,y);
                cContext.lineTo(x+5,y);
                cContext.closePath();
                cContext.stroke();
            
                cContext.beginPath();
                cContext.moveTo(x,y-5);
                cContext.lineTo(x,y+5);
                cContext.closePath();
                cContext.stroke();
            };
            
            document.addEventListener("facetrackingEvent", function(e) {
                drawIdent(overlayContext, e.x, e.y);
            }, false);
            
            // document.addEventListener("headtrackingEvent", function(e) {
            //     mouseX = e.x*20;
            //     mouseY = -e.y*20;
            // }, false);

            document.addEventListener("facetrackingEvent", function( event ) {
                // clear canvas
                // overlayContext.clearRect(0,0,320,240);
                // once we have stable tracking, draw rectangle
                if (event.detection == "CS") {
                    overlayContext.translate(event.x, event.y)
                    overlayContext.rotate(event.angle-(Math.PI/2));
                    overlayContext.strokeStyle = "#00CC00";
                    overlayContext.strokeRect((-(event.width/2)) >> 0, (-(event.height/2)) >> 0, event.width, event.height);
                    overlayContext.rotate((Math.PI/2)-event.angle);
                    overlayContext.translate(-event.x, -event.y);
                }
            }, true);
            
            document.addEventListener('facetrackingEvent', facetrackingEventHandler, true);
            DT.$document.on('resetGame', function (e, data) {
                if (data.cause === 'chooseControl') {
                    DT.enableWebcam.satus = 'disabled';
                    DT.htracker.stop();
                    DT.enableWebcam.checkLeft = null;
                    DT.enableWebcam.checkRight = null;
                    DT.enableWebcam.turnToStart = null;
                    $('#left_v_check, #right_v_check').hide();
                }
            });
        } else {
            $('#compare, #overlay').show();
            DT.enableWebcam.satus = 'enabled';
            DT.htracker.start();
        }
    };
})();

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
            if (!DT.game.wasStarted) {
                DT.$document.trigger('startGame', {control: 'keyboard'});
                DT.lastControl = 'keyboard';
            }
        }
    };
    DT.handlers.pauseOnSpace = function(event) {
        var k = event.keyCode;
        if (k === 32) {
            DT.handlers.pause();
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
    DT.handlers.pause = function (isShare) {
        if (!DT.game.wasStarted || DT.game.wasOver) return;
        if (DT.game.wasPaused) {
            DT.$document.trigger('resumeGame', {});
        } else {
            DT.$document.trigger('pauseGame', {isShare: isShare});
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

    DT.handlers.toTheLeft = function () {
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver && DT.player.destPoint.x !== -1) {
            DT.audio.sounds['muv8'].play();
            DT.player.changeDestPoint(new THREE.Vector3(-1, 0, 0));
        }
    };
    DT.handlers.toTheRight = function () {
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver && DT.player.destPoint.x !== 1) {
            DT.audio.sounds['muv8'].play();
            DT.player.changeDestPoint(new THREE.Vector3(1, 0, 0));
        }
    };
    DT.handlers.left = function () {
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver && DT.player.destPoint.x !== -1) {
            DT.audio.sounds['muv8'].play();
            DT.player.destPoint.x = -1;
        }
    };
    DT.handlers.right = function () {
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver && DT.player.destPoint.x !== 1) {
            DT.audio.sounds['muv8'].play();
            DT.player.destPoint.x = 1;
        }
    };
    DT.handlers.center = function () {
        if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver) {
            if (DT.player.destPoint.x === -1) DT.audio.sounds['muv8'].play();
            if (DT.player.destPoint.x === 1) DT.audio.sounds['muv8'].play();
            DT.player.destPoint.x = 0;
        }
    };
    DT.handlers.restart = function () {
        DT.$document.trigger('resetGame', {});
        $('.game_over').fadeOut(250);
        if (!DT.game.wasStarted) DT.$document.trigger('startGame', {control: DT.lastControl});
    };
    DT.handlers.chooseControlAfterGameOver = function () {
        DT.$document.trigger('resetGame', {cause: 'chooseControl'});
        $('.game_over').fadeOut(250);
        DT.$chooseControl.css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 250);
        DT.$document.bind('keyup', DT.handlers.startOnSpace);
    };
    DT.handlers.restartOnSpace = function (event) {
        var k = event.keyCode;
        if (k === 32) {
            DT.handlers.restart();
        }
    };
    DT.handlers.triggerOpacityOnLines = function (hide) {
        if (hide) {
            DT.player.lines.children[0].material.opacity = 0;
            DT.player.lines.children[1].material.opacity = 0;
        } else if (!DT.player.isFun && !DT.player.isInvulnerability) {
            DT.player.lines.children[0].material.opacity = 0.6;
            DT.player.lines.children[1].material.opacity = 0.4;
        }
    };
    DT.handlers.share = function () {
        if (!DT.game.wasStarted || DT.game.wasOver || DT.shared) {
            DT.shared = !DT.shared;
            DT.$share.toggleClass('show-table');
            if ($('.choose_control')[0].style.webkitFilter === 'blur(0px)' || $('.choose_control')[0].style.webkitFilter === '') {
                $('.choose_control, .game_over, #interface').css({webkitFilter:'blur(10px)'});
                $(DT.renderer.domElement).css({webkitFilter:'blur(10px)'});
                if (DT.$share[0].style.webkitFilter !== undefined) {
                    DT.$share.css({'background-color': 'transparent'});
                }
            } else {
                $('.choose_control, .game_over, #interface').css({webkitFilter:'blur(0px)'});
                $(DT.renderer.domElement).css({webkitFilter:'blur(0px)'});
            }
        }
    };
    DT.$document.on('startGame', function (e, data) {
        if (DT.shared) DT.handlers.share();
    });
    DT.$document.on('resetGame', function (e, data) {
        if (DT.shared) DT.handlers.share();
    });

// ██╗███╗   ██╗████████╗███████╗██████╗ ███████╗ █████╗  ██████╗███████╗
// ██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝
// ██║██╔██╗ ██║   ██║   █████╗  ██████╔╝█████╗  ███████║██║     █████╗  
// ██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██╔══╝  ██╔══██║██║     ██╔══╝  
// ██║██║ ╚████║   ██║   ███████╗██║  ██║██║     ██║  ██║╚██████╗███████╗
// ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝
(function () {
    DT.runApp = function () {
        DT.initSocket();
        if (!document.hasFocus()) {
            DT.setVolume(0);
        } else {
            DT.setVolume(1);
        }
        DT.playSound(2);
        $(function() {
            $('#loader').hide();
            $('#interface').show();
            $('#footer').show();
            DT.$chooseControl.css({'display': 'table', 'opacity': '1'});
            DT.$document.bind('keyup', DT.handlers.startOnSpace);
            $('.choose_wasd').click(function() {
                if (!DT.game.wasStarted) {
                    DT.$document.trigger('startGame', {control: 'keyboard'});
                    DT.lastControl = 'keyboard';
                }
            });
            $('.choose_mobile').click(function() {
                DT.$chooseControl.hide();
                DT.$document.unbind('keyup', DT.handlers.startOnSpace);
                $('.mobile_choosen').css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 250);
            });
            $('.choose_webcam').click(function() {
                DT.$chooseControl.hide();
                DT.$document.unbind('keyup', DT.handlers.startOnSpace);
                $('.webcam_choosen').css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 250);
                DT.enableWebcam();
            });
        });
    };
    $('.pause .resume').click(function() {
        DT.$document.trigger('resumeGame', {});
    });
    $('.share .resume').click(function() {
        DT.handlers.share();
    });
    $('.change_controls.pause_control').click(function() {
        DT.$document.trigger('gameOver', {cause: 'reset'});
        DT.$document.trigger('resetGame', {cause: 'chooseControl'});
        DT.$pause.fadeOut(250);
        DT.$chooseControl.css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 250);
        DT.$document.bind('keyup', DT.handlers.startOnSpace); 
    });
    $('.change_controls.webcam_control').click(function() {
        DT.$document.trigger('resetGame', {cause: 'chooseControl'});
        $('.webcam_choosen').fadeOut(250);
        $('#compare, #overlay').hide();
        DT.$chooseControl.css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 250);
        DT.$document.bind('keyup', DT.handlers.startOnSpace);
    });
    $('.change_controls.mobile_control').click(function() {
        DT.$document.trigger('resetGame', {cause: 'chooseControl'});
        $('.mobile_choosen').fadeOut(250);
        DT.$chooseControl.css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 250);
        DT.$document.bind('keyup', DT.handlers.startOnSpace);
    });
    $('#wow').on('click', function () {
        var inputDogeCoin = $('#dogecoin');
        if (inputDogeCoin.val() === '') {
            $('#gameovermessage').html('type your dogecoin id');
        } else {
            $('#gameovermessage').html('checking...');
            $('#wow').unbind('click');
            $('#wow').on('click', function () {
                $('#gameovermessage').html('you have already sent a request ');
            })
            DT.$document.trigger('checkUp', {});
        }
    });
    $('#dogecoin').on('keyup', function (e) {
        e.stopPropagation();
    });
    $('#share-link').on('click', function (e) {
        e.preventDefault()
        DT.handlers.pause(true);
        DT.handlers.share();
    });
    DT.$document.keyup(function(event) {
        var k = event.keyCode;
        if (k === 77) {
            DT.handlers.mute();
        }
    });
    DT.$document.keyup(function(event) {
        var k = event.keyCode;
        if (k === 70) {
            DT.handlers.fullscreen();
        }
    });
    DT.$document.on('hit', function (e, data) {
        $('.error').html('ERROR ' + DT.genRandomFloorBetween(500, 511));
        $('.hit').css({'display': 'table'}).fadeOut(250);
    });
    DT.$document.on('startGame', function (e, data) {
        DT.$chooseControl.fadeOut(250);
        $('.mobile_choosen').fadeOut(250);
        $('.webcam_choosen').fadeOut(250);
        DT.$document.unbind('keyup', DT.handlers.startOnSpace);
    });
    DT.$document.on('socketInitialized', function (e, gameCode) {
        var address = DT.server + '/m/#' + gameCode;
        $('.mobile_message span').html(address);
        $('#qrcode').html('').qrcode(address);
    });
    DT.$document.on('pauseGame', function (e, data) {
        if (data.isShare) {
            DT.$pause.find('.social').show();
            DT.$pause.find('.change_controls').hide();
        } else {
            DT.$pause.find('.social').hide();
            DT.$pause.find('.change_controls').show();
        }
        DT.$pause.css({'display': 'table'});
        $(DT.renderer.domElement).css({webkitFilter:'blur(10px)'});
        if (DT.$pause[0].style.webkitFilter !== undefined) {
            DT.$pause.css({'background-color': 'transparent'});
        }
    });
    DT.$document.on('resumeGame', function (e, data) {
        DT.$pause.css({'display': 'none'});
        $(DT.renderer.domElement).css({webkitFilter:'blur(0px)'});
    });
    DT.$document.on('showScore', function (e, data) {
        $('.current_coins').text(data.score);
    });
    // DT.$document.on('showBonuses', function (e, data) {
    //     $('.bonus').text(data.caughtBonuses.join(' '));
    //     if (data.caughtBonuses.length === 1) {
    //         $('.bonus').fadeOut(300, function(){
    //             $('.bonus').text('').fadeIn(100);
    //         });
    //     }
    // });
    DT.$document.on('gameOver', function (e, data) {
        if (data.cause === 'death') {
            $('.total_coins').text(Math.round(DT.player.currentScore));
            $('.game_over').css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 250);
        }
    });
    DT.$document.on('resetGame', function (e, data) {
        $('canvas').css({webkitFilter:'blur(0px)'});
        $('.current_coins').html('0');
        DT.$title.html('digital trip');

        DT.$document.unbind('keyup', DT.handlers.restartOnSpace);
        $('.restart').unbind('click', DT.handlers.restart);
        $('.change_controls.gameover_control').unbind('click', DT.handlers.chooseControlAfterGameOver);
    });
    DT.$document.on('resetGame', function (e, data) {
        if (data.cause === 'chooseControl') {
            $('#compare, #overlay').hide();
        }
    });
    DT.$document.on('paymentCheck', function (e, data) {
        var text = data.checkup ? 'success' : 'fail';
        $('#gameovermessage').html(text);
    });
})();
// ███████╗████████╗ █████╗ ████████╗███████╗
// ██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝
// ███████╗   ██║   ███████║   ██║   ███████╗
// ╚════██║   ██║   ██╔══██║   ██║   ╚════██║
// ███████║   ██║   ██║  ██║   ██║   ███████║
// ╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝

    // DT.setStats = function () {
    //     var body = document.getElementsByTagName('body')[0];
    //     DT.stats = DT.stats|| new Stats();
    //     DT.stats.domElement.style.position = 'absolute';
    //     DT.stats.domElement.style.top = '0px';
    //     DT.stats.domElement.style.left = '0px';
    //     DT.stats.domElement.style.zIndex = 100;
    //     body.appendChild( DT.stats.domElement );
    //     DT.stats2 = DT.stats2 || new Stats();
    //     DT.stats2.setMode(1);
    //     DT.stats2.domElement.style.position = 'absolute';
    //     DT.stats2.domElement.style.top = '0px';
    //     DT.stats2.domElement.style.left = '80px';
    //     DT.stats2.domElement.style.zIndex = 100;
    //     body.appendChild( DT.stats2.domElement );

    //     DT.rendererStats  = new THREEx.RendererStats();
    //     DT.rendererStats.domElement.style.position = 'absolute';
    //     DT.rendererStats.domElement.style.left = '0px';
    //     DT.rendererStats.domElement.style.top = '50px';
    //     DT.rendererStats.domElement.style.zIndex = 100;
    //     DT.rendererStats.domElement.style.width = '90px';
    //     body.appendChild(DT.rendererStats.domElement);
    // };
    // DT.setStats();
    // DT.$document.on('update', function (e, data) {
    //     DT.stats.update();
    //     DT.stats2.update();
    //     DT.rendererStats.update(DT.renderer);
    // }); 

// ████████╗██╗  ██╗███████╗    ███████╗███╗   ██╗██████╗ 
// ╚══██╔══╝██║  ██║██╔════╝    ██╔════╝████╗  ██║██╔══██╗
   // ██║   ███████║█████╗      █████╗  ██╔██╗ ██║██║  ██║
   // ██║   ██╔══██║██╔══╝      ██╔══╝  ██║╚██╗██║██║  ██║
   // ██║   ██║  ██║███████╗    ███████╗██║ ╚████║██████╔╝
   // ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚══════╝╚═╝  ╚═══╝╚═════╝ 

    return DT;
}(this, this.document));