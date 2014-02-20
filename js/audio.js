var context = new window.AudioContext(); //
// переменные для буфера, источника и получателя
var buffer, source, destination, analyser; 

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
    analyser.connect(destination);
    analyser.fftSize = 2048;
    analyser.minDecibels = -50;
    analyser.maxDecibels = -20;

    // analyser.minDecibels = -50;
    // подключаем источник к получателю
    source.connect(analyser);
    // воспроизводим
    source.start(0);
    // console.log(source);
    // source.gain.value = globalVolume;

    onRenderFcts.push(function() {
        visualize();
    });
}

// функция остановки воспроизведения
var stop = function(){
  source.stop(0);
}

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