// ███████╗██╗  ██╗██╗███████╗██╗     ██████╗ 
// ██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗
// ███████╗███████║██║█████╗  ██║     ██║  ██║
// ╚════██║██╔══██║██║██╔══╝  ██║     ██║  ██║
// ███████║██║  ██║██║███████╗███████╗██████╔╝
// ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝ 
                                           
    DT.Shield = function (options) {
        if (!DT.Shield.__instance) {
            DT.Shield.__instance = this;
        } else {
            return DT.Shield.__instance;
        }
        DT.GameObject.apply(this, arguments);
        this.material.color = options.sphere.material.color;
        this.tObject.position = options.sphere.position;
    };
    DT.Shield.prototype = Object.create(DT.GameObject.prototype);
    DT.Shield.prototype.constructor = DT.Shield;