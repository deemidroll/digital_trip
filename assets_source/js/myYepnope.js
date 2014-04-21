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
        "js/game.min.js",
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