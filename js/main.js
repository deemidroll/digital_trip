require([
    "js/three.min.js",
    "vendor/three.js/examples/js/Detector.js",
    "vendor/threex.windowresize.js",
    "bower_components/threex.keyboardstate/package.require.js"], function(){
// renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
camera.position.z = 9;

// scene
var scene = new THREE.Scene();
// declare the rendering loop
var onRenderFcts= [];
// handle window resize events
var winResize   = new THREEx.WindowResize(renderer, camera)

// sphere
var sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhongMaterial({color: 0xffffff}));
sphere.overdraw = true;
scene.add(sphere);

// polyhedron
var spawnCoord = -110,
    blurCoord = 3,
    dieCoord = 10,
    stonesCloseness = 10;

var group = [];
var generateStone = function () {
    var geometry = new THREE.IcosahedronGeometry( 0.5, 0 );
    var material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading});
    var polyhedron = new THREE.Mesh( geometry, material );
        polyhedron.position.x = Math.random() * 4 - 1;
        polyhedron.position.y = Math.random() * 4 - 1;
        polyhedron.position.z = Math.random() * 4 + spawnCoord;
        polyhedron.rotation.x = Math.random();
        polyhedron.rotation.y = Math.random();
        group.push(polyhedron);
        scene.add( polyhedron );
};

// проверка - убрать
// for (var i = 0; i < 9; i++) {
//     generateStone();
// }

var getDistance = function (x1, y1, z1, x2, y2, z2) {
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)+(z1-z2)*(z1-z2));
}

// lightning
var sphereLight  = new THREE.DirectionalLight(0xBE463C, 1);
sphereLight.position.set(0, 0, 1);
scene.add( sphereLight );

var light = new THREE.PointLight( 0xff0000, 1, 100 );
light.position.set( 0, 0, 1 );
scene.add( light );

// var ambientLight= new THREE.AmbientLight( 0xffffff );
// scene.add( ambientLight);

// create keyboard instance
var keyboard  = new THREEx.KeyboardState();

// render the scene
onRenderFcts.push(function(){
    renderer.render(scene, camera);
});

// polyhedron life cicle, rotation and moving
onRenderFcts.push(function() {
    group.forEach(function(el, ind, arr){
    el.rotation.y += 0.007;
    el.rotation.x += 0.007;
    el.position.z += 0.1;
    if (el.position.z > dieCoord) {
        scene.remove(el);
    } 
    if (getDistance(
        el.position.x, el.position.y, el.position.z,
        sphere.position.x, sphere.position.y, sphere.position.z) < 1) {
        scene.remove(el);
        // вызвать вспышку экрана
        // генерировать осколки
    }
    });
});
// stones generation
onRenderFcts.push(function() {
    if (!group.length) {
        generateStone();
    }
    var el = group[group.length -1];
    if (getDistance(0, 0, spawnCoord, el.position.x, el.position.y, el.position.z) > stonesCloseness) {
        generateStone();
    }
});

// control
// add function in rendering loop
onRenderFcts.push(function(delta, now){

    // only if the sphere is loaded
    if( sphere === null )  return;

    // set the speed
    var speed = 5;
    // only if spaceships is loaded
    switch (true) {
        case keyboard.pressed('up'): 
            sphere.position.y += speed * delta;
            if (keyboard.pressed('left')) {
                sphere.position.x -= speed * delta;
            } else if (keyboard.pressed('right')) {
                sphere.position.x += speed * delta;
            }
        break
        case keyboard.pressed('down'): 
            sphere.position.y -= speed * delta;
            if (keyboard.pressed('left')) {
                sphere.position.x -= speed * delta;
            } else if (keyboard.pressed('right')) {
                sphere.position.x += speed * delta;
            }
        break
        case keyboard.pressed('left'): 
            sphere.position.x -= speed * delta;
            if (keyboard.pressed('up')) {
                sphere.position.y += speed * delta;
            } else if (keyboard.pressed('down')) {
                sphere.position.y -= speed * delta;
            }
        break
        case keyboard.pressed('right'): 
            sphere.position.x += speed * delta;
            if (keyboard.pressed('up')) {
                sphere.position.y += speed * delta;
            } else if (keyboard.pressed('down')) {
                sphere.position.y -= speed * delta;
            }
        break
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