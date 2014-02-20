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
        requestAnimationFrame(function animate(nowMsec) {
            // keep looping
            id = requestAnimationFrame(animate);
            // measure time
            lastTimeMsec    = lastTimeMsec || nowMsec-1000/60;
            var deltaMsec   = Math.min(200, nowMsec - lastTimeMsec);
            lastTimeMsec    = nowMsec;
            // call each update function
            onRenderFcts.forEach(function(onRenderFct) {
                onRenderFct(deltaMsec/1000, nowMsec/1000);
            });
        });
    });
    $(".music_button").click(function() {
        if (globalVolume) {
            gainNodes[0].gain.value = gainNodes[1].gain.value = globalVolume = 0;
            $(".music_button").html("N");
        } else {
            gainNodes[0].gain.value = gainNodes[1].gain.value = globalVolume = 1;
            $(".music_button").html("M");
        }
    });
});