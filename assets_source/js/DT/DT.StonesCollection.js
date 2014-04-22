    DT.StonesCollection = function () {
        if (!DT.StonesCollection.__instance) {
            DT.StonesCollection.__instance = this;
        } else {
            return DT.StonesCollection.__instance;
        }
        DT.Collection.apply(this, [{
            constructor: DT.Stone
        }]);
    };
    DT.StonesCollection.prototype = Object.create(DT.Collection.prototype);
    DT.StonesCollection.prototype.constructor = DT.StonesCollection;

    DT.StonesCollection.prototype.createObjects = function (options) {
        DT.Collection.prototype.createObjects.apply(this, arguments);
        var el = this.collection[this.collection.length -1];

        if (el) {
            var dist = DT.getDistance(0, 0, DT.game.param.spawnCoord,
                el.tObject.position.x, el.tObject.position.y, el.tObject.position.z);
            if (dist <= DT.game.param.stonesCloseness) {
                return this;
            }
        }
        for (var i = 0; i < options.number; i++) {
            new this.constructor(options);
        }
        return this;
    };
    $(document).on('update', function (e, data) {
        new DT.StonesCollection()
            .createObjects({
                spawnCoord: DT.game.param.spawnCoord,
            })
            .update({
                dieCoord: DT.game.param.dieCoord,
                opacityCoord: DT.game.param.opacityCoord,
                sphere: DT.sphere
            });
    });