yepnope([{
    load: [
        "js/vendor/jquery.min.js",
        "js/vendor/three.min.js",
        "js/vendor/Detector.js",
        "js/vendor/threex.windowresize.js",
        "js/vendor/fireworks-bundle.js",
        "js/vendor/Stats.js",
        "js/vendor/webaudio.js",
        "socket.io/socket.io.js"
    ],
    callback: {
        "jquery.min.js": function () {
            console.log("jquery.min.js loaded!");
        },
        "three.min.js": function () {
            console.log("three.min.js loaded!");
        },
        "Detector.js": function () {
            console.log("Detector.js loaded!");
        },
        "threex.windowresize.js": function () {
            console.log("threex.windowresize.js loaded!");
        },
        "fireworks-bundle.js": function () {
            console.log("fireworks-bundle.js loaded!");
        },
        "Stats.js": function () {
            console.log("Stats.js loaded!");
        },
        "webaudio.js": function () {
            console.log("webaudio.js loaded!");
        },
        "socket.io.js": function () {
            console.log("socket.io.js loaded!");
        },
        "init.js": function () {
            console.log("init.js loaded!");
        },
        "main.js": function () {
            console.log("main.js loaded!");
        }
    }
}, {
    load: "js/init.js"
}, {
    load: "js/main.js"
}]);