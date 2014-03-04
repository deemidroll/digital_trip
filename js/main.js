(function(){
// when resize
var winResize = new THREEx.WindowResize(DT.renderer, DT.camera);
// service variables
var dieCoord, lens, emitter, fragmentsPosition = {x: -1000, y: 0, z: 0}, fragmentsCounter = 0;
// collections
var stones = DT.collections.stones,
    fragments = DT.collections.fragments,
    coins = DT.collections.coins,
    bonuses = DT.collections.bonuses,
    caughtBonuses = DT.collections.caughtBonuses;
// ParticleEngine
    // stardust
DT.engine = new ParticleEngine(),
    clock = new THREE.Clock();
    DT.engine.setValues(DT.startunnel);
    DT.engine.initialize();

// DT.renderer
DT.renderer.setSize(window.innerWidth, window.innerHeight);
DT.renderer.physicallyBasedShading = true;
document.body.appendChild(DT.renderer.domElement);

// DT.camera
DT.camera.position.set(0, 0.5, 15);
DT.camera.position.z = DT.camera.z = 15;
DT.camera.lens = 35;

dieCoord = DT.camera.z + DT.param.dieCoord;
// LENS 
lens = DT.camera.lens;

// DT.sphere
DT.sphere.overdraw = true;
DT.sphere.position.set(0, -2.5, 0);
// DT.scene.add(DT.sphere);

// DT.lights
DT.lights.light.position.set(0, 0, -1);
DT.scene.add(DT.lights.light);

DT.lights.sphereLight.position.set(0, 0, 0);
DT.scene.add(DT.lights.sphereLight);

DT.lights.directionalLight.position.set(0, 0, 1);
DT.scene.add(DT.lights.directionalLight);

// DT.shield
DT.shield.material.color = DT.sphere.material.color;
DT.shield.position = DT.sphere.position;

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
                var geometry    = new THREE.Geometry(),
                    texture = Fireworks.ProceduralTextures.buildTexture(),
                    material    = new THREE.ParticleBasicMaterial({
                        color       : new THREE.Color().setHSL(1, 0, 0.3).getHex(),
                        size        : 3.5,
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
                for( var i = 0; i < emitter.nParticles(); i++ ){
                    geometry.vertices.push( new THREE.Vector3() );
                }
                // init colors
                geometry.colors = new Array(emitter.nParticles())
                for( var i = 0; i < emitter.nParticles(); i++ ){
                    geometry.colors[i]  = DT.sphere.material.color;
                }
                
                DT.scene.add(particleSystem);
                particleSystem.position = DT.sphere.position;

                return particleSystem;
            }
        }).back()
    .start();

// DT.emittFragments = Fireworks.createEmitter({nParticles : 1000})
//     .effectsStackBuilder()
//         .spawnerSteadyRate(10000)
//         .position(Fireworks.createShapeSphere(10, 0, 0, 3.0))
//         .velocity(Fireworks.createShapePoint(0, 0, 10))
//         .lifeTime(0.3, 0.5)
//         .randomVelocityDrift(Fireworks.createVector(10, 10, 10))
//         .renderToThreejsParticleSystem({
//             particleSystem  : function(emitt){
//                 var geometry    = new THREE.Geometry(),
//                     texture = Fireworks.ProceduralTextures.buildTexture(),
//                     material    = new THREE.ParticleBasicMaterial({
//                         color       : new THREE.Color().setHSL(1, 0, 0.3).getHex(),
//                         size        : 4,
//                         sizeAttenuation : false,
//                         vertexColors    : true,
//                         map     : texture,
//                         blending    : THREE.AdditiveBlending,
//                         depthWrite  : false,
//                         transparent : true
//                     }),
//                     particleSystem = new THREE.ParticleSystem(geometry, material);
//                     particleSystem.dynamic  = true;
//                     particleSystem.sortParticles = true;
//                 // init vertices
//                 for( var i = 0; i < emitt.nParticles(); i++ ){
//                     geometry.vertices.push( new THREE.Vector3() );
//                 }
//                 // init colors
//                 geometry.colors = new Array(emitt.nParticles())
//                 for( var i = 0; i < emitt.nParticles(); i++ ){
//                     geometry.colors[i]  = new THREE.Color("green");
//                 }
                
//                 DT.scene.add(particleSystem);
//                 particleSystem.position = {x:0, y:0, z:0};

//                 return particleSystem;
//             }
//         }).back()
//     .start();
//     console.log(DT.emittFragments);
//////////////////////////////////////////////
// ON RENDER 
//////////////////////////////////////////////
// Particle DT.Engine - stardust
DT.onRenderFcts.push(function() {
    var dt = clock.getDelta();
    DT.engine.update( dt * 0.5 );
});

// EMITTER Particle system - sphere tail
DT.onRenderFcts.push(function() {
    emitter._particles.forEach(function(el) {
        el.velocity.vector.z += DT.valueAudio/28;
    });
});

// DT.onRenderFcts.push(function() {
//     if (fragmentsPosition.x !== -1000) {
//         fragmentsCounter += 1; 
//         if (fragmentsCounter > 20) {
//             fragmentsPosition = {x: -1000, y: 0, z: 0};
//             fragmentsCounter = 0;
//         }
//     }
//     DT.emittFragments._effects.forEach(function (el) {
//         if (el.name === "position") {
//             el.opts.shape.position = fragmentsPosition;
//             el.opts.shape.radius = 0.15 * fragmentsCounter;
//         }
//     });
// });

// render the scene
DT.onRenderFcts.push(function(delta, now) {
    DT.renderer.render(DT.scene, DT.camera);
    DT.backgroundMesh.visible = true; // 1 раз
    emitter.update(delta).render();
    // DT.emittFragments.update(delta).render();
    stats.update();
    stats2.update();
    DT.speed.increase();
    DT.engine.velocityBase.z = DT.speed.getValue() * 10;
});

DT.gameTimer = 0;
DT.onRenderFcts.push(function () {
    DT.gameTimer += 1;
    if (DT.gameTimer % 60 === 0) {
        DT.updateGameTimer(DT.gameTimer);
    }
});
// LENS
DT.onRenderFcts.push(function() {
    var composer = DT.composer;
    if (DT.speed.getChanger() > 0) {
        // DT.camera.position.y = Math.min(DT.camera.position.y += 0.1, 0.5);
        DT.camera.position.z = Math.min(DT.camera.position.z += 0.1, DT.camera.z + 6);
        lens = Math.min(lens += 0.3, DT.camera.lens + 18)
        composer.render();
    } else if (DT.speed.getChanger() < 0) {
        // DT.camera.position.y = Math.max(DT.camera.position.y -= 0.1, -2.5);
        DT.camera.position.z = Math.max(DT.camera.position.z -= 0.05, DT.camera.z - 3);
        lens = Math.max(lens -= 0.3, DT.camera.lens - 18);
        composer.render();
    } else {
        var delta = DT.camera.lens - lens;
        if (delta < 0) {
            // DT.camera.position.y = Math.max(DT.camera.position.y -= 0.1, -2.5);
            DT.camera.position.z = Math.max(DT.camera.position.z -= 0.1, DT.camera.z);
            lens = Math.max(lens -= 0.3, DT.camera.lens);
        } else {
            // DT.camera.position.y = Math.min(DT.camera.position.y += 0.1, 0.5);
            DT.camera.position.z = Math.min(DT.camera.position.z += 0.05, DT.camera.z);
            lens = Math.min(lens += 0.3, DT.camera.lens);
        }
    }
    DT.camera.setLens(lens);
});
// stones lifecicle, rotation and moving
DT.onRenderFcts.push(function() {
    if (!stones.length) {
        DT.generateStone(DT.scene, stones, DT.param.spawnCoord);
    }
    var el = stones[stones.length -1];
    if (DT.getDistance(0, 0, DT.param.spawnCoord, el.position.x, el.position.y, el.position.z) > DT.param.stonesCloseness) {
        DT.generateStone(DT.scene, stones, DT.param.spawnCoord);
    }
    stones.forEach(function(el, ind, arr){
        if (el.position.z > dieCoord) {
            DT.scene.remove(el);
            arr.splice(ind, 1);
        } 
        if (el.position.z > DT.param.opacityCoord) {
            el.material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading, transparent: true, opacity: 0.75});
        }
        var distanceBerweenCenters = el.position.distanceTo(DT.sphere.position),
            radiusesSum = DT.sphere.geometry.radius + el.geometry.radius;
            
        if (distanceBerweenCenters < radiusesSum) {
            DT.soundStoneDestroy.update();
            DT.soundStoneDestroy.play();
            // bump(0.2);
            DT.scene.remove(el);
            arr.splice(ind, 1);
            DT.player.currentHelth = DT.changeHelth(DT.player.currentHelth, -19);
            // вызвать вспышку экрана
            if (DT.player.isInvulnerability === false) {
                DT.hit();
            }
            // генерировать осколки
            // DT.generateFragments(DT.scene, fragments, el.position.x, el.position.y, el.position.z, 2, el.geometry.radius);
            fragmentsPosition = {x: el.position.x, y: el.position.y, z: el.position.z}
            ///
        }
        if (distanceBerweenCenters > radiusesSum && distanceBerweenCenters < radiusesSum + 1 && el.position.z - DT.sphere.position.z > 1) {
            DT.soundStoneMiss.update();
            DT.soundStoneMiss.play();
        }
        if (DT.valueAudio > 30 ) { 
            // var geometry = new THREE.IcosahedronGeometry(el.geometry.radius, 0),
            //     material = el.material,
            //     x = el.position.x,
            //     y = el.position.y,
            //     z = el.position.z;
            // // DT.scene.remove(el);
            // el = new THREE.Mesh( geometry, material );
            // el.position.x = x;
            // el.position.y = y;
            // el.position.z = z;
            // // DT.scene.add(el);
            
            // el.rotation.y += 0.09;
            // el.rotation.x += 0.09;
        }
        el.rotation.y += 0.014;
        el.rotation.x += 0.014;
        el.position.z += 0.1 * DT.speed.getValue();
    });
});
// fragments lifecicle
DT.onRenderFcts.push(function() {
    if (fragments.length) {
        fragments.forEach(function(el, ind, arr) {
            el.frames += 1;
            el.position.x *= 1.2;
            el.position.y *= 1.2;
            el.position.z += 0;
            if (el.frames > el.TTL) {
                DT.scene.remove(el);
                arr.splice(ind, 1);
            }
        });
    }
});
// coins lifecicle
DT.onRenderFcts.push(function() {
    if (!coins.length) {
        var x = DT.genCoord(),
            y = -2.5;
        for (var i = 0; i < 10; i++) {
            DT.genCoins(DT.scene, coins, DT.param.spawnCoord - i * 10, x, y, i * 0.25);
        }
    }
    if (coins.length) {
        coins.forEach(function(el, ind, arr) {
            el.rotation.z += 0.05;
            el.position.z += 0.1 * DT.speed.getValue();
            if (el.position.z > dieCoord) {
                DT.scene.remove(el);
                arr.splice(ind, 1);
            }
            if (el.position.z > DT.param.opacityCoord) {
                el.children.forEach(function(el) {
                    el.material.transparent = true;
                    el.material.opacity = 0.5;
                });
            }
            var distanceBerweenCenters = el.position.distanceTo(DT.sphere.position);
            if (distanceBerweenCenters < 0.9) {
                DT.soundCoin.update();
                DT.soundCoin.play();
                DT.blink.doBlink(0xcfb53b, 60);
                DT.bump();
                DT.scene.remove(el);
                arr.splice(ind, 1);
                DT.player.currentScore = DT.changeScore(DT.player.currentScore, 1);
            }
        });
    }
});
// sphere moving
DT.onRenderFcts.push(function() {
    DT.moveSphere(DT.sphere, DT.player.destPoint, 3);
    DT.lights.sphereLight.position.x = DT.sphere.position.x;
    DT.lights.sphereLight.position.y = DT.sphere.position.y;
});
// bonuses lifecicle
DT.onRenderFcts.push(function() {
    if (!bonuses.length) {
        var x = DT.genCoord(),
            y = -2.5;
        DT.genBonus(DT.scene, bonuses, DT.param.spawnCoord, x, y, DT.listOfModels);
    }
    if (bonuses.length) {
        bonuses.forEach(function(el, ind, arr) {

            if (el.type === 0) {
                el.rotation.z += 0.05;
            }
            if (el.type === 1) {
                el.rotation.z += 0.05;
            }
            if (el.type === 2) {
                el.rotation.y += 0.05;
            }
            el.position.z += 0.1 * DT.speed.getValue();
            if (el.position.z > dieCoord) {
                DT.scene.remove(el);
                arr.splice(ind, 1);
            }
            if (el.position.z > DT.param.opacityCoord) {
                el.material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading, transparent: true, opacity: 0.5});
            }
            if (DT.getDistance(
                el.position.x, el.position.y, el.position.z,
                DT.sphere.position.x, DT.sphere.position.y, DT.sphere.position.z) < 1.0) {
                
                if (el.type === 0) {
                    el.rotation.x += 0.2;
                }
                if (el.type === 1) {
                    el.rotation.y += 0.2;
                }
                if (el.type === 2) {
                    el.rotation.z += 0.2;
                }

                // el.position.z -= 0.095 * DT.speed.getValue();
                el.scale.x *= 0.9;
                el.scale.y *= 0.9;
                el.scale.z *= 0.9;

                if (DT.getDistance(
                    el.position.x, el.position.y, el.position.z,
                    DT.sphere.position.x, DT.sphere.position.y, DT.sphere.position.z) < 0.9) {
                    
                    DT.scene.remove(el);
                    arr.splice(ind, 1);
                    DT.catchBonus(el.type);
                }
            }
        });
    }
});
// Invulner
DT.onRenderFcts.push(function () {
    if (DT.player.isInvulnerability === true) {
        DT.invulnerTimer -= 1;
        if (DT.invulnerTimer <= 0) {
            DT.player.isInvulnerability = false;
            DT.scene.remove(DT.shield);
        } else {
            return;
        }
    } else {
        return;
    }
});
// FUN
DT.onRenderFcts.push(function () {
    if (DT.player.isFun === true) {
        DT.funTimer -= 1;
        if (DT.funTimer <= 0) {
            DT.player.isFun = false;
            DT.speed.setChanger(0);
            DT.stopSound(1);
            DT.playSound(0);
            clearInterval(DT.rainbow);
            DT.blink.doBlink("red", 5);
        } else {
            if (DT.funTimer % 6 === 0) {
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
            return;
        }
    } else {
        return;
    }
});
// BLINK
DT.onRenderFcts.push(function() {
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
});
}());