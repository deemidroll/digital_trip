// ██████╗ ██╗ ██████╗ ██╗████████╗ █████╗ ██╗         ████████╗██████╗ ██╗██████╗ 
// ██╔══██╗██║██╔════╝ ██║╚══██╔══╝██╔══██╗██║         ╚══██╔══╝██╔══██╗██║██╔══██╗
// ██║  ██║██║██║  ███╗██║   ██║   ███████║██║            ██║   ██████╔╝██║██████╔╝
// ██║  ██║██║██║   ██║██║   ██║   ██╔══██║██║            ██║   ██╔══██╗██║██╔═══╝ 
// ██████╔╝██║╚██████╔╝██║   ██║   ██║  ██║███████╗       ██║   ██║  ██║██║██║     
// ╚═════╝ ╚═╝ ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝       ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝     

var DT = (function () {
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

    DT.gameOverTime = 3000;
    DT.scale = 3;
    DT.$document = $(document);
    DT.$window = $(window);

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
    DT.normalizeT = function (t) {
        t = t % 1;
        t < 0 ? 1 - t : t;
        return t;
    };
    DT.getNormalAt = function (t, tube) {
        tube = tube || DT.tube;
        var normal = new THREE.Vector3(),
            segments = tube.tangents.length,
            pickt = t * segments,
            pick = Math.floor( pickt ),
            pickNext = ( pick + 1 ) % segments;

        tube = tube || DT.tube;

        normal.subVectors( tube.normals[ pickNext ], tube.normals[ pick ] );
        normal.multiplyScalar( pickt - pick ).add( tube.normals[ pick ] );
        return normal;
    };
    DT.getBinormalAt = function (t, tube) {
        tube = tube || DT.tube;
        var binormal = new THREE.Vector3(),
            segments = tube.tangents.length,
            pickt = t * segments,
            pick = Math.floor( pickt ),
            pickNext = ( pick + 1 ) % segments;

        tube = tube || DT.tube;

        binormal.subVectors( tube.binormals[ pickNext ], tube.binormals[ pick ] );
        binormal.multiplyScalar( pickt - pick ).add( tube.binormals[ pick ] );
        return binormal;
    };
    DT.animate = function (nowMsec) {
        nowMsec = nowMsec || Date.now();
        DT.animate.lastTimeMsec = DT.animate.lastTimeMsec || nowMsec - 1000 / 60;
        var deltaMsec = Math.min(100, nowMsec - DT.animate.lastTimeMsec);
        // keep looping
        DT.animate.id = requestAnimFrame(DT.animate);
        // change last time
        DT.animate.lastTimeMsec = nowMsec;
        DT.animate.timeElapsed = DT.animate.timeElapsed || 0;
        DT.animate.timeElapsed += deltaMsec;
        // call each update function
        DT.$document.trigger('updatePath', {
            delta: deltaMsec / 1000,
            now: nowMsec / 1000,
            timeElapsed: DT.animate.timeElapsed / 1000
        });
    };
    DT.$document.on('startGame', function (e, data) {
        DT.animate.id = requestAnimFrame(DT.animate);
    });
    DT.$document.on('resetGame', function (e, data) {
        DT.animate.id = requestAnimFrame(DT.animate);
    });
    DT.$document.on('pauseGame', function () {
        cancelAnimFrame(DT.animate.id);
    });
    DT.$document.on('resumeGame', function (e, data) {
        DT.animate.id = requestAnimFrame(DT.animate);
    });
    DT.$document.on('gameOver', function (e, data) {
        setTimeout(function() {
            cancelAnimFrame(DT.animate.id);
        }, DT.gameOverTime);
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
    document.body.appendChild(DT.renderer.domElement);

    DT.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 1000);
    DT.camera.position.set(0, 0.5, 200);
    // DT.camera.position.z = DT.camera.z = 15;
    // DT.camera.lens = DT.camera.lenz = 35;

    // when resize
    new THREEx.WindowResize(DT.renderer, DT.camera);

    DT.scene = new THREE.Scene();
    // DT.$document.on('update', function (e, data) {
    //     DT.renderer.render(DT.scene, DT.camera);
    // });

    // DT.$document.on('changeSpeed', function (e, data) {
    //     DT.camera.lensDistortion = data.changer;
    // });
    // // TODO: refactor
    // DT.$document.on('update', function (e, data) {
    //     var camOffset = 6, camDelta = 0.1,
    //         lenOffset = 18, lenDelta = 0.3;
    //     if (DT.camera.lensDistortion > 0) {
    //         DT.camera.position.z = Math.max(DT.camera.position.z -= camDelta, DT.camera.z - camOffset);
    //         DT.camera.lens = Math.max(DT.camera.lens -= lenDelta, DT.camera.lenz - lenOffset);
    //     } else if (DT.camera.lensDistortion < 0) {
    //         DT.camera.position.z = Math.min(DT.camera.position.z += camDelta, DT.camera.z + camOffset);
    //         DT.camera.lens = Math.min(DT.camera.lens += lenDelta, DT.camera.lenz + lenOffset);
    //     } else {
    //         var delta = DT.camera.lenz - DT.camera.lens;
    //         if (delta < 0) {
    //             DT.camera.position.z = Math.max(DT.camera.position.z -= camDelta, DT.camera.z);
    //             DT.camera.lens = Math.max(DT.camera.lens -= lenDelta, DT.camera.lenz);
    //         } else {
    //             DT.camera.position.z = Math.min(DT.camera.position.z += camDelta, DT.camera.z);
    //             DT.camera.lens = Math.min(DT.camera.lens += lenDelta, DT.camera.lenz);
    //         }
    //     }
    //     DT.camera.setLens(DT.camera.lens);
    // });



    // PATH
    var parent = new THREE.Object3D();
    DT.scene.add(parent);
    DT.splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
    parent.add(DT.splineCamera);
    // var extrudePath = new THREE.Curves.GrannyKnot(); 
    // var extrudePath = new THREE.Curves.HeartCurve();
    // var extrudePath = new THREE.Curves.KnotCurve();
    // var extrudePath = new THREE.Curves.TrefoilKnot();
    var extrudePath = new THREE.Curves.TorusKnot();
    // var extrudePath = new THREE.Curves.CinquefoilKnot();
    // var extrudePath = new THREE.Curves.DecoratedTorusKnot4a();
    // var extrudePath = new THREE.Curves.DecoratedTorusKnot4b();
    // var extrudePath = new THREE.Curves.DecoratedTorusKnot5a();
    // var extrudePath = new THREE.Curves.DecoratedTorusKnot5c();
    var tube = new THREE.TubeGeometry(extrudePath, 100, 3, 8, true, true);

    DT.tube = tube;

    var tubeMesh = THREE.SceneUtils.createMultiMaterialObject( tube, [
                new THREE.MeshLambertMaterial({
                    // color: 0xffffff,
                    opacity: 0,
                    transparent: true
                }),
                new THREE.MeshBasicMaterial({
                    // color: 0x000000,
                    opacity: 0,
                    // wireframe: true,  
                    transparent: true
            })]);
    parent.add(tubeMesh);
    tubeMesh.scale.set( DT.scale, DT.scale, DT.scale );

    var binormal = new THREE.Vector3();
    var normal = new THREE.Vector3();
    var targetRotation = 0;

    DT.cam = 0;

    DT.$document.on('updatePath', function (e, data) {
        if (DT.cam === 0) DT.renderer.render(DT.scene, DT.splineCamera);
        if (DT.cam === 1) DT.renderer.render(DT.scene, DT.camera)
        var time = data.timeElapsed,
            looptime = 60, // related to speed
            t = ( time % looptime ) / looptime,
            pos = tube.path.getPointAt( t );
        
        pos.multiplyScalar(DT.scale);

        // interpolation
        var segments = tube.tangents.length,
            pickt = t * segments,
            pick = Math.floor( pickt ),
            pickNext = ( pick + 1 ) % segments;

        binormal.subVectors( tube.binormals[ pickNext ], tube.binormals[ pick ] );
        binormal.multiplyScalar( pickt - pick ).add( tube.binormals[ pick ] );

        var dir = tube.path.getTangentAt( t ),
            offset = 0;

        normal.copy( binormal ).cross( dir );

        DT.splineCamera.position = pos;

        // Camera Orientation 1 - default look at
        // DT.splineCamera.lookAt( lookAt );

        // Using arclength for stablization in look ahead.
        var lookAt = tube.path.getPointAt( ( t + 30 / tube.path.getLength() ) % 1 ).multiplyScalar(DT.scale);

        // Camera Orientation 2 - up orientation via normal
        // if (!lookAhead)
        lookAt.copy( pos ).add( dir );
        DT.splineCamera.matrix.lookAt(DT.splineCamera.position, lookAt, normal);
        DT.splineCamera.rotation.setFromRotationMatrix( DT.splineCamera.matrix, DT.splineCamera.rotation.order );

        parent.rotation.y += ( targetRotation - parent.rotation.y ) * 0.05;

        data.tube = tube;
        data.t = t;
        data.normal = normal;
        data.binormal = binormal;
        
        DT.$document.trigger('update', data);
    });

    DT.$document.on('keyup', function (e, data) {
        if (e.which == 67) DT.cam = DT.cam > 0 ? 0 : DT.cam + 1;
    });


    // LIGHTS
    DT.lights = {
        light: new THREE.PointLight(0xffffff, 0.75, 100),
        directionalLight: new THREE.DirectionalLight(0xffffff, 0.5)
    };
    DT.scene.add(DT.lights.light);
    DT.scene.add(DT.lights.directionalLight);

    DT.$document.on('update', function (e, data) {
        var posLight = data.tube.path.getPointAt(data.t - 0.005);
        posLight.multiplyScalar(DT.scale);
        DT.lights.light.position = posLight;

        var posDirectLight = data.tube.path.getPointAt(data.t + 0.006);
        posDirectLight.multiplyScalar(DT.scale);
        DT.lights.directionalLight.position = posDirectLight;  
    });

    // BACKGROUND
    var mult = 40,
        far = 500,
        pi_2 = Math.PI/2;
    DT.backgroundMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(44 * mult / 5, 22 * mult / 5, 0),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/bg3.jpg')
        })
    );

    // DT.backgroundMesh.material.depthTest = false;  
    // DT.backgroundMesh.material.depthWrite = false;
    // DT.backgroundMesh.visible = false;
    DT.backgroundMesh.position.set(far, 0, 0);
    DT.backgroundMesh.rotation.set(0, -pi_2, pi_2);
    DT.scene.add(DT.backgroundMesh);

    DT.backgroundMesh1 = new THREE.Mesh(
        new THREE.PlaneGeometry(1366, 768, 0),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/bg1.jpg')
        })
    );
    DT.backgroundMesh1.position.set(-100, 0, 0);
    DT.backgroundMesh1.rotation.set(0, pi_2, pi_2);
    DT.scene.add(DT.backgroundMesh1);

    // EFFECT
    DT.effectComposer = new THREE.EffectComposer( DT.renderer );
    DT.effectComposer.addPass( new THREE.RenderPass( DT.scene, DT.splineCamera ) );
    DT.effectComposer.on = false;

    // var effectRBGShifter = new THREE.ShaderPass( THREE.RGBShiftShader );
    // effectRBGShifter.uniforms[ 'amount' ].value = 0.005;
    // effectRBGShifter.renderToScreen = true;
    // DT.effectComposer.addPass( effectRBGShifter );

    // var effectDotScreenShader = new THREE.ShaderPass( THREE.DotScreenShader );
    // effectDotScreenShader.uniforms[ 'scale' ].value = 4;
    // effectDotScreenShader.renderToScreen = true;
    // DT.effectComposer.addPass( effectDotScreenShader );

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
                badTVParams.distortion+=0.1;
                badTVParams.distortion2+=0.1;
                badTVParams.speed+=0.1;
                badTVParams.rollSpeed+=0.1;
        };
    });
    DT.$document.on('gameOver', function (e, data) {
        DT.effectComposer.on = true;
        DT.effectComposer.timeOut = setTimeout(function () {
            DT.effectComposer.on = false;
            badTVParams = {
                distortion: 3.0,
                distortion2: 1.0,
                speed: 0.3,
                rollSpeed: 0.1
            }
        }, DT.gameOverTime);
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
            name: 'bonusH',
            scale: {x: 0.02, y: 0.02, z: 0.02},
            rotation: {x: Math.PI / 1.3, y: -Math.PI / 1.3, z: -Math.PI / 1.3}
        }, {
            name: 'bonusI',
            scale: {x: 0.5, y: 0.5, z: 0.5},
            rotation: {x: Math.PI / 1.3, y: -Math.PI / 1.3, z: -Math.PI / 1.3}
        }, {
            name: 'bonusE',
            scale: {x: 0.025, y: 0.025, z: 0.025},
            rotation: {x: 0, y: 0, z: 0}
            // rotation: {x: Math.PI/2, y: -Math.PI/8, z: Math.PI/2}
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
                modelObj.material = new THREE.MeshLambertMaterial({ color: 0x606060, morphTargets: true });
                modelObj.material.emissive.copy(modelObj.material.color);
                modelObj.material.emissive.multiplyScalar(0.5);
            } else {
                modelObj.material = new THREE.MeshFaceMaterial(materials);
                modelObj.material.materials.forEach(function (el) {
                    el.emissive.copy(el.color);
                    el.emissive.multiplyScalar(0.5);
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
        this.timer = 0;
        this.speed.value = 36;
        this.wasOver = false;
    };
    DT.Game.prototype.gameOver = function() {
        this.wasOver = true;
    };

    DT.game = new DT.Game();

    DT.$document.on('startGame', function (e, data) {
        DT.game.startGame();
    });
    DT.$document.on('pauseGame', function () {
        DT.game.wasPaused = true;
    });
    DT.$document.on('resumeGame', function (e, data) {
        DT.game.wasPaused = false;
        DT.game.startGame();
    });
    DT.$document.on('update', function (e, data) {
        DT.game.update();
    });
    DT.$document.on('changeSpeed', function (e, data) {
        DT.game.speed.setChanger(data.changer);
    });
    DT.$document.on('gameOver', function (e, data) {
        DT.game.gameOver();
    });
    DT.$document.on('resetGame', function (e, data) {
        DT.game.reset();
        DT.game.startGame();
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
        // this.sphere.position.set(0, -2.5, 0);
        this.sphere.position = this.position;

        this.light = new THREE.PointLight(0xff0000, 1.75, 15);
        this.light.position = this.position;
        this.light.color = this.sphere.material.color;
        this.scene.add(this.light);
        // this.scene.add(this.sphere);

        this.firstMove = true;
        this.moveIterator = 0;

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
                    // particleSystem.position = self.position;
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
                if (helth < 0) {
                    helth = 0;
                    DT.$document.trigger('gameOver', {});
                }
                if (helth > 100) {
                    helth = 100;
                }
            }
            this.currentHelth = helth;
            DT.$document.trigger('showHelth', {helth: this.currentHelth});
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
        this.invulnerTimer = 0;
        this.isInvulnerability = false;
        DT.$document.trigger('showInvulner', {invulner: false});
        return this;
    };

    DT.Player.prototype.changeScore = function(delta) {
        this.currentScore += delta;
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
        var pos = data.tube.path.getPointAt(data.t + 0.004);
        var posPlayer = pos.clone().multiplyScalar(DT.scale);
        data.normalPos = posPlayer.clone();

        posPlayer.add(binormal.multiplyScalar(DT.scale * this.destPoint.x));
        data.actualPos = posPlayer.clone();

        this.updateInvulnerability();
        this.updateFun();
        this.updateBlink();

        this.moveSphere(data);

        this.particleSystem.position.copy(this.position);

        // visualize audio
        var dt = DT.audio.valueAudio/10,
            posVel = data.tube.path.getTangentAt(data.t).negate().multiplyScalar(DT.scale).setLength(3 + dt);

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
        // scene: parent
    });
    DT.$document.on('update', function (e, data) {
        DT.player.update(data);
    });
    DT.$document.on('makeFun', function (e, data) {
        DT.player.makeFun();
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
        // clearTimeout(DT.player.isFun);
        DT.player.stopFun();
    });
    DT.$document.on('resetGame', function (e, data) {
        DT.player.reset();
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
        if (this.tObject.position.distanceTo(options.dieCoord) < 10) {
            this.removeFromScene();
        } 
        var dist = this.tObject.position.distanceTo(options.opacityCoord),
            far = 15;
        if (dist < far && this.dontMakeTransparent == undefined) {
            var opacity = dist / far;
            if (this.tObject.children.length > 0) {
                this.tObject.children.forEach(function (el) {
                    el.material.transparent = true;
                    el.material.opacity = opacity;
                });
            } else {
                this.tObject.material = new THREE.MeshLambertMaterial({
                     shading: THREE.FlatShading,
                     transparent: true,
                     opacity: opacity
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
        this.material.color = options.player.sphere.material.color;
        this.tObject.position = options.player.position;
        this.player = options.player
    };
    DT.Shield.prototype = Object.create(DT.GameObject.prototype);
    DT.Shield.prototype.constructor = DT.Shield;

    DT.Shield.prototype.update = function () {
        this.tObject.position = this.player.position;
    };

    DT.shield = new DT.Shield({
        THREEConstructor: THREE.Mesh,
        geometry: new THREE.CubeGeometry(1.3, 1.3, 1.3, 2, 2, 2),
        material: new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        }),
        player: DT.player
    });

    DT.$document.on('update', function (e, data) {
        DT.shield.update();
    });

    DT.$document.on('showInvulner', function (e, data) {
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
        this.number = options.number || 5000;
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
        // var N = tube.vertices.length;
        // for (var i = 0; i < N; i += 10) {
        //     this.geometry.vertices.push(tube.vertices[i].clone().multiplyScalar(DT.scale));
        // }
        // this.material.visible = false;
        return this;
    };

    DT.Dust.prototype.updateMaterial = function (options) {
        // if (!this.material.visible) {
        //     this.material.visible = true;
        // }
        this.material.color = options.isFun ? options.color : 
        new THREE.Color().setRGB(
            options.valueAudio/1/1 || 70/255,
            options.valueAudio/255/1 || 68/255,
            options.valueAudio/255/1 || 81/255
        );
        return this;
    };

    DT.Dust.prototype.updateGeometry = function (options) {
        // this.geometry.vertices.forEach(function (el) {
        //     el.z += options.speed;
        //     if (el.z > 10) {
        //         el.x = DT.genRandomBetween(-10, 10);
        //         el.y = DT.genRandomBetween(-10, 10);
        //         el.z = -100;
        //     }
        // });
        // this.geometry.verticesNeedUpdate = true;
        return this;
    };
    // Dust object 
    DT.dust = new DT.Dust({
        geometry: new THREE.Geometry({}),
        material: new THREE.ParticleSystemMaterial({size: 0.25}),
        THREEConstructor: THREE.ParticleSystem
    });
    DT.$document.on('update', function (e, data) {
        DT.dust.update({
            material: {
                isFun: DT.player.isFun,
                valueAudio: DT.audio.valueAudio,
                color: DT.player.sphere.material.color
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
        var radius, color, depth, geometry, material;

        radius = DT.genRandomBetween(1, 2);
        depth = DT.genRandomFloorBetween(80, 100) / 255;
        color = new THREE.Color().setRGB(depth, depth, depth);
        
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
        this.t = options.t;
        this.tObject.position = options.position;
        this.setParam('rotation', {
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

            DT.$document.trigger('changeHelth', {delta: -19});
            DT.$document.trigger('bump', {});
            // вызвать вспышку экрана
            if (DT.player.isInvulnerability === false) {
                DT.hit();
            }
        }
        if (this.distanceToSphere > this.minDistance && this.distanceToSphere < this.minDistance + 1) {
            DT.audio.sounds.stoneMiss.play();
        }

        var binormal = DT.getBinormalAt(this.t),
            estimatedPlayerPosition = options.data.tube.path.getPointAt(this.t)
                .multiplyScalar(DT.scale)
                .add(binormal.multiplyScalar(DT.scale * DT.player.destPoint.x));

        if (el.position.distanceTo(estimatedPlayerPosition) < this.minDistance) {
            if (DT.player.isFun) {
                el.material.emissive = new THREE.Color().setRGB(1,0,0);
                el.material.wireframe = true;
            } else {
                el.material.emissive = new THREE.Color().setRGB(0.5,0,0);
                el.material.wireframe = false;
            }
        } else {
            if (DT.player.isFun) {
                el.material.emissive = new THREE.Color().setRGB(0,1,0);
                el.material.wireframe = true;
            } else {
                el.material.emissive = new THREE.Color().setRGB(0,0,0);
                el.material.wireframe = false;
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
            this.tObject.material.emissive = new THREE.Color().setRGB(0,1,0);
            this.tObject.material.wireframe = true;
        } else {
            this.tObject.material.emissive = new THREE.Color().setRGB(0,0,0);
            this.tObject.material.wireframe = false;
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
        
        var coin_cap_texture = DT.Coin.texture,
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

        var t = DT.normalizeT(options.t + 0.25 + options.dt);
        var binormal = DT.getBinormalAt(t);
        
        var pos = options.tube.path.getPointAt(t)
            .multiplyScalar(DT.scale)
            .add(binormal.clone().multiplyScalar(options.offset * DT.scale));

        this.tObject.position = pos;

        this.setParam('rotation', {
            x: 1.5,
            y: 0,
            z: options.zAngle
        })
            .createAndAdd();
    };
    DT.Coin.prototype = Object.create(DT.GameCollectionObject.prototype);
    DT.Coin.prototype.constructor = DT.Coin;

    DT.Coin.texture = THREE.ImageUtils.loadTexture('./img/avers.png')

    DT.Coin.prototype.update = function (options) {
        DT.GameCollectionObject.prototype.update.apply(this, arguments);
        this.updateParam('rotation', {z: 0.05});
        var positon = this.tObject.position;
        var distanceBerweenCenters = positon.distanceTo(options.sphere.position);
        if (distanceBerweenCenters < 0.9) {
            this.removeFromScene();
            DT.$document.trigger('changeScore', {delta: 1});
            DT.audio.sounds.catchCoin.play();
            DT.sendSocketMessage({
                type: 'vibr',
                time: 10
            });
            DT.$document.trigger('blink', {color: 0xcfb53b, frames: 60});
            // DT.player.bump();
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

        var t = DT.normalizeT(options.t + 0.25),
            binormal = DT.getBinormalAt(t),
            pos = options.tube.path.getPointAt(t)
                .multiplyScalar(DT.scale)
                .add(binormal.clone().multiplyScalar(options.offset * DT.scale));

        this.tObject.position = pos;

        var tLook = DT.normalizeT(t - 0.002),
            normalLook = DT.getNormalAt(tLook),
            binormalLook = DT.getBinormalAt(tLook),
            vectorLook = options.tube.path.getTangentAt(tLook).negate()
                .multiplyScalar(DT.scale)
                .add(this.tObject.position);

        var m1 = new THREE.Matrix4().copy( this.tObject.matrix );
        m1.lookAt( vectorLook, this.tObject.position, normalLook );  
        this.tObject.rotation.setFromRotationMatrix( m1 );

        this.dontMakeTransparent = true;

        this.setParam('scale', {
                x: DT.listOfModels[this.type].scale.x || 1,
                y: DT.listOfModels[this.type].scale.y || 1,
                z: DT.listOfModels[this.type].scale.z || 1
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
        DT.GameCollectionObject.prototype.update.apply(this, arguments);
        if (this.type === 0) {
            this.updateParam('rotation', {z: 0.05});
        }
        if (this.type === 1) {
            this.updateParam('rotation', {z: 0.05});
        }
        if (this.type === 2) {
            // this.updateParam('rotation', {z: 0.05});
        }
        // if (this.animation) {
        //     this.animation.update(options.delta);
        // }

        var dist = this.tObject.position.distanceTo(options.sphere.position);

        if (dist < 30.0) {
            if (this.animation) {
                this.animation.update(options.delta);
            }
        }

        if (dist < 0.9) {
            this.removeFromScene();
            DT.$document.trigger('catchBonus', {type: self.type});
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
            el.removeFromScene();
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
                opacityCoord: data.tube.path.getPointAt(DT.normalizeT(data.t + 0.002)).multiplyScalar(DT.scale),
                sphere: DT.player.sphere,
                data: data
            });
    });
    DT.$document.on('resetGame', function (e, data) {
        new DT.StonesCollection().removeObjects();
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

    DT.$document.on('update', function (e, data) {
        var t = DT.normalizeT(data.t + 0.08),
            binormal = DT.getBinormalAt(t);

        new DT.StaticStonesCollection().update({});

        if (data.timeElapsed < 30) {
            new DT.StaticStonesCollection()
                .createObjects({
                    position: data.tube.vertices[DT.genRandomFloorBetween(0, data.tube.vertices.length-1)].clone().multiplyScalar(DT.scale),
                    t: t,
                    sphere: DT.player.sphere,
                });
        }
    });
    DT.$document.on('resetGame', function (e, data) {
        new DT.StaticStonesCollection().removeObjects();
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
                opacityCoord: data.tube.path.getPointAt(DT.normalizeT(data.t + 0.002)).multiplyScalar(DT.scale),
                sphere: DT.player.sphere,
                data: data
            });
    });
    DT.$document.on('resetGame', function (e, data) {
        new DT.CoinsCollection().removeObjects()
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
        if (type === 0) DT.$document.trigger('changeHelth', {delta: 100});
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
        DT.$document.trigger('showBonuses', {caughtBonuses: this.caughtBonuses});
        return this;
    };
    DT.BonusesCollection.prototype.reset = function () {
        this.caughtBonuses.length = 0;
    };
    DT.$document.on('update', function (e, data) {
        new DT.BonusesCollection()
            .createObjects({
                offset: DT.genRandomFloorBetween(-1, 1),
                tube: data.tube,
                t: data.t,
            })
            .update({
                dieCoord: data.tube.path.getPointAt(DT.normalizeT(data.t - 0.008)).multiplyScalar(DT.scale),
                opacityCoord: data.tube.path.getPointAt(DT.normalizeT(data.t + 0.002)).multiplyScalar(DT.scale),
                sphere: DT.player.sphere,
                delta: data.delta * 1000
            });
    });
    DT.$document.on('catchBonus', function (e, data) {
        new DT.BonusesCollection().catchBonus(data.type);
    });
    DT.$document.on('resetGame', function (e, data) {
        new DT.BonusesCollection().removeObjects().reset(); 
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
        DT.audio.music.startedAt.length = 0;
        DT.audio.music.pausedAt.length = 0;
        DT.audio.music.stopped.length = 0;
        DT.audio.music.paused.length = 0;
        DT.audio.music.started.length = 0;
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
        DT.stopSound(2);
        DT.playSound(0);
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
                DT.$document.on('update', function (e, data) {
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
        DT.$document.keydown(function(event) {
            var k = event.keyCode;
            // arrows control
            if (k === 38) {
                // DT.player.changeDestPoint(new THREE.Vector3(0, 1, 0));
            }
            if (k === 40) {
                // DT.player.changeDestPoint(new THREE.Vector3( 0, -1,0));
            }
            if (k === 37) {
                DT.handlers.toTheLeft();
            }
            if (k === 39) {
                DT.handlers.toTheRight();
            }
            // speedUp
            if (k === 16) { //shift
                DT.$document.trigger('stopFun', {});
                DT.$document.trigger('changeSpeed', {changer: 36});
            }
            if (k === 17) {
                DT.$document.trigger('makeFun', {});
            }
        });
        DT.$document.keyup(function(event) {
            var k = event.keyCode;
            if (k === 16) { //shift
                DT.$document.trigger('changeSpeed', {changer: 0});
            }
        });
        DT.$document.keyup(DT.handlers.pauseOnSpace);
    };
    
    DT.$document.on('startGame', function (e, data) {
        DT.initKeyboardControl();
    });
    DT.$document.on('gameOver', function (e, data) {
        DT.$document.unbind('keyup', DT.handlers.pauseOnSpace);
        DT.$document.bind('keyup', DT.handlers.restartOnSpace);
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

    DT.$document.on('startGame', function (e, data) {
        DT.sendSocketMessage('gamestarted');
    });
    DT.$document.on('resetGame', function (e, data) {
        DT.sendSocketMessage('gamestarted');
    });
    DT.$document.on('gameOver', function (e, data) {
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
    
        // debugOverlay.style.height = '100%';
        debugOverlay.style.opacity = '0.1';
        debugOverlay.style.zIndex = '0';
        
                // Определяем сообщения, выдаваемые библиотекой
        
        var statusMessages = {
            'whitebalance' : 'Проверка камеры или баланса белого',
            'detecting' : 'Обнаружено лицо',
            'hints' : 'Что-то не так, обнаружение затянулось. Попробуйте сместиться относительно камеры',
            'redetecting' : 'Лицо потеряно, поиск..',
            'lost' : 'Лицо потеряно',
            'found' : 'Слежение за лицом'
        };
        
        var supportMessages = {
            'no getUserMedia' : 'Браузер не поддерживает getUserMedia',
            'no camera' : 'Не обнаружена камера.'
        };
        
        document.addEventListener('headtrackrStatus', function(event) {
            if (event.status in supportMessages) {
                console.log(supportMessages[event.status]);
                $('.message').html(supportMessages[event.status])
            } else if (event.status in statusMessages) {
                console.log(statusMessages[event.status]);
                $('.message').html(statusMessages[event.status])
            }
            if (event.status === 'found' && !DT.game.wasStarted) {
                DT.startAfterChooseControl();
            }
        }, true);
        
        // Установка отслеживания
        
        var htracker = new headtrackr.Tracker({
            altVideo : {ogv : '', mp4 : ''},
            calcAngles : true,
            ui : false,
            headPosition : false,
            debug : debugOverlay
        });
        htracker.init(videoInput, canvasInput);
        htracker.start();
        
        // Рисуем прямоугольник вокруг «пойманного» лица
        
        document.addEventListener('facetrackingEvent', function( event ) {
            // once we have stable tracking, draw rectangle
            if (event.detection == 'CS') {
                var angle = Number(event.angle *(180/ Math.PI)-90);
                // console.log(angle);
                if(angle < leftBreakThreshold) {
                    if(angle > leftTurnThreshold) {
                        DT.handlers.center();
                    } else {
                        DT.handlers.left();
                    }
                } else if (angle > rightBreakThreshold) {
                    if(angle < rightTurnThreshold) {
                        DT.handlers.center();
                    } else {
                        DT.handlers.right();
                    }
                } else {
                    DT.handlers.center();
                }
            }
        });
    };

// ██╗     ██╗███████╗████████╗███████╗███╗   ██╗███████╗██████╗ ███████╗
// ██║     ██║██╔════╝╚══██╔══╝██╔════╝████╗  ██║██╔════╝██╔══██╗██╔════╝
// ██║     ██║███████╗   ██║   █████╗  ██╔██╗ ██║█████╗  ██████╔╝███████╗
// ██║     ██║╚════██║   ██║   ██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗╚════██║
// ███████╗██║███████║   ██║   ███████╗██║ ╚████║███████╗██║  ██║███████║
// ╚══════╝╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚══════╝

    DT.$document.on('showFun', function (e, data) {
        if (data.isFun) {
            DT.$document.trigger('changeSpeed', {changer: -18});
            DT.stopSound(0);
            DT.playSound(1);
        } else {
            DT.$document.trigger('changeSpeed', {changer: 0});
            DT.stopSound(1);
            DT.playSound(0);
        }
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
            DT.$document.trigger('resetGame', {});
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
            DT.$document.trigger('resumeGame', {});
        } else {
            DT.$document.trigger('pauseGame', {});
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
        DT.player.changeDestPoint(new THREE.Vector3(-1, 0, 0));
    };
    DT.handlers.toTheRight = function () {
        DT.player.changeDestPoint(new THREE.Vector3(1, 0, 0));
    };
    DT.handlers.left = function () {
        DT.player.destPoint.x = -1;
    };
    DT.handlers.right = function () {
        DT.player.destPoint.x = 1;
    };
    DT.handlers.center = function () {
        DT.player.destPoint.x = 0;
    };
    DT.handlers.restart = function () {
        
    };
    DT.$document.on('resetGame', function (e, data) {
        DT.$document.bind('keyup', DT.handlers.pauseOnSpace);
        DT.$document.unbind('keyup', DT.handlers.restartOnSpace);
    });

// ██╗███╗   ██╗████████╗███████╗██████╗ ███████╗ █████╗  ██████╗███████╗
// ██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝
// ██║██╔██╗ ██║   ██║   █████╗  ██████╔╝█████╗  ███████║██║     █████╗  
// ██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██╔══╝  ██╔══██║██║     ██╔══╝  
// ██║██║ ╚████║   ██║   ███████╗██║  ██║██║     ██║  ██║╚██████╗███████╗
// ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝

    DT.runApp = function () {
        DT.initSocket();
        if (!document.hasFocus()) {
            DT.setVolume(0);
        } else {
            DT.setVolume(1);
        }
        DT.playSound(2);
        $(function() {
            $('.loader').fadeOut(250);
            $('.choose_control').css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, 250);
            DT.$document.keyup(DT.handlers.startOnSpace);
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
            DT.$document.trigger('startGame', {});
        }
        DT.$document.unbind('keyup',DT.handlers.startOnSpace);
    };
    DT.hit = function() {
        $(function(){
            $('.error').html('ERROR ' + DT.genRandomFloorBetween(500, 511));
            $('.hit').css({'display': 'table'}).fadeOut(250);
        });
    };

    $('.menu_button').click(function() {
        DT.$document.trigger('pauseGame', {});
    });
    $('.resume').click(function() {
        DT.$document.trigger('resumeGame', {});
    });
    $('.music_button').click(DT.handlers.mute);
    $('.fs_button').click(DT.handlers.fullscreen);
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

    DT.$document.on('startGame', function (e, data) {
        $('.choose_control').fadeOut(250);
    });
    DT.$document.on('pauseGame', function () {
        $('.menu_page').css({'display': 'table'});
    });
    DT.$document.on('resumeGame', function (e, data) {
        $('.menu_page').css({'display': 'none'});
    });
    DT.$document.on('startGame', function (e, data) {
        $('.gameTimer').css({'display': 'block'});
    });
    DT.$document.on('showScore', function (e, data) {
        $('.current_coins').text(data.score);
    });
    DT.$document.on('showHelth', function (e, data) {
        $('.helth').animate({width: data.helth + '%'});
    });
    DT.$document.on('showBonuses', function (e, data) {
        $('.bonus').text(data.caughtBonuses.join(' '));
        if (data.caughtBonuses.length === 3) {
            $('.bonus').fadeOut(300, function(){
                $('.bonus').text('').fadeIn(100);
            });
        }
    });
    DT.$document.on('gameOver', function (e, data) {
        $('.total_coins').text(DT.player.currentScore);
        $('.game_over').css({'display': 'table', 'opacity': '0'}).animate({'opacity': '1'}, DT.gameOverTime);
        $('#one_more_time').click(function () {
            DT.$document.trigger('resetGame', {});
        });
    });
    DT.$document.on('resetGame', function (e, data) {
        $('.current_coins').html('0');
        $('.bonus').html('');
        $('.gameTimer').html('0:00');
        $('.helth').css({width: '100%'});
        $('.game_over').hide();
        $('#one_more_time').unbind('click');
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
    DT.$document.on('startGame', function (e, data) {
        DT.setStats();
    });
    DT.$document.on('update', function (e, data) {
        DT.stats.update();
        DT.stats2.update();
    });

    var rendererStats  = new THREEx.RendererStats();
    rendererStats.domElement.style.position = 'absolute';
    rendererStats.domElement.style.left = '0px';
    rendererStats.domElement.style.top = '50px';
    document.body.appendChild(rendererStats.domElement);

    DT.$document.on('update', function (e, data) {
        rendererStats.update(DT.renderer);
    });

// ████████╗██╗  ██╗███████╗    ███████╗███╗   ██╗██████╗ 
// ╚══██╔══╝██║  ██║██╔════╝    ██╔════╝████╗  ██║██╔══██╗
   // ██║   ███████║█████╗      █████╗  ██╔██╗ ██║██║  ██║
   // ██║   ██╔══██║██╔══╝      ██╔══╝  ██║╚██╗██║██║  ██║
   // ██║   ██║  ██║███████╗    ███████╗██║ ╚████║██████╔╝
   // ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚══════╝╚═╝  ╚═══╝╚═════╝ 

    return DT;
}());