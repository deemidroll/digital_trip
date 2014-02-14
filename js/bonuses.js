var genBonus = function (scene, arr, spawnCoord, x, y, listOfModels) {
    var type = Math.round(Math.random() * 2);
    // var type = 2;
    var geometry, material;

    geometry = listOfModels[type].geometry;
    material = listOfModels[type].material;

    bonus = new THREE.Mesh( geometry, material );
    bonus.position.x = x;
    bonus.position.y = y;
    bonus.position.z = spawnCoord * 2;

    bonus.scale.x = listOfModels[type].scale.x || 1;
    bonus.scale.y = listOfModels[type].scale.y || 1;
    bonus.scale.z = listOfModels[type].scale.z || 1;

    bonus.rotation.x = listOfModels[type].rotation.x || 0;
    bonus.rotation.y = listOfModels[type].rotation.y || 0;
    bonus.rotation.z = listOfModels[type].rotation.z || 0;

    bonus.type = type;

    arr.push(bonus);
    scene.add(bonus);
};

var useBonuses = function (type) {
    // helth
    if (type === 0) currentHelth = changeHelth(currentHelth, 100 - currentHelth);
    // invulnerability
    if (type === 1) dontFeelPain(10000);
    // entertainment
    if (type === 2) makeFun();
};

var catchBonus = function (type) {
        if (!caughtBonuses.length || caughtBonuses[0] === type) {
            caughtBonuses.push(type);
            if (caughtBonuses.length === 3) {
                useBonuses(type);
                var refreshBonus = setTimeout(function() {
                    caughtBonuses.length = 0;
                    clearTimeout(refreshBonus);
                }, 100);
            }
        } else {
            caughtBonuses.length = 0;
            caughtBonuses.push(type);
        }
        showBonuses(caughtBonuses);
};

var showBonuses = function (arr) {
    var n = arr.length;
    $(function(){
        $(".bonus").text(function(){
            if (arr[0] === 0) return "H ".repeat(n);
            if (arr[0] === 1) return "I ".repeat(n);
            if (arr[0] === 2) return "E ".repeat(n);
        });
    });
    if (n === 3) {
        $(".bonus").fadeOut(300, function(){
            $(".bonus").text("").fadeIn(100);
        });
    }
};