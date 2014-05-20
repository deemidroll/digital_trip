;(function () {
    var isWebGLSupported,
        text;
    if (!window.WebGLRenderingContext) {
        // Browser has no idea what WebGL is
        isWebGLSupported = false;
        text = 'get a new browser <a href="http://get.webgl.org">http://get.webgl.org</a>';
    } else if (!document.getElementById('compare').getContext("webgl")) {
        isWebGLSupported = false;
        text = 'update your drivers or get a new browser <a href="http://get.webgl.org/troubleshooting">http://get.webgl.org/troubleshooting</a>';
    } else {
        isWebGLSupported = true;
    }
    if (isWebGLSupported) {
        yepnope.loadCounter = 0;
        yepnope.percent = 0;
        yepnope.showLoading = function (n) {
            yepnope.percent += 20;
            yepnope.loadCounter += 1;
            $(function () {
                $(".loading").animate({minWidth: yepnope.percent+"px"}, {
                    duration: 100,
                    progress: function () {
                        var current = parseInt($(".loading").css("minWidth"), 10);
                        $(".startGame").html(Math.floor(current));
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
                }
            }
        }]);
    } else {
        document.getElementById('loading').innerHTML = 'sorry, webgl does not supported <br/> :( <br/>' + text;
    }
})();