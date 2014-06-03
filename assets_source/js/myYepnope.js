;(function () {
    var isWebGLSupported,
        text;
    if (!window.WebGLRenderingContext) {
        // Browser has no idea what WebGL is
        isWebGLSupported = false;
        text = 'get a new browser <a href="http://get.webgl.org">http://get.webgl.org</a>';
    } else if (!document.getElementById('chreckwebgl').getContext("webgl")) {
        isWebGLSupported = false;
        text = 'update your drivers or get a new browser <a href="http://get.webgl.org/troubleshooting">http://get.webgl.org/troubleshooting</a>';
    } else {
        isWebGLSupported = true;
    }
    if (isWebGLSupported) {
        document.getElementById('loader').style.display = 'table';
        yepnope.loadCounter = 0;
        yepnope.percent = 0;
        yepnope.showLoading = function (n) {
            yepnope.percent += 100/7;
            yepnope.loadCounter += 1;
            $(function () {
                if (yepnope.loadCounter < 7) {
                    var count = yepnope.loadCounter;
                    $(".loading img").eq(count-1).fadeOut(200);
                    $(".loading img").eq(count).fadeIn(200);
                }
                $(".loading").animate({minWidth: Math.round(yepnope.percent) + "px"}, {
                    duration: 200,
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
                        }
                    }
                });
            });
        };
        yepnope([{
            load: [
                "js/vendor/jquery.min.js",
                "js/vendor/three.min.js",
                "js/vendor/CurveExtras.js",
                "js/DT.js",
                "../socket.io/socket.io.js"
            ],
            callback: {
                "jquery.min.js": function () {
                    yepnope.showLoading();
                },
                "three.min.js": function () {
                    yepnope.showLoading();
                },
                "js/vendor/CurveExtras.js": function () {
                    yepnope.showLoading();
                },
                "js/DT.js": function () {
                    yepnope.showLoading();
                }
            }
        }]);
    } else {
        document.getElementById('nogame').style.display = 'table';
    }
})();