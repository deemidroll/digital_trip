$(function(){
    $(".menu_button").click(function() {
        $(".menu_page").css({"display": "table"});
        cancelAnimationFrame(id);
    });
    $(".menu_page").click(function() {
        $(".menu_page").css({"display": "none"});

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
});