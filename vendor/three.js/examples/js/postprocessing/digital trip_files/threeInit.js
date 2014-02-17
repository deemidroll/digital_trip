var renderer, scene, camera;

// renderer
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.physicallyBasedShading = true;
document.body.appendChild(renderer.domElement);

// camera
camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 150);
camera.position.x = 0;
camera.position.y = 1;
camera.position.z = 10;

camera.lens = 23;

console.log(camera);
// scene
scene = new THREE.Scene();

// declare the rendering loop
var onRenderFcts = [];

// handle window resize events
var winResize   = new THREEx.WindowResize(renderer, camera);

// sphere
var sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhongMaterial({color: 0xff0000}));
sphere.overdraw = true;
sphere.isInvulnerability = false;
scene.add(sphere);

// lightning 0xBE463C
var light  = new THREE.PointLight(0xffffff, 0.75, 100);
light.position.set(0, 0, -1);
scene.add(light);

var sphereLight = new THREE.PointLight(0xff0000, 1.75, 7.5);
sphereLight.position.set(0, 0, 0);
scene.add(sphereLight);

var sphereLightning = new THREE.PointLight(0xff0000, 0.75, 7.5);
sphereLightning.position.set(0, 0, 2);
scene.add(sphereLightning);

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.25 );
directionalLight.position.set(0, 0, 1);
scene.add(directionalLight);

// shield
var shield = new THREE.Mesh(new THREE.CubeGeometry(1.3, 1.3, 1.3, 2, 2, 2), new THREE.MeshPhongMaterial({color: 0xffffff, transparent: true, opacity: 0.5}));
shield.material.color = sphere.material.color;
shield.position = sphere.position;
// scene.add(shield);

// change IcosahedronGeometry prototype
THREE.IcosahedronGeometry = function ( radius, detail ) {
    this.radius = radius;
    this.detail = detail;
    var t = ( 1 + Math.sqrt( 5 ) ) / 2;
    var vertices = [
        [ -1,  t,  0 ], [  1, t, 0 ], [ -1, -t,  0 ], [  1, -t,  0 ],
        [  0, -1,  t ], [  0, 1, t ], [  0, -1, -t ], [  0,  1, -t ],
        [  t,  0, -1 ], [  t, 0, 1 ], [ -t,  0, -1 ], [ -t,  0,  1 ]
    ];

    vertices = vertices.map(function(el) {
        return el.map(function(el) {
            return el * Math.random();
        });
    });

    var faces = [
        [ 0, 11,  5 ], [ 0,  5,  1 ], [  0,  1,  7 ], [  0,  7, 10 ], [  0, 10, 11 ],
        [ 1,  5,  9 ], [ 5, 11,  4 ], [ 11, 10,  2 ], [ 10,  7,  6 ], [  7,  1,  8 ],
        [ 3,  9,  4 ], [ 3,  4,  2 ], [  3,  2,  6 ], [  3,  6,  8 ], [  3,  8,  9 ],
        [ 4,  9,  5 ], [ 2,  4, 11 ], [  6,  2, 10 ], [  8,  6,  7 ], [  9,  8,  1 ]
    ];
    THREE.PolyhedronGeometry.call( this, vertices, faces, radius, detail );

};
THREE.IcosahedronGeometry.prototype = Object.create( THREE.Geometry.prototype );
// add method repeat
String.prototype.repeat = function(num) {
    return new Array( num + 1 ).join( this );
}
// Rendering Loop runner
var id;
var lastTimeMsec= null;
    requestAnimationFrame(function animate(nowMsec) {
        // keep looping
        id = requestAnimationFrame(animate);
        // measure time
        lastTimeMsec    = lastTimeMsec || nowMsec-1000/60;
        var deltaMsec   = Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec    = nowMsec;
        // call each update function
        onRenderFcts.forEach(function(onRenderFct) {
            onRenderFct(deltaMsec/1000, nowMsec/1000);
        });
    });