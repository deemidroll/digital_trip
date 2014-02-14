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
var blink = function (color, frames) {
    var defClr = {r: 1, g: 0, b: 0},
        clr = new THREE.Color(color),
        framesLeft = frames;
        dr = (defClr.r - clr.r)/frames*0.5,
        dg = (defClr.g - clr.g)/frames*0.5,
        db = (defClr.b - clr.b)/frames*0.5,
        r = sphereLightning.color.r,
        g = sphereLightning.color.g,
        b = sphereLightning.color.b;

        onRenderFcts.push(function() {
            if (framesLeft > frames/2) {
                sphere.material.color.setRGB(r-=dr, g-=dg, b-=db);
                sphereLightning.color.setRGB(r-=dr, g-=dg, b-=db);
                sphereLight.color.setRGB(r-=dr, g-=dg, b-=db);
            }
            if (framesLeft < frames/2) {
                sphere.material.color.setRGB(r+=dr, g+=dg, b+=db);
                sphereLightning.color.setRGB(r+=dr, g+=dg, b+=db);
                sphereLight.color.setRGB(r+=dr, g+=dg, b+=db);
            }
            if (framesLeft === 0) {
                onRenderFcts.splice(onRenderFcts.length - 1, 1);
            }
            framesLeft -= 1;
        });
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
        $(".hit").fadeIn(0).fadeOut(1000);
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
    var geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32, 1),
        material = new THREE.MeshPhongMaterial({color: 0xcfb53b, specular: 0xcfb53b, shininess: 1}),
        // material = new THREE.MeshPhongMaterial({color: 0xffd700, emissive:0xffd700}),
        coin = new THREE.Mesh( geometry, material );

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