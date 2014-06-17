$(function () {
    var isWebGLSupported,
        canvas = document.getElementById('chreckwebgl');
    if (!window.WebGLRenderingContext) {
        // Browser has no idea what WebGL is
        isWebGLSupported = false;
    } else if (canvas.getContext("webgl") || canvas.getContext("webGlCanvas") || canvas.getContext("moz-webgl") || canvas.getContext("webkit-3d")) {
        // Can't get context
        isWebGLSupported = true;
    } else {
        isWebGLSupported = false;
    }
    if (isWebGLSupported) {
        var $body = $('body'),
            $cc = $('.choose_control'),
            maxBlur = 100,
            isWebkitBlurSupported;
        // if ($body[0].style.webkitFilter === undefined || $body[0].style.filter === undefined) $('#loader').css({'background-color': 'rgba(0,0,0,0.8)'});
        if ($body[0].style.webkitFilter === undefined) {
            isWebkitBlurSupported = false;
            $cc.css({filter: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"blur-overlay\"><feGaussianBlur stdDeviation=\"" + maxBlur + "\"/></filter></svg>#blur-overlay')"});
        } else {
            isWebkitBlurSupported = true;
            $body[0].style.webkitFilter = 'blur(' + maxBlur + 'px)';
        }
        $('#loader').css({display: 'table'});
        yepnope.loadCounter = 0;
        yepnope.percent = 0;
        yepnope.showLoading = function (n) {
            yepnope.percent += maxBlur/3;
            yepnope.loadCounter += 1;
            $(".loader").animate({minWidth: Math.round(yepnope.percent)+"px"}, {
                duration: 1000,
                progress: function () {
                    var current = parseInt($(".loader").css("minWidth"), 10) * 100/maxBlur;
                    $("title").html(Math.floor(current) + "% " + "digital trip");
                    if (isWebkitBlurSupported) $body[0].style.webkitFilter = 'blur('+ (maxBlur - current)+ 'px)';
                    if (!isWebkitBlurSupported && current % 20 === 0) $cc.css({filter: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"blur-overlay\"><feGaussianBlur stdDeviation=\"" + (maxBlur - maxBlur/4*n) + "\"/></filter></svg>#blur-overlay')"});
                    if (current === 100) {
                        $("title").html("digital trip");
                        if (!isWebkitBlurSupported && current % 20 === 0) $cc.css({filter: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"blur-overlay\"><feGaussianBlur stdDeviation=\"" + 0 + "\"/></filter></svg>#blur-overlay')"});
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