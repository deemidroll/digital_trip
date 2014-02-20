var context = new window.AudioContext(); //
// переменные для буфера, источника и получателя
var buffer, source, destination, analyser, gainNode; 

var startedAt, pausedAt, paused;

// функция для подгрузки файла в буфер
var loadSoundFile = function(url) {
  // делаем XMLHttpRequest (AJAX) на сервер
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer'; // важно
  xhr.onload = function(e) {
    // декодируем бинарный ответ
    context.decodeAudioData(this.response,
    function(decodedArrayBuffer) {
      // получаем декодированный буфер
      buffer = decodedArrayBuffer;
      play();
      onRenderFcts.push(function() {
        visualize();
      });
    }, function(e) {
      console.log('Error decoding file', e);
    });
  };
  xhr.send();
}

// функция начала воспроизведения
var play = function(){
    // создаем источник
    source = context.createBufferSource();
    // подключаем буфер к источнику
    source.buffer = buffer;
    // дефолтный получатель звука
    destination = context.destination;
    analyser = context.createAnalyser();
    gainNode = context.createGain();
    gainNode.connect(destination);
    gainNode.gain.value = globalVolume;
    analyser.connect(gainNode);
    analyser.fftSize = 2048;
    analyser.minDecibels = -50;
    analyser.maxDecibels = -20;

    // analyser.minDecibels = -50;
    // подключаем источник к получателю
    source.connect(analyser);
    // воспроизводим
    paused = false;

    if (pausedAt) {
    startedAt = Date.now() - pausedAt;
    source.start(0, pausedAt / 1000);
    }
    else {
    startedAt = Date.now();
    source.start(0);
    }
};

// функция остановки воспроизведения
var stop = function(){
  source.stop(0);
  pausedAt = Date.now() - startedAt;
  paused = true;
};

loadSoundFile('sounds/theField_overTheIce.mp3');
// loadSoundFile('sounds/music.mp3');
// console.log(this.analyser);
var freqDomain;
var valueAudio = 0;
var percent;
var visualize = function() {
    freqDomain = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqDomain);
    // for (var i = 0; i < freqDomain.length; i++) {
    //       valueAudio = freqDomain[i];
    //       percent = valueAudio / 256;
    // }
    valueAudio = getFrequencyValue(400);
    // console.log(valueAudio);
};

function getFrequencyValue(frequency) {
  var nyquist = context.sampleRate/2;
  var index = Math.round(frequency/nyquist * freqDomain.length);
  return freqDomain[index];
}

// var HEX;
// // console.log(HEX);
// onRenderFcts.push(function() {
//   HEX = new THREE.Color().setRGB(valueAudio, 0, 0).getHexString();
//   $(function() {
//     $(".color").css({"background-color": "#"+HEX});
//   });
// });