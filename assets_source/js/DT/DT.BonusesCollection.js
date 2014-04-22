    DT.BonusesCollection = function (options) {
        if (!DT.BonusesCollection.__instance) {
            DT.BonusesCollection.__instance = this;
        } else {
            return DT.BonusesCollection.__instance;
        }
        DT.Collection.apply(this, [{
            constructor: DT.Bonus
        }]);
    };
    DT.BonusesCollection.prototype = Object.create(DT.Collection.prototype);
    DT.BonusesCollection.prototype.constructor = DT.BonusesCollection;

    DT.BonusesCollection.prototype.createObjects = function (options) {
        DT.Collection.prototype.createObjects.apply(this, arguments);
        if (!this.collection.length) {
            for (var i = 0; i < options.number; i++) {
                new this.constructor(options);
            }
        }
        return this;
    };
    $(document).on('update', function (e, data) {
        new DT.BonusesCollection()
            .createObjects({
                x: DT.genCoord(),
                y: -2.5,
                spawnCoord: DT.game.param.spawnCoord,
            })
            .update({
                dieCoord: DT.game.param.dieCoord,
                opacityCoord: DT.game.param.opacityCoord,
                sphere: DT.sphere
            });
    });