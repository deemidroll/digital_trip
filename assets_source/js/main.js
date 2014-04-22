(function () {
    'use strict';
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

    //////////////////////////////////////////////
    // ON RENDER 
    //////////////////////////////////////////////
    // EMITTER Particle system - sphere tail
    DT.onRenderFcts.push(function() {
        emitter._particles.forEach(function(el) {
            el.velocity.vector.z += DT.audio.valueAudio/28;
        });
    });

    var prevTime = Date.now();
    // render the scene
    DT.onRenderFcts.push(function(delta, now) {
        DT.renderer.render(DT.scene, DT.camera);
        if (DT.player.isFun) {
            effect.render(DT.scene, DT.camera);
            effect.setSize( window.innerWidth, window.innerHeight );
        }
        if (!DT.backgroundMesh.visible) {
            DT.backgroundMesh.visible = true;
        }
        emitter.update(delta).render();
        DT.stats.update();
        DT.stats2.update();
        DT.game.speed.increase();
        if ( DT.animation ) {
            var time = Date.now();
            DT.animation.update( time - prevTime );
            prevTime = time;
        }
    });
    // game timer
    DT.gameTimer = 0;
    DT.onRenderFcts.push(function () {
        DT.gameTimer += 1;
        if (DT.gameTimer % 60 === 0) {
            DT.updateGameTimer(DT.gameTimer);
        }
    });
    // LENS
    DT.onRenderFcts.push(function() {
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
    // stones lifecicle, rotation and moving
    DT.onRenderFcts.push(function() {
        // create and update collections
        new DT.Stones()
            .createObjects({
                spawnCoord: DT.game.param.spawnCoord,
            })
            .update({
                dieCoord: DT.game.param.dieCoord,
                opacityCoord: DT.game.param.opacityCoord,
                sphere: DT.sphere
            });
        new DT.Coins()
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
                sphere: DT.sphere
            });
        new DT.Bonuses()
            .createObjects({
                x: DT.genCoord(),
                y: -2.5,
                spawnCoord: DT.game.param.spawnCoord,
            })
            .update({
                dieCoord: DT.game.param.dieCoord,
                opacityCoord: DT.game.param.opacityCoord,
                sphere: DT.sphere
            });
    });
    // sphere moving
    DT.onRenderFcts.push(function() {
        DT.moveSphere(DT.sphere, DT.player.destPoint, 3);
        DT.lights.sphereLight.position.x = DT.sphere.position.x;
        DT.lights.sphereLight.position.y = DT.sphere.position.y;
    });
    // PLAYER
    DT.onRenderFcts.push(function () {
        DT.player.update();
    });
    // BLINK
    DT.onRenderFcts.push(function() {
        DT.blink.update();
    });
    // DUST
    DT.onRenderFcts.push(function () {
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
    DT.snapshot = $.extend(true, {}, DT);
}());