// ██████╗ ██╗      █████╗ ██╗   ██╗███████╗██████╗ 
// ██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗
// ██████╔╝██║     ███████║ ╚████╔╝ █████╗  ██████╔╝
// ██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗
// ██║     ███████╗██║  ██║   ██║   ███████╗██║  ██║
// ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
                                                 
    DT.Player = function (options) {
        if (!DT.Player.__instance) {
            DT.Player.__instance = this;
        } else {
            return DT.Player.__instance;
        }
        this.currentHelth = options.currentHelth || 100;
        this.currentScore = options.currentScore || 0;
        this.destPoint = options.destPoint || {x: 0, y: 0};
        this.isInvulnerability = options.isInvulnerability || false;
        this.isFun = options.isFun || false;
        this.invulnerTimer = null;
        this.funTimer = null;
    };

    DT.Player.prototype.changeHelth = function(delta) {
        if (delta > 0 || this.isInvulnerability === false) {
            var helth = this.currentHelth;
            if (helth > 0) {
                helth += delta;
                if (helth < 0) {
                    helth = 0;
                    $(document).trigger('gameOver', {});
                }
                if (helth > 100) {
                    helth = 100;
                }
            }
            this.currentHelth = helth;
            $(document).trigger('changeHelth', {helth: this.currentHelth});
        }
        return this;
    };

    DT.Player.prototype.makeInvuler = function (time) {
        this.invulnerTimer = (time || 10000) / 1000 * 60;
        this.isInvulnerability = true;
        $(document).trigger('invulner', {invulner: true});
        return this;
    };

    DT.Player.prototype.stopInvulner = function () {
        this.invulnerTimer = 0;
        return this;
    };

    DT.Player.prototype.changeScore = function(delta) {
        this.currentScore += delta;
        $(document).trigger('changeScore', {score: this.currentScore});
        return this;
    };

    DT.Player.prototype.makeFun = function(time) {
        this.isFun = true;
        this.funTimer = (time || 10000) / 1000 * 60;
        $(document).trigger('fun', {isFun: true});
        return this;
    };

    DT.Player.prototype.stopFun = function () {
        this.funTimer = 0;
        return this;
    };

    DT.Player.prototype.updateInvulnerability = function () {
        if (this.isInvulnerability) {
            this.invulnerTimer -= 1;
            if (this.invulnerTimer <= 0) {
                this.isInvulnerability = false;
                $(document).trigger('invulner', {invulner: false});
            } else {
                return this;
            }
        }
        return this;
    };

    DT.Player.prototype.updateFun = function () {
        if (this.isFun) {
            this.funTimer -= 1;
            if (this.funTimer <= 0) {
                this.isFun = false;
                $(document).trigger('fun', {isFun: false});
                clearInterval(DT.rainbow);
                DT.blink.doBlink('red', 5);
            } else if (this.funTimer % 6 === 0) {
                var color = new THREE.Color().setRGB(
                    DT.genRandomFloorBetween(0, 3),
                    DT.genRandomFloorBetween(0, 3),
                    DT.genRandomFloorBetween(0, 3)
                );
                DT.blink.doBlink(color, 10);
            }
        }
        return this;
    };

    DT.Player.prototype.update = function () {
        this.updateInvulnerability();
        this.updateFun();
        return this;
    };

    DT.Player.prototype.reset = function () {
        this.currentHelth = 100;
        this.currentScore = 0;
        this.destPoint = {x: 0, y: -2.5};
        this.isInvulnerability = false;
        this.isFun = false;
        return this;
    };