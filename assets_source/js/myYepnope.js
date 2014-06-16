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
        var $body = $('body');
        if ($body[0].style.webkitFilter === '') $('#loader').css({'background-color': 'transparent'})
        $('#loader').css({display: 'table'});
        yepnope.loadCounter = 0;
        yepnope.percent = 0;
        yepnope.showLoading = function (n) {
            yepnope.percent += 100/3;
            yepnope.loadCounter += 1;
            $(".loader").animate({minWidth: Math.round(yepnope.percent)+"px"}, {
                duration: 1000,
                progress: function () {
                    var current = parseInt($(".loader").css("minWidth"), 10);
                    $("title").html(Math.floor(current) + "% " + "digital trip");
                    $body[0].style.webkitFilter = 'blur('+ (100 - current)+ 'px)'
                    if (current === 100) {
                        $("title").html("digital trip");
                    }
                },
                complete: function () {
                    if (n === 3) {
                        DT.runApp();
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