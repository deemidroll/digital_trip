// ██████╗ ██╗   ██╗███████╗████████╗
// ██╔══██╗██║   ██║██╔════╝╚══██╔══╝
// ██║  ██║██║   ██║███████╗   ██║   
// ██║  ██║██║   ██║╚════██║   ██║   
// ██████╔╝╚██████╔╝███████║   ██║   
// ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   
                                  
    DT.Dust = function (options) {
        DT.GameObject.apply(this, arguments);
        this.number = options.number || 100;
    };
    DT.Dust.prototype = Object.create(DT.GameObject.prototype);
    DT.Dust.prototype.constructor = DT.Dust;

    DT.Dust.prototype.create = function () {
        for (var i = 0; i < this.number; i++) {
            this.geometry.vertices.push(new THREE.Vector3(
                DT.genRandomBetween(-10, 10),
                DT.genRandomBetween(-10, 10),
                DT.genRandomBetween(-100, 0)
            ));
        }
        this.material.visible = false;
        return this;
    };

    DT.Dust.prototype.updateMaterial = function (options) {
        if (!this.material.visible) {
            this.material.visible = true;
        }
        this.material.color = options.isFun ? options.color : new THREE.Color().setRGB(
            options.valueAudio/1/1 || 70/255,
            options.valueAudio/255/1 || 68/255,
            options.valueAudio/255/1 || 81/255
        );
        return this;
    };

    DT.Dust.prototype.updateGeometry = function (options) {
        this.geometry.vertices.forEach(function (el) {
            el.z += options.speed;
            if (el.z > 10) {
                el.x = DT.genRandomBetween(-10, 10);
                el.y = DT.genRandomBetween(-10, 10);
                el.z = -100;
            }
        });
        this.geometry.verticesNeedUpdate = true;
        return this;
    };