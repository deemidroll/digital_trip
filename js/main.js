// stats
var currentHelth = 100,
    currentScore = 0;

// service variables
var spawnCoord = -100,
    // blurCoord = 3,
    opacityCoord = 2,
    dieCoord = 7,
    stonesCloseness = 20;

// SPEED
var speed = {
    value: 2,
    changer: 0,
    step: 0.1
};
    speed.increase = function () {
        this.value += this.step;
    };
    speed.setChanger = function (changer) {
        this.changer = changer;
    };
    speed.getChanger = function() {
        return this.changer;
    };
    speed.getValue = function () {
        return this.value + this.changer;
    };

var increaseSpeed = setInterval(function() {
    speed.increase();
}, 5000);

// collections
var stones = [],
    fragments = [],
    coins = [];

var bonuses = [];
var caughtBonuses = [];

// coordinates of sphere destination point
var destPoint = {x: 0, y: 0};

// sphere
var sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhongMaterial({color: 0xffffff}));
sphere.overdraw = true;
sphere.isInvulnerability = false;
scene.add(sphere);

//////////////////////////////////////////////
// ON RENDER 
//////////////////////////////////////////////

// render the scene
onRenderFcts.push(function(){
    renderer.render(scene, camera);
});

onRenderFcts.push(function(){
    if (speed.getChanger() > 0) {
        camera.position.z = Math.min(camera.position.z += 0.1, 12);
        composer.render();
    } else if (speed.getChanger() < 0) {
        camera.position.z = Math.max(camera.position.z -= 0.1, 8);
        composer.render();
    } else {
        var delta = 10 - camera.position.z;
        if (delta < 0) {
            camera.position.z = Math.max(camera.position.z -= 0.1, 10);
        } else {
            camera.position.z = Math.min(camera.position.z += 0.1, 10);
        }
    }

});
// stone life cicle, rotation and moving
onRenderFcts.push(function() {
    stones.forEach(function(el, ind, arr){
    el.rotation.y += 0.007;
    el.rotation.x += 0.007;
    el.position.z += 0.1 * speed.getValue();
    if (el.position.z > dieCoord) {
        scene.remove(el);
    } 
    if (el.position.z > opacityCoord) {
        el.material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading, transparent: true, opacity: 0.75});
    }
    var distanceBerweenCenters = getDistance(el.position.x,
        el.position.y,
        el.position.z,
        sphere.position.x,
        sphere.position.y,
        sphere.position.z),
        radiusesSum = sphere.geometry.radius + el.geometry.radius;
                
    if (distanceBerweenCenters < radiusesSum) {
        scene.remove(el);
        arr.splice(ind, 1);
        currentHelth = changeHelth(currentHelth, -19);
        // вызвать вспышку экрана
        hit();
        // генерировать осколки
        generateFragments(scene, fragments, el.position.x, el.position.y, el.position.z);
    }
    });
});
// stones lifecicle
onRenderFcts.push(function() {
    if (!stones.length) {
        generateStone(scene, stones, spawnCoord);
    }
    var el = stones[stones.length -1];
    if (getDistance(0, 0, spawnCoord, el.position.x, el.position.y, el.position.z) > stonesCloseness) {
        generateStone(scene, stones, spawnCoord);
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
            el.position.z += 0.1 * speed.getValue();
            if (el.position.z > dieCoord) {
                scene.remove(el);
                arr.splice(ind, 1);
            }
        });
    }
});
// coins lifecicle
onRenderFcts.push(function() {
    if (!coins.length) {
        x = genCoord();
        y = genCoord();
        for (var i = 0; i < 10; i++) {
            genCoins(scene, coins, spawnCoord - i * 5, x, y, i * 0.25);
        }
    }
    if (coins.length) {
        coins.forEach(function(el, ind, arr) {
            el.rotation.z += 0.05;
            el.position.z += 0.1 * speed.getValue();
            if (el.position.z > dieCoord) {
                scene.remove(el);
                arr.splice(ind, 1);
            }
            if (el.position.z > opacityCoord) {
                el.material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading, transparent: true, opacity: 0.5});
            }
            if (getDistance(
                el.position.x, el.position.y, el.position.z,
                sphere.position.x, sphere.position.y, sphere.position.z) < 0.9) {
                scene.remove(el);
                arr.splice(ind, 1);
                currentScore = changeScore(currentScore, 1);
            }
        });
    }
});
// sphere moving
onRenderFcts.push(function() {
    moveSphere(sphere, destPoint);
    light.position.x = sphere.position.x
    light.position.y = sphere.position.y;
    sphereLight.position.x = sphere.position.x
    sphereLight.position.y = sphere.position.y;
});
// bonuses lifecicle
onRenderFcts.push(function(){
    if (!bonuses.length) {
        x = genCoord();
        y = genCoord();
        genBonus(scene, bonuses, -110, x, y, listOfModels);
    }
    if (bonuses.length) {
        bonuses.forEach(function(el, ind, arr) {
            if (el.type === 0) {
                el.rotation.z += 0.05;
            }
            if (el.type === 1) {
                el.rotation.z += 0.05;
            }
            if (el.type === 2) {
                el.rotation.y += 0.05;
            }
            // el.rotation.z += 0.05;
            el.position.z += 0.1 * speed.getValue();
            if (el.position.z > dieCoord) {
                scene.remove(el);
                arr.splice(ind, 1);
            }
            if (el.position.z > opacityCoord) {
                el.material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading, transparent: true, opacity: 0.5});
            }
            if (getDistance(
                el.position.x, el.position.y, el.position.z,
                sphere.position.x, sphere.position.y, sphere.position.z) < 0.9) {
                scene.remove(el);
                arr.splice(ind, 1);
                catchBonus(el.type);
            }
        });
    }
});
var arr1 = [];
genBonus(scene, arr1, 1, 0, 0, listOfModels);