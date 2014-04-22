 // ██████╗  █████╗ ███╗   ███╗███████╗     ██████╗ ██████╗      ██╗███████╗ ██████╗████████╗
// ██╔════╝ ██╔══██╗████╗ ████║██╔════╝    ██╔═══██╗██╔══██╗     ██║██╔════╝██╔════╝╚══██╔══╝
// ██║  ███╗███████║██╔████╔██║█████╗      ██║   ██║██████╔╝     ██║█████╗  ██║        ██║   
// ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝      ██║   ██║██╔══██╗██   ██║██╔══╝  ██║        ██║   
// ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗    ╚██████╔╝██████╔╝╚█████╔╝███████╗╚██████╗   ██║   
 // ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝     ╚═════╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   
                                                                                          
    DT.GameObject = function (options) {
        this.tObject = new options.THREEConstructor(
            options.geometry,
            options.material
        );
        this.geometry = this.tObject.geometry;
        this.material = this.tObject.material;
        this.scene = options.scene || DT.scene;
    };
    DT.GameObject.prototype.addToScene = function () {
        this.scene.add(this.tObject);
        return this;
    };
    DT.GameObject.prototype.removeFromScene = function () {
        this.scene.remove(this.tObject);
        return this;
    };
    DT.GameObject.prototype.create = function () {
        // empty method
        console.log('try to call empty method');
        return this;
    };
    DT.GameObject.prototype.createAndAdd = function () {
        return this.create()
            .addToScene();
    };
    DT.GameObject.prototype.update = function (options) {
        return this.updateGeometry(options.geometry)
            .updateMaterial(options.material);
    };
    DT.GameObject.prototype.updateGeometry = function (options) {
        // empty method
        console.log('try to call empty method');
        return this;
    };
    DT.GameObject.prototype.updateMaterial = function (options) {
        // empty method
        console.log('try to call empty method');
        return this;
    };
    DT.GameObject.prototype.updateParam = function (param, options) {
        for (var prop in options) if (options.hasOwnProperty(prop)) {
            this.tObject[param][prop] += options[prop];
        }
        return this;
    };
    DT.GameObject.prototype.setParam = function (param, options) {
        for (var prop in options) if (options.hasOwnProperty(prop)) {
            this.tObject[param][prop] = options[prop];
        }
        return this;
    };