(function () {
    DT.audio = {
            frequency: { // for audio visualization
                0: 400,
                1: 100
            },
            valueAudio: 0,
            webaudio: new WebAudio(),
            sounds: {
                catchCoin: 'sounds/coin.',
                gameover: 'sounds/gameover.',
                pause: 'sounds/pause.',
                stoneDestroy: 'sounds/stoneDestroy.',
                stoneMiss: 'sounds/stoneMiss.'
            },
            music: {
                0: 'sounds/theField_overTheIce.',
                1: 'sounds/heart.',
                2: 'sounds/space_ambient2.',
                started: [],
                startedAt: [],
                pausedAt: [],
                stopped: [],
                paused: []
            }
        };
        DT.audio.reset = function () {
            DT.audio.music.startedAt = [];
            DT.audio.music.pausedAt = [];
            DT.audio.music.stopped = [];
            DT.audio.music.paused = [];
            DT.audio.music.started = [];
        };
    
    // MUSIC
    var context,
        counter = 0,
        buffers = [], sources=[], destination, analysers = [],
        freqDomain = [];
    var audio = new Audio();
    var canPlayOgg = !!audio.canPlayType && audio.canPlayType('audio/ogg; codecs=\'vorbis\'') !== '';
    console.log('canPlayOgg', canPlayOgg);
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
    }
    catch(e) {
        alert('Opps.. Your browser do not support audio API');
    }
    DT.stopSound = function(index){
        if (DT.audio.music.stopped[index] === false) {
            if (index === 0 || DT.audio.music.paused[index] === false) {
                DT.audio.music.pausedAt[index] = Date.now() - DT.audio.music.startedAt[index];
            } 
            sources[index].stop(index);
            DT.audio.music.stopped[index] = true;
            DT.audio.music.started[index] = false;
        }
    };
    
    DT.gainNodes = [];
    DT.playSound = function(index){
        var gainNodes = DT.gainNodes;
        if (!DT.audio.music.started[index]) {
            DT.audio.music.started[index] = true;
            sources[index] = context.createBufferSource();
            sources[index].loop = true;
            sources[index].buffer = buffers[index];
            destination = context.destination;
            gainNodes[index] = context.createGain();
            gainNodes[index].gain.value = DT.game.param.globalVolume;
            analysers[index] = context.createAnalyser();
            analysers[index].fftSize = 2048;
            analysers[index].minDecibels = -50;
            analysers[index].maxDecibels = -20;
            sources[index].connect(gainNodes[index]);
            gainNodes[index].connect(analysers[index]);
            analysers[index].connect(destination);
            $(document).on('update', function (e, data) {
                visualize(index);
            });
            DT.audio.music.stopped[index] = false;
            if (DT.audio.music.pausedAt[index]) {
                DT.audio.music.startedAt[index] = Date.now() - DT.audio.music.pausedAt[index];
                sources[index].start(index, DT.audio.music.pausedAt[index] / 1000);
            } else {
                DT.audio.music.startedAt[index] = Date.now();
                sources[index].start(index);
            }
        }
    };
    
    DT.stopSoundBeforPause = function() {
        DT.audio.music.stopped.forEach(function(el, i) {
            DT.audio.music.paused[i] = el;
            DT.stopSound(i);
        });
    };
    
    DT.playSoundAfterPause = function() {
        DT.audio.music.paused.forEach(function(el, i) {
            if (!el) {
                DT.playSound(i);
            }
        });
    };
    
    
    var initSound = function(arrayBuffer, bufferIndex) {
        context.decodeAudioData(arrayBuffer, function(decodedArrayBuffer) {
            buffers[bufferIndex] = decodedArrayBuffer;
            console.log('ready sound ' + bufferIndex);
            counter += 1;
            yepnope.showLoading(counter);
        }, function(e) {
            console.log('Error decoding file', e);
        });
    };
    
    // SOUNDS
    var ext = 'ogg';
    if (!canPlayOgg) {
        ext = 'mp3';
    }
    for (var prop in DT.audio.sounds) if (DT.audio.sounds.hasOwnProperty(prop)) {
        DT.audio.sounds[prop] = DT.audio.webaudio.createSound().load(DT.audio.sounds[prop] + ext);
    }
    
    var loadSoundFile = function(urlArr, bufferIndex) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', urlArr[bufferIndex] + ext, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(e) {
            initSound(this.response, bufferIndex); // this.response is an ArrayBuffer.
        };
        xhr.send();
    };
    
    loadSoundFile(DT.audio.music, 0);
    loadSoundFile(DT.audio.music, 1);
    loadSoundFile(DT.audio.music, 2);
    
    var visualize = function(index) {
        freqDomain[index] = new Uint8Array(analysers[index].frequencyBinCount);
        analysers[index].getByteFrequencyData(freqDomain[index]);
        DT.audio.valueAudio = getFrequencyValue(DT.audio.frequency[index], index);
    };
    
    var getFrequencyValue = function(frequency, bufferIndex) {
        var nyquist = context.sampleRate/2,
            index = Math.round(frequency/nyquist * freqDomain[bufferIndex].length);
        return freqDomain[bufferIndex][index];
    };
    
    // add update function to webaudio prototype
    WebAudio.Sound.prototype.update = function() {
        this.volume(DT.game.param.globalVolume);
    };
    WebAudio.Sound.prototype.play = function(time){
        this.volume(DT.game.param.globalVolume);
        // handle parameter polymorphism
        if( time ===  undefined )   time    = 0;
        // if not yet playable, ignore
        // - usefull when the sound download isnt yet completed
        if( this.isPlayable() === false )   return;
        // clone the bufferSource
        var clonedNode  = this._chain.cloneBufferSource();
        // set the noteOn
        clonedNode.start(time);
        // create the source object
        var source  = {
            node    : clonedNode,
            stop    : function(time){
                if( time ===  undefined )   time    = 0;
                this.node.stop(time);
                return source;  // for chained API
            }
        };
        // return it
        return source;
    };
})();