var context = new window.AudioContext(),
    counter = 0,
    buffers = [], sources=[], destination, analysers = [], gainNodes = [],
    startedAt = [], pausedAt = [], stopped = [], paused = [], started = [],
    freqDomain = [], valueAudio = 0,
    stopSound, playSound, pauseSoundOn, pauseSoundOff, initSound, loadSoundFile,
    visualize, getFrequencyValue;

stopSound = function(index){
    if (stopped[index] === false) {
        if (index === 0 || paused[index] === false) {
            pausedAt[index] = Date.now() - startedAt[index];
        } 
        sources[index].stop(index);
        stopped[index] = true;
        started[index] = false;
    }
};

playSound = function(index){
    if (!started[index]) {
        started[index] = true;

        sources[index] = context.createBufferSource();
        sources[index].buffer = buffers[index];

        destination = context.destination;

        gainNodes[index] = context.createGain();
        gainNodes[index].gain.value = globalVolume;

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

pauseSoundOn = function() {
    stopped.forEach(function(el, i) {
        paused[i] = el;
        stopSound(i);
    });
};

pauseSoundOff = function() {
    paused.forEach(function(el, i) {
        if (!el) playSound(i);
        el = false;
        startedAt[i] = 0;
    });

};

initSound = function(arrayBuffer, bufferIndex) {
    context.decodeAudioData(arrayBuffer, function(decodedArrayBuffer) {
        buffers[bufferIndex] = decodedArrayBuffer;
        console.log("ready sound " + bufferIndex);
        counter += 1;
        if (counter === 3) {
            playSound(2);
            $(function() {
                $(".startGame").html("choose control").addClass("button").click(function() {
                    $(".loader").fadeOut(250)
                    $(".choose_control").css({"display": "table", "opacity": "0"}).animate({"opacity": "1"}, 250);
                    $(".choose_wasd").click(function() {
                        $(".choose_control").fadeOut(250, function() {
                            startGame();
                            stopSound(2);
                            playSound(0);
                        });
                    });
                    $(".choose_webcam").click(function() {
                        enableWebcam();
                    });
                });
            });
        }
    }, function(e) {
        console.log('Error decoding file', e);
    });
}

loadSoundFile = function(url, bufferIndex) {
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
loadSoundFile('sounds/space_ambient.mp3', 2);

visualize = function(index) {
    freqDomain[index] = new Uint8Array(analysers[index].frequencyBinCount);
    analysers[index].getByteFrequencyData(freqDomain[index]);
    valueAudio = getFrequencyValue(400, index);
};

getFrequencyValue = function(frequency, bufferIndex) {
    var nyquist = context.sampleRate/2,
        index = Math.round(frequency/nyquist * freqDomain[bufferIndex].length);
    return freqDomain[bufferIndex][index];
};