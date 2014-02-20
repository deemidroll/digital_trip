    var context = new window.AudioContext();
    var buffers = [], sources=[], destination, analysers = [], gainNodes = [];
    var startedAt = [], pausedAt = [], stopped = [], paused = [], started = [];

    var stopSound = function(index){
        if (stopped[index] === false) {
            if (index === 0 || paused[index] === false) {
                pausedAt[index] = Date.now() - startedAt[index];
            } 
            sources[index].stop(index);
            stopped[index] = true;
            started[index] = false;
        }
    };

    var playSound = function(index){
        if (!started[index]) {
            started[index] = true;

            sources[index] = context.createBufferSource();
            sources[index].buffer = buffers[index];
    
            destination = context.destination;
    
            gainNodes[index] = context.createGain();
            gainNodes[index].gain.value = 1;
    
            analysers[index] = context.createAnalyser();
            analysers[index].fftSize = 2048;
            analysers[index].minDecibels = -50;
            analysers[index].maxDecibels = -20;
    
            sources[index].connect(gainNodes[index]);
            gainNodes[index].connect(analysers[index]);
            analysers[index].connect(destination);
    
            onRenderFcts.push(function() {
                visualize(index);
            });
    
            stopped[index] = false;
            if (pausedAt[index]) {
                startedAt[index] = Date.now() - pausedAt[index];
                sources[index].start(index, pausedAt[index] / 1000);
            } else {
                startedAt[index] = Date.now();
                sources[index].start(index);
            }
        }
    };

    var pauseSoundOn = function() {
        stopped.forEach(function(el, i) {
            paused[i] = el;
            stopSound(i);
        });
    };

    var pauseSoundOff = function() {
        paused.forEach(function(el, i) {
            if (!el) playSound(i);
            el = false;
            startedAt[i] = 0;
        });

    };

    var initSound = function(arrayBuffer, bufferIndex) {
        context.decodeAudioData(arrayBuffer, function(decodedArrayBuffer) {
            buffers[bufferIndex] = decodedArrayBuffer;
            console.log("ready" + bufferIndex);
            if (bufferIndex === 0) {
                playSound(bufferIndex);
            }
        }, function(e) {
            console.log('Error decoding file', e);
        });
    }

    var loadSoundFile = function(url, bufferIndex) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(e) {
            initSound(this.response, bufferIndex); // this.response is an ArrayBuffer.
        };
        xhr.send();
    }

    loadSoundFile('sounds/theField_overTheIce.mp3', 0);
    loadSoundFile('sounds/dubstep.mp3', 1);

var freqDomain = [];
var valueAudio = 0;

var visualize = function(index) {
        freqDomain[index] = new Uint8Array(analysers[index].frequencyBinCount);
        analysers[index].getByteFrequencyData(freqDomain[index]);
        valueAudio = getFrequencyValue(400, index);
};

function getFrequencyValue(frequency, bufferIndex) {
    var nyquist = context.sampleRate/2;
    var index = Math.round(frequency/nyquist * freqDomain[bufferIndex].length);
    return freqDomain[bufferIndex][index];
}

// var HEX;
// // console.log(HEX);
// onRenderFcts.push(function() {
//   HEX = new THREE.Color().setRGB(valueAudio, 0, 0).getHexString();
//   $(function() {
//     $(".color").css({"background-color": "#"+HEX});
//   });
// });