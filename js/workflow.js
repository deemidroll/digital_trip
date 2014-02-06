var Stone = function (spawnCoord, radius) {
    var counter = 0,
        spawnCoord = spawnCoord || -20;
    this.radius = radius || 0.5;
    this.geometry = new THREE.IcosahedronGeometry(this.radius, 0);
    this.material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.x = Math.random() * 4 - 1;
    this.mesh.position.y = Math.random() * 4 - 1;
    this.mesh.position.z = Math.random() * 4 + spawnCoord;
    this.mesh.rotation.x = Math.random();
    this.mesh.rotation.y = Math.random();
}