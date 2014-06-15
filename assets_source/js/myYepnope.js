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
            console.log(Math.round(yepnope.percent));
            $(".loading").animate({minWidth: Math.round(yepnope.percent)+"px"}, {
                duration: 100,
                progress: function () {
                    var current = parseInt($(".loading").css("minWidth"), 10);
                    $("title").html(Math.floor(current) + "% " + "digital trip");
                    if (current === 100) {
                        $("title").html("digital trip");
                    }
                },
                complete: function () {
                    if (n === 3) {
                        DT.runApp();
                        // clearInterval(loadInterval);
                    }
                }
            });
        };
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