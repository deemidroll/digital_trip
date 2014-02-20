// control
$(function() {
    $(document).keydown(function() {
        var k = event.keyCode;
        // console.log(k);
        // arrows control
        if (k === 38) changeDestPoint(1, 0, destPoint);
        if (k === 40) changeDestPoint(-1, 0, destPoint);
        if (k === 37) changeDestPoint(0, -1, destPoint);
        if (k === 39) changeDestPoint(0, 1, destPoint);
        // speedUp
        if (k === 16) {
            speed.setChanger(1);
        }
        if (k === 17) {
            speed.setChanger(-1);
            stopSound(0);
            playSound(1);
            window.rainbow = setInterval(
                function() {
                    var color;
                    switch (genRandomFloorBetween(0, 5)) {
                        case 0:
                        color = "orange";
                        break;
                        case 1:
                        color = "yellow";
                        break;
                        case 2:
                        color = "green";
                        break;
                        case 3:
                        color = "DeepSkyBlue";
                        break;
                        case 4:
                        color = "blue";
                        break;
                        case 5:
                        color = "DarkSlateBlue";
                        break;
                        default:
                        color = "white";
                        break;
                    }
                    blink.doBlink(color, 1);
                }, 100);
            }
    });

    $(document).keyup(function() {
        var k = event.keyCode;
        // speedDown
        if (k === 16) {
            speed.setChanger(0);
        }
        if (k === 17) {
            speed.setChanger(0);
            stopSound(1);
            playSound(0);
            clearInterval(window.rainbow);
        }
    });

});