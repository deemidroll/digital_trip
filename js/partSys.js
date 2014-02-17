// create the emitter
    var emitter = Fireworks.createEmitter({nParticles : 100})
        .effectsStackBuilder()
            .spawnerSteadyRate(15)
            .position(Fireworks.createShapePoint(0, 0, 0))
            .velocity(Fireworks.createShapePoint(0, 0, 3))
            .lifeTime(0.3, 0.5)
            .randomVelocityDrift(Fireworks.createVector(10, 10, 10))
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
                        geometry.colors[i]  = new THREE.Color();
                    }
                    
                    var texture = Fireworks.ProceduralTextures.buildTexture();
                    var material    = new THREE.ParticleBasicMaterial({
                        color       : new THREE.Color().setHSL(1, 0, 0.3).getHex(),
                        size        : 1.5,
                        sizeAttenuation : true,
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
                    particleSystem.material.color = sphere.material.color;
                    return particleSystem;
                }
            }).back()
        .start();