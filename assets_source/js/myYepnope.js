$(function () {
    var isWebGLSupported;
    if (!window.WebGLRenderingContext) {
        // Browser has no idea what WebGL is
        isWebGLSupported = false;
    } else if (!document.getElementById('chreckwebgl').getContext("webgl")) {
        // Can't get context
        isWebGLSupported = false;
    } else {
        isWebGLSupported = true;
    }
    if (isWebGLSupported) {
        $('#loader').css({display: 'table'});
        yepnope.loadCounter = 0;
        yepnope.percent = 0;
        yepnope.showLoading = function (n) {
            yepnope.percent += 100/3;
            yepnope.loadCounter += 1;
            $(".loading").animate({minWidth: Math.round(yepnope.percent) + "px"}, {
                duration: 100,
                progress: function () {
                    var current = parseInt($(".loading").css("minWidth"), 10);
                    $("title").html(Math.floor(current) + "% " + "digital trip");
                    if (current === 100) {
                        $("title").html("digital trip");
                    }
                }
            });
        };
        var count = 0,
            loadInterval = setInterval(function () {
                if (count < 6) {
                    $(".loading img").eq(count).fadeOut(100);
                    $(".loading img").eq(count+1).delay(50).fadeIn({
                        duration: 100,
                        complete: function () {
                            count++
                        }
                    });
                }
                if (count === 6 && yepnope.loadCounter === 3) {
                    DT.runApp();
                    clearInterval(loadInterval);
                }
            }, 300);
        yepnope([{
            load: [
                "js/vendor/three.min.js",
                "js/vendor/CurveExtras.js",
                "js/DT.js",
                "../socket.io/socket.io.js"
            ],
            callback: {}
        }]);
    } else {
        $('#nogame').css({display: 'table'});
    }
});