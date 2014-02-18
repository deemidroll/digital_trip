var engine = new ParticleEngine();
    engine.setValues( Examples.startunnel );
    engine.initialize();

var clock = new THREE.Clock();

onRenderFcts.push(function() {
    var dt = clock.getDelta();
    engine.update( dt * 0.5 );
});