var genBonus = function (scene, arr, spawnCoord, x, y, zAngle) {
    var type = Math.round(Math.random() * 2);
    var type = 2;
    var geometry, material;
    if (type === 0) {
        geometry = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32, 1);
        material = new THREE.MeshLambertMaterial({color: 0x8b00ff});
    }
    if (type === 1) {
        geometry = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32, 1);
        material = new THREE.MeshLambertMaterial({color: 0x00ff00});
    }
    if (type === 2) {
        geometry = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32, 1);
        material = new THREE.MeshLambertMaterial({color: 0xff00ff});
    }

        bonus = new THREE.Mesh( geometry, material );
        bonus.position.x = x;
        bonus.position.y = y;
        bonus.position.z = Math.random() * 4 + spawnCoord;;
        bonus.rotation.x = 1.5;
        bonus.rotation.y = 0;
        bonus.rotation.z = zAngle || 0;

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
                }, 3000);
            }
        } else {
            caughtBonuses.length = 0;
            caughtBonuses.push(type);
        }
        showBonuses(caughtBonuses);
        console.log(caughtBonuses);
};
String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}
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
        $(".bonus").fadeOut(3000, function(){
            $(".bonus").text("").fadeIn(100);
        });
    }
};