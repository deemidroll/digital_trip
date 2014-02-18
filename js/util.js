// auxiliary functions
var getDistance = function (x1, y1, z1, x2, y2, z2) {
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)+(z1-z2)*(z1-z2));
};

var genCoord = function(delta) {
    var offset = delta || 2.5;
    var x = Math.random() * offset * 2 - offset;
    var absX = Math.abs(x);
    if (absX <= offset && absX >= offset * 0.33 ) {
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
    if (delta > 0 || sphere.isInvulnerability === false) {
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
    return currentHelth;
};

var invulnerTimeout;
var dontFeelPain = function (time) {
    clearTimeout(invulnerTimeout);
    sphere.isInvulnerability = true;
    scene.add(shield);
    invulnerTimeout = setTimeout(function() {
        sphere.isInvulnerability = false;
        scene.remove(shield);
        clearTimeout(invulnerTimeout);
    }, time || 10000);
};

////////////////////////////////////////////
// использовать очередь функций 

var blink = {
    color: new THREE.Color(),
    frames: 0,
    framesLeft: 0,
    dr: 0,
    dg: 0,
    db: 0
};

blink.doBlink = function (color, frames) {
    var defClr = {r: 1, g: 0, b: 0};
        blink.color = new THREE.Color(color);
        blink.frames = frames;
        blink.framesLeft = frames;
        blink.dr = (defClr.r - blink.color.r)/frames;
        blink.dg = (defClr.g - blink.color.g)/frames;
        blink.db = (defClr.b - blink.color.b)/frames;
};
////////////////////////////////////////////

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
        $(".game_over").css({"display": "table", "opacity": "0"}).animate({"opacity": "1"}, 1000);
    });
    setTimeout(function() {
        cancelAnimationFrame(id);
    }, 300);
    oneMoreTime();
};

var oneMoreTime = function() {
    $('.one_more_time').click(function() {
        location.reload();
    });
}

var hit = function() {
    $(function(){
        $(".error").html(genRandomFloorBetween(500, 511));
        $(".hit").css({"display": "table"}).fadeOut(1000, function() {
            $(".error").html("");
        });
    });
};

var generateStone = function (scene, arr, spawnCoord) {
    var radius, color, x, y,
        part = Math.random();
    if (part > 0.5) {
        x = Math.random() * 10 - 5,
        y = Math.random() * 10 - 5;
    } else {
        x = Math.random() * 30 - 15,
        y = Math.random() * 30 - 15;
    }
        if (Math.abs(x) > 5 || Math.abs(y) > 5) {
            radius = Math.random() + 1.5;
            color = 0x555555;
        } else {
            radius = Math.min(Math.random() + 1, 1.5);
            color = 0x999999;
        }

    var geometry = new THREE.IcosahedronGeometry(radius, 0),
        material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading, color: color}),
        stone = new THREE.Mesh( geometry, material );
        stone.position.x = x;
        stone.position.y = y;
        stone.position.z = Math.random() * 4 + spawnCoord;
        stone.rotation.x = Math.random();
        stone.rotation.y = Math.random();
        arr.push(stone);
        scene.add(stone);
};

var generateFragments = function (scene, arr, x, y, z, numb) {
    var geometry = new THREE.IcosahedronGeometry(0.5, 0),
        material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading}),
        numb = numb || 2;
    for (var i = 0; i < 5; i++) {
        var fragment = new THREE.Mesh( geometry, material );
        fragment.position.x = x + Math.random() * numb - 0.5 * numb;
        fragment.position.y = y + Math.random() * numb - 0.5 * numb;
        // fragment.position.z = z + Math.random() * numb - 0.5 * numb;
        // fragment.position.z = z;
        fragment.rotation.x = Math.random();
        fragment.rotation.y = Math.random();
        arr.push(fragment);
        scene.add(fragment);
    }
};

var genCoins = function (scene, arr, spawnCoord, x, y, zAngle) {
    var r = 0.5,
    coin_sides_geo = new THREE.CylinderGeometry( r, r, 0.1, 32, 1, true ),
    coin_cap_geo = new THREE.Geometry();
    for ( var i=0; i<100; i++) {
        var a = i * 1/100 * Math.PI * 2,
            z = Math.sin(a),
            xCosA = Math.cos(a),
            a1 = (i+1) * 1/100 * Math.PI * 2,
            z1 = Math.sin(a1),
            x1 = Math.cos(a1);
        coin_cap_geo.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(xCosA*r, 0, z*r),
            new THREE.Vector3(x1*r, 0, z1*r)
        );
        coin_cap_geo.faceVertexUvs[0].push([
            new THREE.Vector2(0.5, 0.5),
            new THREE.Vector2(xCosA/2+0.5, z/2+0.5),
            new THREE.Vector2(x1/2+0.5, z1/2+0.5)
        ]);
        coin_cap_geo.faces.push(new THREE.Face3(i*3, i*3+1, i*3+2));
    }
    coin_cap_geo.computeCentroids();
    coin_cap_geo.computeFaceNormals();

    var coin_cap_texture = THREE.ImageUtils.loadTexture("./img/avers.png");

    var coin_sides_mat = new THREE.MeshPhongMaterial({color: 0xcfb53b, specular: 0xcfb53b, shininess: 1});
    var coin_sides = new THREE.Mesh( coin_sides_geo, coin_sides_mat );

    var coin_cap_mat = new THREE.MeshPhongMaterial({color: 0xcfb53b, specular: 0xcfb53b, shininess: 1, map:coin_cap_texture});
    var coin_cap_top = new THREE.Mesh( coin_cap_geo, coin_cap_mat );
    var coin_cap_bottom = new THREE.Mesh( coin_cap_geo, coin_cap_mat );
    coin_cap_top.position.y = 0.05;
    coin_cap_bottom.position.y = -0.05;
    coin_cap_top.rotation.x = Math.PI;

    var coin = new THREE.Object3D();
    coin.add(coin_sides);
    coin.add(coin_cap_top);
    coin.add(coin_cap_bottom);

    coin.position.x = x;
    coin.position.y = y;
    coin.position.z = Math.random() * 4 + spawnCoord;;
    coin.rotation.x = 1.5;
    coin.rotation.y = 0;
    coin.rotation.z = zAngle;
    arr.push(coin);
    scene.add(coin);
};

var changeDestPoint = function(dy, dx, destPoint) {
    var newPos = dx * 2.5;

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

    ["x", "y"].forEach(function(aix) {
        var dx = destPoint[aix] - sphere.position[aix];
        if (Math.abs(dx) > 0.01) {
            sphere.position[aix] += dx > 0 ? 0.1 : -0.1;
        }
    });
};

var makeFun = function(time) {
    speed.setChanger(-1);
    var invulner = setTimeout(function() {
        speed.setChanger(0);
        clearTimeout(invulner);
    }, time || 10000);
};

var genRandomFloorBetween = function (min, max) {
    var rand = min - 0.5 + Math.random()*(max-min+1);
    rand = Math.round(rand);
    return rand;
};