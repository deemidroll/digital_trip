 // ██████╗  █████╗ ███╗   ███╗███████╗
// ██╔════╝ ██╔══██╗████╗ ████║██╔════╝
// ██║  ███╗███████║██╔████╔██║█████╗  
// ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  
// ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗
 // ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
                                    
    DT.pauseOn = function () {
        if (!DT.game.wasPaused) {
            $('.menu_page').css({'display': 'table'});
            DT.stopSoundBeforPause();
            DT.audio.sounds.pause.play();
            cancelAnimationFrame(DT.animate.id);
            DT.game.wasPaused = true;
        }
    };

    DT.pauseOff = function () {
        if (DT.game.wasPaused) {
            $('.menu_page').css({'display': 'none'});
            DT.playSoundAfterPause();
            DT.audio.sounds.pause.play();
            DT.game.startGame();
            DT.game.wasPaused = false;
        }
    };
    DT.game = new DT.Game();

    // focus and blur events
    $(function() {
        $(window).focus(function() {
            if (!DT.game.wasMuted) {
                DT.setVolume(1);
            }
        });
        $(window).blur(function() {
            if (DT.game.wasStarted && !DT.game.wasPaused && !DT.game.wasOver) {
                DT.handlers.pause();
            }
            DT.setVolume(0);
        });
    });

// ██████╗ ██╗      █████╗ ██╗   ██╗███████╗██████╗ 
// ██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗
// ██████╔╝██║     ███████║ ╚████╔╝ █████╗  ██████╔╝
// ██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗
// ██║     ███████╗██║  ██║   ██║   ███████╗██║  ██║
// ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
                                                 

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

// ███████╗██╗  ██╗██╗███████╗██╗     ██████╗ 
// ██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗
// ███████╗███████║██║█████╗  ██║     ██║  ██║
// ╚════██║██╔══██║██║██╔══╝  ██║     ██║  ██║
// ███████║██║  ██║██║███████╗███████╗██████╔╝
// ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝ 
                                           
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
    $(document).on('invulner', function (e, data) {
        console.log('invulner');
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
                color: DT.sphere.material.color
            }, 
            geometry: {
                speed: DT.game.speed.getValue()
            }
        });
    });
    // when resize
    var winResize = new THREEx.WindowResize(DT.renderer, DT.camera),
        dieCoord = DT.game.param.dieCoord,
        lens,
        emitter,
        fragmentsPosition = {x: -1000, y: 0, z: 0},
        fragmentsCounter = 0;

    // DT.renderer
    DT.renderer.setSize(window.innerWidth, window.innerHeight);
    DT.renderer.physicallyBasedShading = true;
    document.body.appendChild(DT.renderer.domElement);

    // DT.camera
    DT.camera.position.set(0, 0.5, 15);
    DT.camera.position.z = DT.camera.z = 15;
    lens = DT.camera.lens = 35;

    // DT.sphere
    DT.sphere.position.set(0, -2.5, 0);

    // DT.lights
    DT.lights.light.position.set(0, 0, -1);
    DT.scene.add(DT.lights.light);

    DT.lights.sphereLight.position.set(0, 0, 0);
    DT.scene.add(DT.lights.sphereLight);

    DT.lights.directionalLight.position.set(0, 0, 1);
    DT.scene.add(DT.lights.directionalLight);

    // DT.dust
    DT.dust.createAndAdd();

    // create the emitter for sphere tail
    emitter = Fireworks.createEmitter({nParticles : 100})
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
                        geometry.colors[i]  = DT.sphere.material.color;
                    }
                    
                    DT.scene.add(particleSystem);
                    particleSystem.position = DT.sphere.position;
                    return particleSystem;
                }
            }).back()
        .start();

    // EFFECT
    // var effect = new THREE.ParallaxBarrierEffect( DT.renderer );
    var effect = new THREE.AnaglyphEffect( DT.renderer );

    // EMITTER Particle system - sphere tail
    $(document).on('update', function (e, data) {
        emitter._particles.forEach(function(el) {
            el.velocity.vector.z += DT.audio.valueAudio/28;
        });
    });
    // render the scene
    $(document).on('update', function (e, data) {
        DT.renderer.render(DT.scene, DT.camera);
        if (DT.player.isFun) {
            effect.render(DT.scene, DT.camera);
            effect.setSize( window.innerWidth, window.innerHeight );
        }
        if (!DT.backgroundMesh.visible) {
            DT.backgroundMesh.visible = true;
        }
        emitter.update(data.delta).render();
        DT.stats.update();
        DT.stats2.update();
        DT.game.speed.increase();
        if ( DT.animation ) {
            DT.animation.update( data.delta*1000 );
        }
    });
    // LENS
    $(document).on('update', function (e, data) {
        var camOffset = 6, camDelta = 0.1,
            lensOffset = 18, lensDelta = 0.3;
        // var composer = DT.composer;
        if (DT.game.speed.getChanger() > 0) {
            DT.camera.position.z = Math.max(DT.camera.position.z -= camDelta, DT.camera.z - camOffset);
            lens = Math.max(lens -= lensDelta, DT.camera.lens - lensOffset);
            // composer.render();
        } else if (DT.game.speed.getChanger() < 0) {
            DT.camera.position.z = Math.min(DT.camera.position.z += camDelta, DT.camera.z + camOffset);
            lens = Math.min(lens += lensDelta, DT.camera.lens + lensOffset);
            // composer.render();
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