// ██████╗  ██████╗ ███╗   ██╗██╗   ██╗███████╗
// ██╔══██╗██╔═══██╗████╗  ██║██║   ██║██╔════╝
// ██████╔╝██║   ██║██╔██╗ ██║██║   ██║███████╗
// ██╔══██╗██║   ██║██║╚██╗██║██║   ██║╚════██║
// ██████╔╝╚██████╔╝██║ ╚████║╚██████╔╝███████║
// ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚══════╝
                                            
    DT.Bonus = function (options) {
        this.type = DT.genRandomFloorBetween(0, 2);
        DT.GameCollectionObject.apply(this, [{
            geometry: DT.listOfModels[this.type].geometry,
            material: DT.listOfModels[this.type].material,
            THREEConstructor: THREE.Mesh,
            collection: options.collection
        }]);
        this.setParam('position', {
                x: options.x,
                y: options.y,
                z: options.spawnCoord * 2
            })
            .setParam('scale', {
                x: DT.listOfModels[this.type].scale.x || 1,
                y: DT.listOfModels[this.type].scale.y || 1,
                z: DT.listOfModels[this.type].scale.z || 1
            })
            .setParam('rotation', {
                x: DT.listOfModels[this.type].rotation.x || 0,
                y: DT.listOfModels[this.type].rotation.y || 0,
                z: DT.listOfModels[this.type].rotation.z || 0
            })
            .createAndAdd();
        // TODO: сделать расширяемой возможность анимации
        if (this.type === 2) {
            DT.animation = new THREE.MorphAnimation(this.tObject);
            DT.animation.play();
        }
    };
    DT.Bonus.prototype = Object.create(DT.GameCollectionObject.prototype);
    DT.Bonus.prototype.constructor = DT.Bonus;

    DT.Bonus.prototype.update = function (options) {
        if (this.type === 0) {
            this.updateParam('rotation', {z: 0.05});
        }
        if (this.type === 1) {
            this.updateParam('rotation', {z: 0.05});
        }
        if (this.type === 2) {
            // this.updateParam('rotation', {z: 0.05});
        }
        
        this.updateParam('position', {z: DT.game.speed.getValue()});
        DT.GameCollectionObject.prototype.update.apply(this, arguments);
        if (DT.getDistance(this.tObject.position.x, this.tObject.position.y, this.tObject.position.z,
                options.sphere.position.x, options.sphere.position.y, options.sphere.position.z) < 1.0) {
            
            if (this.type === 0) {
                this.tObject.rotation.x += 0.2;
            }
            if (this.type === 1) {
                this.tObject.rotation.y += 0.2;
            }
            if (this.type === 2) {
                // this.tObject.rotation.z += 0.2;
            }
            
            this.tObject.scale.x *= 0.9;
            this.tObject.scale.y *= 0.9;
            this.tObject.scale.z *= 0.9;
            
            if (DT.getDistance(this.tObject.position.x, this.tObject.position.y, this.tObject.position.z,
                    options.sphere.position.x, options.sphere.position.y, options.sphere.position.z) < 0.9) {
                this.removeFromScene();
                DT.catchBonus(this.type);
            }
        }
    };