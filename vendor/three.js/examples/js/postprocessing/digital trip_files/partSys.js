var geometry = new THREE.Geometry();

for ( i = 0; i < 200; i ++ ) {

    var vertex = new THREE.Vector3();
    // vertex.x = Math.random() * 2000 - 1000;
    // vertex.y = Math.random() * 2000 - 1000;
    // vertex.z = Math.random() * 2000 - 1000;
    vertex.x = Math.random() - 0.5;
    var sign = Math.random() - 0.5;
    vertex.y = Math.sqrt(0.25 - vertex.x * vertex.x) * sign / Math.abs(sign);
    vertex.z = Math.random();
    // vertex.z = 0;
    geometry.vertices.push( vertex );

}
    var material = new THREE.ParticleSystemMaterial( { size: 0.1 , color: 0xcfb53b} );
    var particles = new THREE.ParticleSystem( geometry, material );

    particles.rotation.x = 0.5;
    particles.rotation.y = 0;
    particles.rotation.z = 0;

    // scene.add( particles );



onRenderFcts.push(function(){
    // particles.position.x-=0.01;
    // particles.position.y-=0.01;
    particles.position.z += (Math.random()-0.5)*0.1;
});