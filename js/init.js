$(function(){
    $(".menu_button").click(function() {
        $(".menu_page").css({"display": "table"});
        soundPause.update();
        soundPause.play();
        pauseSoundOn();
        cancelAnimationFrame(id);
    });
    $(".menu_page").click(function() {
        $(".menu_page").css({"display": "none"});
        soundPause.update();
        soundPause.play();
        pauseSoundOff();
        startGame();
    });
    $(".music_button").click(function() {
        if (globalVolume) {
            globalVolume = 0;
            $(".music_button").html("N");
        } else {
            globalVolume = 1;
            $(".music_button").html("M");
        }
        gainNodes.forEach(function(el) {
                if (el) {
                    el.gain.value = globalVolume;
                }
        });
    });
});