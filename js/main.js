require([
    "vendor/three.js/build/three.js",
    "vendor/three.js/examples/js/Detector.js",
    "vendor/threex.windowresize.js",
    "bower_components/threex.keyboardstate/package.require.js"], function(){
// renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 9;

// scene
var scene = new THREE.Scene();
// declare the rendering loop
var onRenderFcts= [];
// handle window resize events
var winResize   = new THREEx.WindowResize(renderer, camera)

// sphere
var sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true,}));
sphere.overdraw = true;
scene.add(sphere);

// polyhedron
var polyhedron = new THREE.Mesh(new THREE.SphereGeometry(1, 3, 2), new THREE.MeshNormalMaterial({color: 0x000000, }));
polyhedron.overdraw = true;
polyhedron.position.x = -2;
polyhedron.position.y = 2;
polyhedron.position.z = 0;
scene.add(polyhedron);

// create keyboard instance
var keyboard  = new THREEx.KeyboardState();

// render the scene
onRenderFcts.push(function(){
    renderer.render(scene, camera);
});

// rotation
onRenderFcts.push(function() {
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    polyhedron.rotation.x += 0.01;
    polyhedron.rotation.y += 0.01;
});
// add function in rendering loop
onRenderFcts.push(function(delta, now){

    // only if the sphere is loaded
    if( sphere === null )  return;

    // set the speed
    var speed = 5;
    // only if spaceships is loaded
    if( keyboard.pressed('down') ){
        sphere.position.y  -= speed * delta;
    }else if( keyboard.pressed('up') ){
        sphere.position.y  += speed * delta;
    }else if( keyboard.pressed('left') ){
        sphere.position.x  -= speed * delta;
    }else if( keyboard.pressed('right') ){
        sphere.position.x  += speed * delta;
    }
});
// Rendering Loop runner
var lastTimeMsec= null;
    requestAnimationFrame(function animate(nowMsec){
        // keep looping
        requestAnimationFrame( animate );
        // measure time
        lastTimeMsec    = lastTimeMsec || nowMsec-1000/60;
        var deltaMsec   = Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec    = nowMsec;
        // call each update function
        onRenderFcts.forEach(function(onRenderFct){
            onRenderFct(deltaMsec/1000, nowMsec/1000);
        });
    });
});