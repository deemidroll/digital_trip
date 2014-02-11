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
    });

    $(document).keyup(function() {
        var k = event.keyCode;
        // speedDown
        if (k === 16) {
            speed.setChanger(0);
        }
    });

});