yepnope.loadCounter = 0;
yepnope.percent = 0;
yepnope.showLoading = function (n) {
    yepnope.percent += 10;
    yepnope.loadCounter += 1;
    $(function () {
        $(".loading").animate({left: yepnope.percent+"px"}, {
            duration: 100,
            progress: function () {
                var current = parseInt($(".loading").css("left"));
                $(".startGame").html(Math.floor(current));
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
        "js/vendor/Detector.js",
        "js/vendor/threex.windowresize.js",
        "js/vendor/fireworks-bundle.js",
        "js/vendor/Stats.js",
        "js/vendor/webaudio.js",
        "/socket.io/socket.io.js"
    ],
    callback: {
        "jquery.min.js": function () {
            yepnope.showLoading();
        },
        "three.min.js": function () {
            yepnope.showLoading();
        },
        "Detector.js": function () {
            yepnope.showLoading();
        },
        "threex.windowresize.js": function () {
            yepnope.showLoading();
        },
        "fireworks-bundle.js": function () {
            yepnope.showLoading();
        },
        "Stats.js": function () {
            yepnope.showLoading();
        },
        "webaudio.js": function () {
            yepnope.showLoading();
        },
        "socket.io.js": function () {
            yepnope.showLoading();
        },
        "init.js": function () {
            yepnope.showLoading();
        },
        "main.js": function () {
            yepnope.showLoading();
        }
    }
}, {
    load: "js/init.js"
}, {
    load: "js/main.js"
}]);
