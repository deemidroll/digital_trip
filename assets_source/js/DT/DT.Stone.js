// ███████╗████████╗ ██████╗ ███╗   ██╗███████╗
// ██╔════╝╚══██╔══╝██╔═══██╗████╗  ██║██╔════╝
// ███████╗   ██║   ██║   ██║██╔██╗ ██║█████╗  
// ╚════██║   ██║   ██║   ██║██║╚██╗██║██╔══╝  
// ███████║   ██║   ╚██████╔╝██║ ╚████║███████╗
// ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚══════╝
                                            
    DT.Stone = function (options) {
        var radius, color, x, y, depth, geometry, material,
            part = Math.random();
        // 
        if (part >= 0 && part < 0.16) {
            x = DT.genRandomBetween(-15, -5);
            y = DT.genRandomBetween(-15, -5);
        } else if (part >= 0.16 && part < 0.32){
            x = DT.genRandomBetween(5, 15);
            y = DT.genRandomBetween(5, 15);
        } else {
            x = DT.genRandomBetween(-5, 5);
            y = DT.genRandomBetween(-5, 5);
        }
        //
        if (Math.abs(x) > 5 || Math.abs(y) > 5) {
            radius = DT.genRandomBetween(1.5, 3);
            color = new THREE.Color(0x464451);
        } else {
            radius = DT.genRandomBetween(1, 2);
            depth = DT.genRandomFloorBetween(80, 100) / 255;
            color = new THREE.Color().setRGB(depth, depth, depth);
        }
        geometry = new THREE.IcosahedronGeometry(radius, 0);
        material = new THREE.MeshPhongMaterial({
            shading: THREE.FlatShading,
            color: color,
            specular: 0x111111,
            shininess: 100
        });
        DT.GameCollectionObject.apply(this, [{
            geometry: geometry,
            material: material,
            THREEConstructor: THREE.Mesh,
            collection: options.collection
        }]);
        this.setParam('position', {
            x: x,
            y: y,
            z: options.spawnCoord
        })
        .setParam('rotation', {
            x: Math.random(),
            y: Math.random()
        })
        .createAndAdd();
        this.distanceToSphere = null;
    };
    DT.Stone.prototype = Object.create(DT.GameCollectionObject.prototype);
    DT.Stone.prototype.constructor = DT.Stone;

    DT.Stone.prototype.update = function (options) {
        DT.GameCollectionObject.prototype.update.apply(this, arguments);
        var el = this.tObject;
        this.distanceToSphere = el.position.distanceTo(options.sphere.position);
        this.minDistance = options.sphere.geometry.radius + el.geometry.radius;
            
        if (this.distanceToSphere < this.minDistance) {
            DT.audio.sounds.stoneDestroy.play();
            DT.sendSocketMessage({
                type: 'vibr',
                time: 200
            });
            this.removeFromScene();

            DT.player.changeHelth(-19);
            // вызвать вспышку экрана
            if (DT.player.isInvulnerability === false) {
                DT.hit();
            }
        }
        if (this.distanceToSphere > this.minDistance && this.distanceToSphere < this.minDistance + 1 && el.position.z - options.sphere.position.z > 1) {
            DT.audio.sounds.stoneMiss.play();
        }
        if (DT.getDistance(options.sphere.position.x, options.sphere.position.y, el.position.z, el.position.x, el.position.y, el.position.z) < this.minDistance) {
            el.material.emissive = new THREE.Color().setRGB(
                el.material.color.r * 0.5,
                el.material.color.g * 0.5,
                el.material.color.b * 0.5);
        } else {
            el.material.emissive = new THREE.Color().setRGB(0,0,0);
        }
        this.updateParam('rotation', {x: 0.014, y: 0.014})
            .updateParam('position', {z: DT.game.speed.getValue()});
        return this;
    };