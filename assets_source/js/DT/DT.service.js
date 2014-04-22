// ███████╗███████╗██████╗ ██╗   ██╗██╗ ██████╗███████╗    ███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗
// ██╔════╝██╔════╝██╔══██╗██║   ██║██║██╔════╝██╔════╝    ██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
// ███████╗█████╗  ██████╔╝██║   ██║██║██║     █████╗      █████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║
// ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██║██║     ██╔══╝      ██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║
// ███████║███████╗██║  ██║ ╚████╔╝ ██║╚██████╗███████╗    ██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
// ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝    ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
                                                                                                                          
    DT.genRandomFloorBetween = function (min, max) {
        var rand = min - 0.5 + Math.random()*(max-min+1);
        rand = Math.round(rand);
        return rand;
    };

    DT.genRandomBetween = function (min, max) {
        return Math.random() * (max - min) + min;
    };

    DT.getSign = function () {
        var signVal = Math.random() - 0.5;
        return Math.abs(signVal)/signVal;
    };
    
    // возвращает cookie с именем name, если есть или undefined
    DT.getCookie = function (name) {
        var matches = document.cookie.match(
            new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
        );
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    DT.getDistance = function (x1, y1, z1, x2, y2, z2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2));
    };
    
    DT.genCoord = function(delta) {
        var offset = delta || DT.game ? DT.game.param.spacing : 3,
        x = Math.random() * offset * 2 - offset,
        absX = Math.abs(x);
        if (absX <= offset && absX >= offset * 0.33 ) {
            if (x > 0) {
                return offset;
            }
            if (x < 0) {
                return offset * -1;
            }
        } else {
            return 0;
        }
    };