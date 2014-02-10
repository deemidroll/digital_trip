require([
    "vendor/jquery.min.js",
    "vendor/three.js/build/three.min.js",
    "vendor/three.js/examples/js/Detector.js",
    "vendor/threex.windowresize.js",
    // "vendor/three.js/examples/CopyShader.js",
    // "vendor/three.js/examples/HorizontalBlurShader.js",
    // "vendor/three.js/examples/VerticalBlurShader.js",
    // "vendor/three.js/examples/EffectComposer.js",
    // "vendor/three.js/examples/MaskPass.js",
    // "vendor/three.js/examples/RenderPass.js",
    // "vendor/three.js/examples/ShaderPass.js",
    "../bower_components/threex.keyboardstate/package.require.js"], function() {
var renderer, scene, camera;
// renderer
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
var el = document.body.appendChild(renderer.domElement);
// camera
camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 50);
camera.position.x = 0;
camera.position.y = 1;
camera.position.z = 10;
// scene
scene = new THREE.Scene();
// declare the rendering loop
var onRenderFcts= [];
// handle window resize events
var winResize   = new THREEx.WindowResize(renderer, camera);

// stats
var currentHelth = 100,
    currentScore = 0;

// serv vars
var spawnCoord = -55,
    // blurCoord = 3,
    opacityCoord = 2,
    dieCoord = 7,
    stonesCloseness = 5,
    speed = 1;

// collection
var stones = [],
    fragments = [],
    coins = [];

// coordinates of sphere destination point
var destPoint = {x: 0, y: 0};

// sphere
var sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhongMaterial({color: 0xffffff}));
sphere.overdraw = true;
scene.add(sphere);

// lightning 0xBE463C
var sphereLight  = new THREE.PointLight(0xffffff, 0.25, 100);
sphereLight.position.set(0, 0, 1);
scene.add(sphereLight);

var light = new THREE.PointLight(0xff0000, 1.5, 7.5);
light.position.set(0, 0, 1);
scene.add(light);

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.25 );
directionalLight.position.set(0, 0, 1);
scene.add(directionalLight);

// create keyboard instance
var keyboard  = new THREEx.KeyboardState();

// change IcosahedronGeometry prototype
THREE.IcosahedronGeometry = function ( radius, detail ) {
    this.radius = radius;
    this.detail = detail;
    var t = ( 1 + Math.sqrt( 5 ) ) / 2;
    var vertices = [
        [ -1,  t,  0 ], [  1, t, 0 ], [ -1, -t,  0 ], [  1, -t,  0 ],
        [  0, -1,  t ], [  0, 1, t ], [  0, -1, -t ], [  0,  1, -t ],
        [  t,  0, -1 ], [  t, 0, 1 ], [ -t,  0, -1 ], [ -t,  0,  1 ]
    ];
    vertices.map(function(item, i, arr) {
        for (var j = 0; j < 2; j++) {
            item[j] *= (Math.random());
        }
    });
    var faces = [
        [ 0, 11,  5 ], [ 0,  5,  1 ], [  0,  1,  7 ], [  0,  7, 10 ], [  0, 10, 11 ],
        [ 1,  5,  9 ], [ 5, 11,  4 ], [ 11, 10,  2 ], [ 10,  7,  6 ], [  7,  1,  8 ],
        [ 3,  9,  4 ], [ 3,  4,  2 ], [  3,  2,  6 ], [  3,  6,  8 ], [  3,  8,  9 ],
        [ 4,  9,  5 ], [ 2,  4, 11 ], [  6,  2, 10 ], [  8,  6,  7 ], [  9,  8,  1 ]
    ];
    THREE.PolyhedronGeometry.call( this, vertices, faces, radius, detail );

};
THREE.IcosahedronGeometry.prototype = Object.create( THREE.Geometry.prototype );

//////////////////////////////////////////////
// SPEED
var keyboardControl = setInterval(function() {
    speed += 0.1;
}, 5000);
//////////////////////////////////////////////
// ON RENDER 
//////////////////////////////////////////////
// render the scene
onRenderFcts.push(function(){
    renderer.render(scene, camera);
});

// stone life cicle, rotation and moving
onRenderFcts.push(function() {
    stones.forEach(function(el, ind, arr){
    el.rotation.y += 0.007;
    el.rotation.x += 0.007;
    el.position.z += 0.1 * speed;
    if (el.position.z > dieCoord) {
        scene.remove(el);
    } 
    if (el.position.z > opacityCoord) {
        el.material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading, transparent: true, opacity: 0.75});
    }
    if (getDistance(
        el.position.x, el.position.y, el.position.z,
        sphere.position.x, sphere.position.y, sphere.position.z) < 0.9) {
        scene.remove(el);
        arr.splice(ind, 1);
        currentHelth = changeHelth(currentHelth, -19, id);
        // вызвать вспышку экрана
        hit();
        // генерировать осколки
        generateFragments(scene, fragments, el.position.x, el.position.y, el.position.z);
    }
    });
});
// stones generation
onRenderFcts.push(function() {
    if (!stones.length) {
        generateStone(scene, stones, spawnCoord);
    }
    var el = stones[stones.length -1];
    if (getDistance(0, 0, spawnCoord, el.position.x, el.position.y, el.position.z) > stonesCloseness) {
        generateStone(scene, stones, spawnCoord);
    }
});
// fragments lifecicle
onRenderFcts.push(function() {
    if (fragments.length) {
        fragments.forEach(function(el, ind, arr) {
            // el.rotation.y += 0.05;
            // el.rotation.x += 0.05;
            el.position.x *= 1.1;
            el.position.y *= 1.1;
            el.position.z += 0.1 * speed;
            if (el.position.z > dieCoord) {
                scene.remove(el);
                arr.splice(ind, 1);
            }
        });
    }
});
//coins generation
onRenderFcts.push(function() {
    if (!coins.length) {
        x = genCoord();
        y = genCoord();
        for (var i = 0; i < 10; i++) {
            genCoins(scene, coins, spawnCoord - i * 5, x, y, i * 0.25);
        }
    }
    if (coins.length) {
        coins.forEach(function(el, ind, arr) {
            el.rotation.z += 0.05;
            el.position.z += 0.1 * speed;
            if (el.position.z > dieCoord) {
                scene.remove(el);
                arr.splice(ind, 1);
            }
            if (el.position.z > opacityCoord) {
                el.material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading, transparent: true, opacity: 0.5});
            }
            if (getDistance(
                el.position.x, el.position.y, el.position.z,
                sphere.position.x, sphere.position.y, sphere.position.z) < 0.9) {
                scene.remove(el);
                arr.splice(ind, 1);
                currentScore = changeScore(currentScore, 1);
            }
        });
    }
});
//sphere moving
onRenderFcts.push(function() {
    moveSphere(sphere, destPoint);
    light.position.x = sphere.position.x
    light.position.y = sphere.position.y;
    sphereLight.position.x = sphere.position.x
    sphereLight.position.y = sphere.position.y;
});
///////////////////////////////////////////////////
// control
// var keyboardControl = setInterval(function() {
//     if (keyboard.pressed('up')) changeDestPoint(1, 0, destPoint);
//     if (keyboard.pressed('down')) changeDestPoint(-1, 0, destPoint);
//     if (keyboard.pressed('left')) changeDestPoint(0, -1, destPoint);
//     if (keyboard.pressed('right')) changeDestPoint(0, 1, destPoint);
// }, 100);
$(function() {
    $(document).keydown(function() {
        var k = event.keyCode;
        if (k === 38) changeDestPoint(1, 0, destPoint);
        if (k === 40) changeDestPoint(-1, 0, destPoint);
        if (k === 37) changeDestPoint(0, -1, destPoint);
        if (k === 39) changeDestPoint(0, 1, destPoint);
    });
});
// Rendering Loop runner
var id;
var lastTimeMsec= null;
    requestAnimationFrame(function animate(nowMsec) {
        // keep looping
        id = requestAnimationFrame(animate);
        // measure time
        lastTimeMsec    = lastTimeMsec || nowMsec-1000/60;
        var deltaMsec   = Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec    = nowMsec;
        // call each update function
        onRenderFcts.forEach(function(onRenderFct) {
            onRenderFct(deltaMsec/1000, nowMsec/1000);
        });
    });

// auxiliary functions
var getDistance = function (x1, y1, z1, x2, y2, z2) {
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)+(z1-z2)*(z1-z2));
};

var genCoord = function(delta) {
    var offset = delta || 2.5;
    var x = Math.random() * offset * 2 - offset;
    var absX = Math.abs(x);
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

var changeHelth = function(currentHelth, delta) {
    var helth = currentHelth;
    if (helth > 0) {
        helth += delta;
        if (helth < 0) {
            helth = 0;
            gameOver();
        }
        if (helth > 100) {
            helth = 100;
        }
    }
    currentHelth = helth;
    $(function(){
        $(".helth").animate({
            width: helth + "%"
        });
    });
    return currentHelth;
};

var changeScore = function(currentScore, delta) {
    currentScore += delta;
    $(function(){
        $(".current_coins").text(currentScore);
    });
    return currentScore;
};

var gameOver = function() {
    $(function(){
        $(".total_coins").text(currentScore);
        $(".game_over").css({"display": "table", "opacity": "0"}).animate({"opacity": "1"}, 500);
    });
    setTimeout(function() {
        cancelAnimationFrame(id);
    }, 500);
    // oneMoreTime();
};

var hit = function() {
    $(function(){
        $(".hit").fadeIn(500).fadeOut(500);
    });
};

var generateStone = function (scene, arr, spawnCoord) {
    var radius = Math.min(Math.random() + 0.25, 0.5);
    var geometry = new THREE.IcosahedronGeometry(radius, 0),
        material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading}),
        polyhedron = new THREE.Mesh( geometry, material );
        polyhedron.position.x = Math.random() * 10 - 5;
        polyhedron.position.y = Math.random() * 10 - 5;
        polyhedron.position.z = Math.random() * 4 + spawnCoord;
        polyhedron.rotation.x = Math.random();
        polyhedron.rotation.y = Math.random();
        arr.push(polyhedron);
        scene.add(polyhedron);
};

var generateFragments = function (scene, arr, x, y, z, numb) {
    var geometry = new THREE.TetrahedronGeometry(0.2, 0),
        material = new THREE.MeshLambertMaterial({shading: THREE.FlatShading}),
        numb = numb || 1.5;
    for (var i = 0; i < 10; i++) {
    var tetrahedron = new THREE.Mesh( geometry, material );
        tetrahedron.position.x = x + Math.random() * numb - 0.5 * numb;
        tetrahedron.position.y = y + Math.random() * numb - 0.5 * numb;
        tetrahedron.position.z = z + Math.random() * numb - 0.5 * numb;
        // tetrahedron.position.z = z;
        tetrahedron.rotation.x = Math.random();
        tetrahedron.rotation.y = Math.random();
        arr.push(tetrahedron);
        scene.add(tetrahedron);
    }
};

var genCoins = function (scene, arr, spawnCoord, x, y, zAngle) {
    var geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32, 1),
        texture = THREE.ImageUtils.loadTexture("./img/avers.png");;
        material = new THREE.MeshLambertMaterial({map:texture}),
        cylinder = new THREE.Mesh( geometry, material );

        cylinder.position.x = x;
        cylinder.position.y = y;
        cylinder.position.z = Math.random() * 4 + spawnCoord;;
        cylinder.rotation.x = 1.5;
        cylinder.rotation.y = 0;
        cylinder.rotation.z = zAngle;
        arr.push(cylinder);
        scene.add(cylinder);
};

var changeDestPoint = function(dy, dx, destPoint) {
    var newPos = dx * 2.5;

    if (destPoint.x < 2.5 && dx > 0) {
        destPoint.x += dx * 2.5;
    }
    if (destPoint.x > -2.5 && dx < 0) {
        destPoint.x += dx * 2.5;
    }
    if (destPoint.y < 2.5 && dy > 0) {
        destPoint.y += dy * 2.5;
    }
    if (destPoint.y > -2.5 && dy < 0) {
        destPoint.y += dy * 2.5;
    }
};

var moveSphere = function(sphere, destPoint) {

    var moveOnAix = function(aix) {
        var dx = destPoint[aix] - sphere.position[aix];
        if (Math.abs(dx) > 0.01) {
            sphere.position[aix] += dx > 0 ? 0.1 : -0.1;
        }
    };

    moveOnAix("x");
    moveOnAix("y");
};
video=document.getElementById('video')
canvas=document.getElementById('canvas2')
console.log(canvas);
_=canvas.getContext('2d')
ccanvas=document.getElementById('comp')
c_=ccanvas.getContext('2d')
navigator.webkitGetUserMedia({audio:true,video:true},function(stream){
    s=stream
    video.src=window.webkitURL.createObjectURL(stream)
    video.addEventListener('play',
        function(){setInterval(dump,1000/25)}
    )
},function(){
    console.log('OOOOOOOH! DEEEEENIED!')
})
compression=5
width=height=0
function dump(){
    if(canvas.width!=video.videoWidth){
        width=Math.floor(video.videoWidth/compression)
        height=Math.floor(video.videoHeight/compression)
        canvas.width=ccanvas.width=width
        canvas.height=ccanvas.height=height
    }
    _.drawImage(video,width,0,-width,height)
    draw=_.getImageData(0,0,width,height)
    //c_.putImageData(draw,0,0)
    skinfilter()
    test()  
}
huemin=0.0
huemax=0.10
satmin=0.0
satmax=1.0
valmin=0.4
valmax=1.0
function skinfilter(){
    
    skin_filter=_.getImageData(0,0,width,height)
    var total_pixels=skin_filter.width*skin_filter.height
    var index_value=total_pixels*4
    
    var count_data_big_array=0;
    for (var y=0 ; y<height ; y++)
    {
        for (var x=0 ; x<width ; x++)
        {
            index_value = x+y*width
            r = draw.data[count_data_big_array]
                    g = draw.data[count_data_big_array+1]
                    b = draw.data[count_data_big_array+2]
                    a = draw.data[count_data_big_array+3]

                    hsv = rgb2Hsv(r,g,b);
                    //When the hand is too lose (hsv[0] > 0.59 && hsv[0] < 1.0)
            //Skin Range on HSV values
            if(((hsv[0] > huemin && hsv[0] < huemax)||(hsv[0] > 0.59 && hsv[0] < 1.0))&&(hsv[1] > satmin && hsv[1] < satmax)&&(hsv[2] > valmin && hsv[2] < valmax)){

                    skin_filter[count_data_big_array]=r
                skin_filter[count_data_big_array+1]=g
                skin_filter[count_data_big_array+2]=b
                skin_filter[count_data_big_array+3]=a
                }else{

                    skin_filter.data[count_data_big_array]=
                skin_filter.data[count_data_big_array+1]=
                skin_filter.data[count_data_big_array+2]=0
                skin_filter.data[count_data_big_array+3]=0
                }

                    count_data_big_array=index_value*4;
        }
    }
    draw=skin_filter
}

function rgb2Hsv(r, g, b){
    
    r = r/255
    g = g/255
    b = b/255;

    var max = Math.max(r, g, b)
    var min = Math.min(r, g, b);

    var h, s, v = max;

    var d = max - min;

    s = max == 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{

        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
}

last=false
thresh=150
down=false
wasdown=false
function test(){
    delt=_.createImageData(width,height)
    if(last!==false){
        var totalx=0,totaly=0,totald=0,totaln=delt.width*delt.height
        ,dscl=0
        ,pix=totaln*4;while(pix-=4){
            var d=Math.abs(
                draw.data[pix]-last.data[pix]
            )+Math.abs(
                draw.data[pix+1]-last.data[pix+1]
            )+Math.abs(
                draw.data[pix+2]-last.data[pix+2]
            )
            if(d>thresh){
                delt.data[pix]=160
                delt.data[pix+1]=255
                    delt.data[pix+2]=
                delt.data[pix+3]=255
                totald+=1
                totalx+=((pix/4)%width)
                totaly+=(Math.floor((pix/4)/delt.height))
            }
            else{
                delt.data[pix]=
                    delt.data[pix+1]=
                    delt.data[pix+2]=0
                delt.data[pix+3]=0
            }
        }
    }
    //slide.setAttribute('style','display:initial')
    //slide.value=(totalx/totald)/width
    if(totald){
        down={
            x:totalx/totald,
            y:totaly/totald,
            d:totald
        }
        handledown()
    }
    //console.log(totald)
    last=draw
    c_.putImageData(delt,0,0)
}
movethresh=2
brightthresh=300
overthresh=1000
function calibrate(){
    wasdown={
        x:down.x,
        y:down.y,
        d:down.d
    }
}
avg=0
state=0//States: 0 waiting for gesture, 1 waiting for next move after gesture, 2 waiting for gesture to end
function handledown(){
    avg=0.9*avg+0.1*down.d
    var davg=down.d-avg,good=davg>brightthresh
    // console.log(davg)
    switch(state){
        case 0:
            if(good){//Found a gesture, waiting for next move
                state=1
                calibrate()
            }
            break
        case 2://Wait for gesture to end
            if(!good){//Gesture ended
                state=0
            }
            break;
        case 1://Got next move, do something based on direction
            var dx=down.x-wasdown.x,dy=down.y-wasdown.y
            var dirx=Math.abs(dy)<Math.abs(dx)//(dx,dy) is on a bowtie
            console.log(good,davg)
            if(dx<-movethresh&&dirx){
                console.log('right')
                changeDestPoint(0, 1, destPoint);
                
            }
            else if(dx>movethresh&&dirx){
                console.log('left')
                changeDestPoint(0, -1, destPoint);
                
            }
            if(dy>movethresh&&!dirx){
                if(davg>overthresh){
                    console.log('over up')
                    // changeDestPoint(1, 0, destPoint);
                }
                else{
                    console.log('up')
                    changeDestPoint(1, 0, destPoint);
                }
            }
            else if(dy<-movethresh&&!dirx){
                if(davg>overthresh){
                    console.log('over down')
                    // changeDestPoint(-1, 0, destPoint);
                }
                else{
                    console.log('down')
                    changeDestPoint(-1, 0, destPoint);
                }
            }
            state=2
            break
    }
}

});