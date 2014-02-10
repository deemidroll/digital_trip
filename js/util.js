// contains auxiliary functions
var getDistance = function (x1, y1, z1, x2, y2, z2) {
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)+(z1-z2)*(z1-z2));
};

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

var changeHelth = function(currentHelth, delta) {
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
    return currentHelth;
};

var changeScore = function(currentScore, delta) {
    currentScore += delta;
    $(function(){
        $(".current_coins").text(currentScore);
    });
    return currentScore;
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

var hit = function() {
    $(function(){
        $(".hit").fadeIn(500).fadeOut(500);
    });
};

var generateStone = function (scene, arr, spawnCoord) {
    var geometry = new THREE.IcosahedronGeometry(0.5, 0),
        material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading}),
        polyhedron = new THREE.Mesh( geometry, material );
        polyhedron.position.x = Math.random() * 10 - 5;
        polyhedron.position.y = Math.random() * 10 - 5;
        polyhedron.position.z = Math.random() * 4 + spawnCoord;
        polyhedron.rotation.x = Math.random();
        polyhedron.rotation.y = Math.random();
        arr.push(polyhedron);
        scene.add(polyhedron);
};

var generateFragments = function (scene, arr, x, y, z, numb) {
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
        arr.push(tetrahedron);
        scene.add(tetrahedron);
    }
};

var genCoins = function (scene, arr, spawnCoord) {
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
        arr.push(cylinder);
        scene.add(cylinder);
};

var changeDestPoint = function(dy, dx, destPoint) {
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

var moveSphere = function(sphere, destPoint) {
    var moveOnAix = function(aix) {
        var dx = destPoint[aix] - sphere.position[aix];
        if (Math.abs(dx) > 0.01) {
            sphere.position[aix] += dx > 0 ? 0.1 : -0.1;
        }
    };
    moveOnAix("x");
    moveOnAix("y");
};