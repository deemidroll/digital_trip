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
                var geometry    = new THREE.Geometry();
                // init vertices
                for( var i = 0; i < emitter.nParticles(); i++ ){
                    geometry.vertices.push( new THREE.Vector3() );
                }
                // init colors
                geometry.colors = new Array(emitter.nParticles())
                for( var i = 0; i < emitter.nParticles(); i++ ){
                    geometry.colors[i]  = sphere.material.color;
                    // geometry.colors[i]  = new THREE.Color();
                }
                
                var texture = Fireworks.ProceduralTextures.buildTexture();
                var material    = new THREE.ParticleBasicMaterial({
                    color       : new THREE.Color().setHSL(1, 0, 0.3).getHex(),
                    size        : 60,
                    sizeAttenuation : false,
                    vertexColors    : true,
                    map     : texture,
                    blending    : THREE.AdditiveBlending,
                    depthWrite  : false,
                    transparent : true
                });
                var particleSystem      = new THREE.ParticleSystem(geometry, material);
                particleSystem.dynamic      = true;
                particleSystem.sortParticles    = true;
                
                scene.add(particleSystem);
                particleSystem.position = sphere.position;
                // particleSystem.material.color = sphere.material.color;
                return particleSystem;
            }
        }).back()
    .start();

    console.log(emitter);
 onRenderFcts.push(function() {
    emitter._particles.forEach(function(el) {
        el.velocity.vector.z += valueAudio/28;
    });
 });