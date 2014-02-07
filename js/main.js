require([
    "vendor/jquery.min.js",
    "js/three.min.js",
    "vendor/three.js/examples/js/Detector.js",
    "vendor/threex.windowresize.js",
    "bower_components/threex.keyboardstate/package.require.js"], function(){
// renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 50);
camera.position.z = 9;
// scene
var scene = new THREE.Scene();
// declare the rendering loop
var onRenderFcts= [];
// handle window resize events
var winResize   = new THREEx.WindowResize(renderer, camera);

var getDistance = function (x1, y1, z1, x2, y2, z2) {
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)+(z1-z2)*(z1-z2));
}

var genCoord = function(delta) {
    var offset = delta || 2.5;
    var x = Math.random() * offset * 2 - offset;
    var absX = Math.abs(x);
    if (absX <= offset && absX >= offset*0.33 ) {
        if (x > 0) {
            return offset; 
        }
        if (x < 0) {
            return offset * -1;
        }
    } else {
        return 0;
    }
};

var currentHelth = 100;
var changeHelth = function(delta) {
    var helth = currentHelth;
    if (helth > 0) {
        helth += delta;
        if (helth < 0) {
            helth = 0;
            gameOver();
        }
        if (helth > 100) {
            helth = 100;
        }
    }
    currentHelth = helth;
    $(function(){
        $(".helth").animate({
            width: helth + "%"
        });
    });
}

var currentScore = 0;
var changeScore = function(delta) {
    currentScore += delta;
    $(function(){
        $(".current_coins").text(currentScore);
    });
};

var gameOver = function() {
    $(function(){
        $(".total_coins").text(currentScore);
        $(".game_over").css({"display": "table", "opacity": "0"}).animate({"opacity": "1"}, 500);
    });
    setTimeout(function() {
        cancelAnimationFrame(id);
    }, 500);
    // oneMoreTime();
};

// var restart = function () {
    
// };

// var oneMoreTime = function () {
//     $(function(){
//         $(".one_more_time").click(function() {
//             $(".game_over").fadeOut(100);
//             restart();
//         });
//     });
// };

var hit = function() {
    $(function(){
        $(".hit").fadeIn(500).fadeOut(500);
    });
};

// polyhedron
var spawnCoord = -55,
    // blurCoord = 3,
    dieCoord = 7,
    stonesCloseness = 5;

var group = [];
var generateStone = function () {
    var geometry = new THREE.IcosahedronGeometry(0.5, 0),
        material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading}),
        polyhedron = new THREE.Mesh( geometry, material );
        polyhedron.position.x = Math.random() * 10 - 5;
        polyhedron.position.y = Math.random() * 10 - 5;
        polyhedron.position.z = Math.random() * 4 + spawnCoord;
        polyhedron.rotation.x = Math.random();
        polyhedron.rotation.y = Math.random();
        group.push(polyhedron);
        scene.add(polyhedron);
};

var fragments = [];
var generateFragments = function (x, y, z, numb) {
    var geometry = new THREE.TetrahedronGeometry(0.2, 0),
        material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading}),
        numb = numb || 1.5;
    for (var i = 0; i < 10; i++) {
    var tetrahedron = new THREE.Mesh( geometry, material );
        tetrahedron.position.x = x + Math.random() * numb - 0.5 * numb;
        tetrahedron.position.y = y + Math.random() * numb - 0.5 * numb;
        tetrahedron.position.z = z + Math.random() * numb - 0.5 * numb;
        // tetrahedron.position.z = z;
        tetrahedron.rotation.x = Math.random();
        tetrahedron.rotation.y = Math.random();
        fragments.push(tetrahedron);
        scene.add(tetrahedron);
    }
}

var coins = [];
var genCoins = function () {
    var geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32, 1),
        texture = THREE.ImageUtils.loadTexture("./img/avers.png");;
        material = new THREE.MeshLambertMaterial({map:texture}),
        cylinder = new THREE.Mesh( geometry, material );

        cylinder.position.x = genCoord();
        cylinder.position.y = genCoord();
        cylinder.position.z = Math.random() * 4 + spawnCoord;
        cylinder.rotation.x = 1.5;
        cylinder.rotation.y = 0;
        cylinder.rotation.z = 0;
        coins.push(cylinder);
        scene.add(cylinder);
};

// sphere
var sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhongMaterial({color: 0xffffff}));
sphere.overdraw = true;
scene.add(sphere);

// lightning
var sphereLight  = new THREE.DirectionalLight(0xBE463C, 1);
sphereLight.position.set(0, 0, 1);
// scene.add( sphereLight );

var light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 1);
scene.add(light);

onRenderFcts.push(function() {

});

var ambientLight= new THREE.AmbientLight(0xffffff);
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
        sphere.position.x, sphere.position.y, sphere.position.z) < 0.9) {
        scene.remove(el);
        arr.splice(ind, 1);
        changeHelth(-19);
        // вызвать вспышку экрана
        hit();
        // генерировать осколки
        generateFragments(el.position.x, el.position.y, el.position.z);
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
// fragments lifecicle
onRenderFcts.push(function() {
    if (fragments.length) {
        fragments.forEach(function(el, ind, arr) {
            // el.rotation.y += 0.05;
            // el.rotation.x += 0.05;
            el.position.x *= 1.1;
            el.position.y *= 1.1;
            el.position.z += 0.1;
            if (el.position.z > dieCoord) {
                scene.remove(el);
                arr.splice(ind, 1);
            }
        });
    }
});

//coins generation
onRenderFcts.push(function() {
    if (!coins.length) {
        genCoins();
    }
    if (coins.length) {
        coins.forEach(function(el, ind, arr) {
            el.rotation.z += 0.05;
            el.position.z += 0.1;
            if (el.position.z > dieCoord) {
                scene.remove(el);
                arr.splice(ind, 1);
            }
            if (getDistance(
                el.position.x, el.position.y, el.position.z,
                sphere.position.x, sphere.position.y, sphere.position.z) < 0.9) {
                scene.remove(el);
                arr.splice(ind, 1);
                changeScore(10);
            }
        });
    }
});

onRenderFcts.push(function() {
    moveSphere();
});
// /////////////////////////////////////////////////
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
            changeDestPoint(1, 0);
            if (keyboard.pressed('left')) {
                changeDestPoint(0, -1);
            } else if (keyboard.pressed('right')) {
                changeDestPoint(0, 1);
            }
        break
        case keyboard.pressed('down'):
            changeDestPoint(-1, 0); 
            if (keyboard.pressed('left')) {
                changeDestPoint(0, -1);
            } else if (keyboard.pressed('right')) {
                changeDestPoint(0, 1);
            }
        break
        case keyboard.pressed('left'): 
            changeDestPoint(0, -1);
            if (keyboard.pressed('up')) {
                changeDestPoint(1, 0);
            } else if (keyboard.pressed('down')) {
                changeDestPoint(-1, 0);
            }
        break
        case keyboard.pressed('right'): 
            changeDestPoint(0, 1);
            if (keyboard.pressed('up')) {
                changeDestPoint(1, 0);
            } else if (keyboard.pressed('down')) {
                changeDestPoint(-1, 0);
            }
        break
    }
    light.position.x = sphere.position.x;
    light.position.y = sphere.position.y;
});

var destPoint = {x: 0, y: 0};
var changeDestPoint = function(dy, dx) {
    var newPos = dx * 2.5;

    // destPoint.x = Math.min(newPos, 2.5);
    // destPoint.x = Math.max(newPos, -2.5);

    if (destPoint.x < 2.5 && dx > 0) {
        destPoint.x += dx * 2.5;
    }
    if (destPoint.x > -2.5 && dx < 0) {
        destPoint.x += dx * 2.5;
    }
    if (destPoint.y < 2.5 && dy > 0) {
        destPoint.y += dy * 2.5;
    }
    if (destPoint.y > -2.5 && dy < 0) {
        destPoint.y += dy * 2.5;
    }
};

var moveSphere = function() {
    var moveOnAix = function(aix) {
        var dx = destPoint[aix] - sphere.position[aix];
        if (Math.abs(dx) > 0.01) {
            sphere.position[aix] += dx > 0 ? 0.1 : -0.1;
        }
    };
    moveOnAix("x");
    moveOnAix("y");
};

// Rendering Loop runner
var id;
var lastTimeMsec= null;
    requestAnimationFrame(function animate(nowMsec){
        // keep looping
        id = requestAnimationFrame( animate );
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
