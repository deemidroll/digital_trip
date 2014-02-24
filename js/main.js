(function(){
// renderer
var renderer = DT.renderer;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.physicallyBasedShading = true;
document.body.appendChild(renderer.domElement);

// camera
camera = DT.camera;
camera.position.x = 0;
camera.position.y = 0.5;
camera.z = 15;
camera.position.z = camera.z;
camera.lens = 35;

var lens = camera.lens;
// scene
scene = DT.scene;

// declare the rendering loop
var onRenderFcts = DT.onRenderFcts;

// handle window resize events
var winResize = new THREEx.WindowResize(renderer, camera);

// sphere
var sphere = DT.sphere;
sphere.overdraw = true;
sphere.position.set(0, 0, 0);
scene.add(sphere);

// lightning 0xBE463C
var light = DT.lights.light;
light.position.set(0, 0, -1);
scene.add(light);

var sphereLight = DT.lights.sphereLight;
sphereLight.position.set(0, 0, 0);
scene.add(sphereLight);

var sphereLightning = DT.lights.sphereLightning;
sphereLightning.position.set(0, 0, 2);
// scene.add(sphereLightning);

var directionalLight = DT.lights.directionalLight;
directionalLight.position.set(0, 0, 1);
scene.add(directionalLight);

// shield
var shield = DT.shield;
shield.material.color = sphere.material.color;
shield.position = sphere.position;
// scene.add(shield);

// SOUNDS
var globalVolume = DT.globalVolume;
var webaudio = DT.webaudio;

var soundCoin = DT.soundCoin;
var soundGameover = DT.soundGameover;
var soundPause = DT.soundPause;
var soundStoneDestroy =DT.soundStoneDestro; 
var soundStoneMiss = DT.soundStoneMiss;


// Rendering Loop runner
var id = DT.id

// stats
var currentHelth = DT.player.currentHelth,
    currentScore = DT.player.currentScore;

// service variables
var spawnCoord = DT.param.spawnCoord,
    opacityCoord = DT.param.opacityCoord,
    dieCoord = camera.z + DT.param.dieCoord,
    stonesCloseness = DT.param.stonesCloseness;

// SPEED
var speed = DT.speed;

// collections
var stones = DT.collections.stones,
    fragments = DT.collections.fragments,
    coins = DT.collections.coins,
    bonuses = DT.collections.bonuses,
    caughtBonuses = DT.collections.caughtBonuses;

// coordinates of sphere destination point
var destPoint = DT.player.destPoint;

var engine = new ParticleEngine();
    engine.setValues( DT.startunnel );
    engine.initialize(),
    onRenderFcts = DT.onRenderFcts,
    clock = new THREE.Clock();

// create the emitter
var emitter = Fireworks.createEmitter({nParticles : 100})
    .effectsStackBuilder()
        .spawnerSteadyRate(25)
        .position(Fireworks.createShapePoint(0, 0, 0))
        .velocity(Fireworks.createShapePoint(0, 0, 2))
        .lifeTime(0.7, 0.7)
        .randomVelocityDrift(Fireworks.createVector(0, 0, 0))
        .renderToThreejsParticleSystem({
            particleSystem  : function(emitter){
                var sphere = DT.sphere,
                    geometry    = new THREE.Geometry(),
                    texture = Fireworks.ProceduralTextures.buildTexture(),
                    material    = new THREE.ParticleBasicMaterial({
                        color       : new THREE.Color().setHSL(1, 0, 0.3).getHex(),
                        size        : 60,
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
                for( var i = 0; i < emitter.nParticles(); i++ ){
                    geometry.vertices.push( new THREE.Vector3() );
                }
                // init colors
                geometry.colors = new Array(emitter.nParticles())
                for( var i = 0; i < emitter.nParticles(); i++ ){
                    geometry.colors[i]  = sphere.material.color;
                }
                
                scene.add(particleSystem);
                particleSystem.position = sphere.position;

                return particleSystem;
            }
        }).back()
    .start();
//////////////////////////////////////////////
// ON RENDER 
//////////////////////////////////////////////
onRenderFcts.push(function() {
    var dt = clock.getDelta();
    engine.update( dt * 0.5 );
});

DT.onRenderFcts.push(function() {
    emitter._particles.forEach(function(el) {
        el.velocity.vector.z += DT.valueAudio/28;
    });
});

// render the scene
onRenderFcts.push(function(delta, now) {
    renderer.render(scene, camera);
    emitter.update(delta).render();
    stats.update();
    speed.increase();
});

onRenderFcts.push(function() {
    var composer = DT.composer;
    if (speed.getChanger() > 0) {
        camera.position.z = Math.max(camera.position.z -= 0.1, camera.z - 2);
        lens = Math.max(lens -= 0.3, camera.lens - 6)
        composer.render();
    } else if (speed.getChanger() < 0) {
        camera.position.z = Math.min(camera.position.z += 0.05, camera.z + 1);
        lens = Math.min(lens += 0.3, camera.lens + 6);
        composer.render();
    } else {
        var delta = camera.lens - lens;
        if (delta > 0) {
            camera.position.z = Math.min(camera.position.z += 0.1, camera.z);
            lens = Math.min(lens += 0.3, camera.lens);
        } else {
            camera.position.z = Math.max(camera.position.z -= 0.05, camera.z);
            lens = Math.max(lens -= 0.3, camera.lens);
        }
    }
    camera.setLens(lens);
});
// stones lifecicle, rotation and moving
onRenderFcts.push(function() {
    stones.forEach(function(el, ind, arr){
    el.rotation.y += 0.007;
    el.rotation.x += 0.007;
    el.position.z += 0.1 * speed.getValue();
    if (el.position.z > dieCoord) {
        scene.remove(el);
    } 
    if (el.position.z > opacityCoord) {
        el.material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading, transparent: true, opacity: 0.75});
    }
    var distanceBerweenCenters = el.position.distanceTo(sphere.position),
        radiusesSum = sphere.geometry.radius + el.geometry.radius;
        
    if (distanceBerweenCenters < radiusesSum) {
        DT.soundStoneDestroy.update();
        DT.soundStoneDestroy.play();
        // bump(0.2);
        scene.remove(el);
        arr.splice(ind, 1);
        currentHelth = DT.changeHelth(currentHelth, -19);
        // вызвать вспышку экрана
        if (DT.player.isInvulnerability === false) {
            DT.hit();
        }
        // генерировать осколки
        DT.generateFragments(scene, fragments, el.position.x, el.position.y, el.position.z);
    }
    if (distanceBerweenCenters > radiusesSum && distanceBerweenCenters < radiusesSum + 1 && el.position.z - sphere.position.z > 1) {
        DT.soundStoneMiss.update();
        DT.soundStoneMiss.play();
    }
    });
});
// stones lifecicle
onRenderFcts.push(function() {
    if (!stones.length) {
        DT.generateStone(scene, stones, spawnCoord);
    }
    var el = stones[stones.length -1];
    if (DT.getDistance(0, 0, spawnCoord, el.position.x, el.position.y, el.position.z) > stonesCloseness) {
        DT.generateStone(scene, stones, spawnCoord);
    }
});
// fragments lifecicle
onRenderFcts.push(function() {
    if (fragments.length) {
        fragments.forEach(function(el, ind, arr) {
            // el.rotation.y += 0.05;
            // el.rotation.x += 0.05;
            el.position.x *= 1.1;
            el.position.y *= 1.1;
            el.position.z += 0.001 * speed.getValue();
            if (el.position.z > dieCoord) {
                scene.remove(el);
                arr.splice(ind, 1);
            }
        });
    }
});
// coins lifecicle
onRenderFcts.push(function() {
    if (!coins.length) {
        var x = DT.genCoord(),
            y = DT.genCoord();
        for (var i = 0; i < 10; i++) {
            DT.genCoins(scene, coins, spawnCoord - i * 10, x, y, i * 0.25);
        }
    }
    if (coins.length) {
        coins.forEach(function(el, ind, arr) {
            el.rotation.z += 0.05;
            el.position.z += 0.1 * speed.getValue();
            if (el.position.z > dieCoord) {
                scene.remove(el);
                arr.splice(ind, 1);
            }
            if (el.position.z > opacityCoord) {
                el.children.forEach(function(el) {
                    el.material.transparent = true;
                    el.material.opacity = 0.5;
                });
            }
            var distanceBerweenCenters = el.position.distanceTo(sphere.position);
            if (distanceBerweenCenters < 0.9) {
                DT.soundCoin.update();
                DT.soundCoin.play();
                DT.blink.doBlink(0xcfb53b, 60);
                DT.bump();
                scene.remove(el);
                arr.splice(ind, 1);
                currentScore = DT.changeScore(currentScore, 1);
            }
        });
    }
});
// sphere moving
onRenderFcts.push(function() {
    DT.moveSphere(sphere, destPoint);
    sphereLightning.position.x = sphere.position.x
    sphereLightning.position.y = sphere.position.y;
    sphereLight.position.x = sphere.position.x
    sphereLight.position.y = sphere.position.y;
});
// bonuses lifecicle
onRenderFcts.push(function() {
    if (!bonuses.length) {
        var x = DT.genCoord(),
            y = DT.genCoord();
        DT.genBonus(scene, bonuses, spawnCoord, x, y, DT.listOfModels);
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
            el.position.z += 0.1 * speed.getValue();
            if (el.position.z > dieCoord) {
                scene.remove(el);
                arr.splice(ind, 1);
            }
            if (el.position.z > opacityCoord) {
                el.material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading, transparent: true, opacity: 0.5});
            }
            if (DT.getDistance(
                el.position.x, el.position.y, el.position.z,
                sphere.position.x, sphere.position.y, sphere.position.z) < 1.0) {
                
                if (el.type === 0) {
                    el.rotation.x += 0.2;
                }
                if (el.type === 1) {
                    el.rotation.y += 0.2;
                }
                if (el.type === 2) {
                    el.rotation.z += 0.2;
                }

                el.position.z -= 0.095 * speed.getValue();
                el.scale.x *= 0.9;
                el.scale.y *= 0.9;
                el.scale.z *= 0.9;

                if (DT.getDistance(
                    el.position.x, el.position.y, el.position.z,
                    sphere.position.x, sphere.position.y, sphere.position.z) < 0.9) {
                    
                    scene.remove(el);
                    arr.splice(ind, 1);
                    DT.catchBonus(el.type);
                }
            }
        });
    }
});

onRenderFcts.push(function() {
    if (DT.blink.framesLeft === 0) {
        // sphere.material.color.r = 0.5 + valueAudio/125;
        return;
    }
    if (DT.blink.framesLeft === DT.blink.frames) {
        sphereLight.color.r = sphere.material.color.r = DT.blink.color.r;
        sphereLight.color.g = sphere.material.color.g = DT.blink.color.g;
        sphereLight.color.b = sphere.material.color.b = DT.blink.color.b;
    }
    if (DT.blink.framesLeft < DT.blink.frames) {
        sphereLight.color.r = sphere.material.color.r += DT.blink.dr;
        sphereLight.color.g = sphere.material.color.g += DT.blink.dg;
        sphereLight.color.b = sphere.material.color.b += DT.blink.db;
    }
    DT.blink.framesLeft -= 1;
});
}());