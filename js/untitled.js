    var context = new window.AudioContext();
    var buffers = [], sources=[], destination, analysers = [], gainNodes = [];
    var startedAt = [], pausedAt = [], paused = [];

    var stopSound = function(index){
        if (paused[index] === false) {
            sources[index].stop(index);
            pausedAt[index] = Date.now() - startedAt[index];
            paused[index] = true;
        }
    }

    var playSound = function(index){
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

        console.log(analysers[index]);

        onRenderFcts.push(function() {
            visualize(index);
        });

        paused[index] = false;
        if (pausedAt[index]) {
            startedAt[index] = Date.now() - pausedAt[index];
            sources[index].start(index, pausedAt[index] / 1000);
        } else {
            startedAt[index] = Date.now();
            sources[index].start(index);
        }
    };

    var initSound = function(arrayBuffer, bufferIndex) {
        context.decodeAudioData(arrayBuffer, function(decodedArrayBuffer) {
            buffers[bufferIndex] = decodedArrayBuffer;
            console.log("ready" + bufferIndex);
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