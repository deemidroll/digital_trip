    DT.CoinsCollection = function () {
        if (!DT.CoinsCollection.__instance) {
            DT.CoinsCollection.__instance = this;
        } else {
            return DT.CoinsCollection.__instance;
        }
        DT.Collection.apply(this, [{
            constructor: DT.Coin
        }]);
    };
    DT.CoinsCollection.prototype = Object.create(DT.Collection.prototype);
    DT.CoinsCollection.prototype.constructor = DT.CoinsCollection;

    DT.CoinsCollection.prototype.createObjects = function (options) {
        DT.Collection.prototype.createObjects.apply(this, arguments);
        if (!this.collection.length) {
            for (var i = 0; i < options.number; i++) {
                options.zAngle = i * 0.25;
                options.z = options.spawnCoord - i * 10;
                new this.constructor(options);
            }
        }
        return this;
    };
    $(document).on('update', function (e, data) {
        new DT.CoinsCollection()
            .createObjects({
                x: DT.genCoord(),
                y: -2.5,
                spawnCoord: DT.game.param.spawnCoord,
                zAngle: 0,
                number: 10
            })
            .update({
                dieCoord: DT.game.param.dieCoord,
                opacityCoord: DT.game.param.opacityCoord,
                sphere: DT.sphere
            });
    });