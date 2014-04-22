 // ██████╗  █████╗ ███╗   ███╗███████╗
// ██╔════╝ ██╔══██╗████╗ ████║██╔════╝
// ██║  ███╗███████║██╔████╔██║█████╗  
// ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  
// ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗
 // ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
                                    
    DT.Game = function () {
        this.param = {
            spacing: 3,
            spawnCoord: -200,
            opacityCoord: 2,
            dieCoord: 30,
            stonesCloseness: 18,
            globalVolume: 1,
            prevGlobalVolume: 1
        };
        this.speed = {
            value: 36,
            changer: 0,
            step: 0.6,
            increase: function () {
                this.value += (this.step / 60);
            },
            setChanger: function (changer) {
                this.changer = changer;
            },
            getChanger: function() {
                return this.changer;
            },
            getValue: function () {
                return (this.value + this.changer) / 60;
            }
        };
        this.wasStarted = false;
        this.wasPaused = false;
        this.wasOver = false;
        this.wasMuted = false;
        this.timer = 0;
    };
    DT.Game.prototype.startGame = function() {
        requestAnimationFrame(DT.animate);
        if (!this.wasStarted) {
            $(document).trigger('startGame', {});
            DT.initKeyboardControl();
        }
    };

    DT.Game.prototype.updateTimer = function () {
        this.timer += 1;
        if (this.timer % 60 === 0) {
            var sec, min;
            sec = this.timer / 60;
            min = Math.floor(sec / 60);
            sec = sec % 60;
            sec = sec < 10 ? '0' + sec.toString() : sec;
            $('.gameTimer').html(min + ':' + sec);
            $('title').html(min + ':' + sec + ' in digital trip');
        }
    };
    DT.Game.prototype.update = function() {
        this.updateTimer();
    };
    DT.Game.prototype.reset = function() {
        $(document).trigger('resetGame', {});
        this.timer = 0;
    };