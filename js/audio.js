// // Start off by initializing a new context.
// context = new webkitAudioContext();

// // shim layer with setTimeout fallback
// window.requestAnimFrame = (function(){
// return  window.requestAnimationFrame       ||
//   window.webkitRequestAnimationFrame ||
//   window.mozRequestAnimationFrame    ||
//   window.oRequestAnimationFrame      ||
//   window.msRequestAnimationFrame     ||
//   function( callback ){
//   window.setTimeout(callback, 1000 / 60);
// };
// })();


// function playSound(buffer, time) {
//   var source = context.createBufferSource();
//   source.buffer = buffer;
//   source.connect(context.destination);
//   source.start(time);
// }

// function loadSounds(obj, soundMap, callback) {
//   // Array-ify
//   var names = [];
//   var paths = [];
//   for (var name in soundMap) {
//     var path = soundMap[name];
//     names.push(name);
//     paths.push(path);
//   }
//   bufferLoader = new BufferLoader(context, paths, function(bufferList) {
//     for (var i = 0; i < bufferList.length; i++) {
//       var buffer = bufferList[i];
//       var name = names[i];
//       obj[name] = buffer;
//     }
//     if (callback) {
//       callback();
//     }
//   });
//   bufferLoader.load();
// }




// function BufferLoader(context, urlList, callback) {
//   this.context = context;
//   this.urlList = urlList;
//   this.onload = callback;
//   this.bufferList = new Array();
//   this.loadCount = 0;
// }

// BufferLoader.prototype.loadBuffer = function(url, index) {
//   // Load buffer asynchronously
//   var request = new XMLHttpRequest();
//   request.open("GET", url, true);
//   request.responseType = "arraybuffer";

//   var loader = this;

//   request.onload = function() {
//     // Asynchronously decode the audio file data in request.response
//     loader.context.decodeAudioData(
//       request.response,
//       function(buffer) {
//         if (!buffer) {
//           alert('error decoding file data: ' + url);
//           return;
//         }
//         loader.bufferList[index] = buffer;
//         if (++loader.loadCount == loader.urlList.length)
//           loader.onload(loader.bufferList);
//       },
//       function(error) {
//         console.error('decodeAudioData error', error);
//       }
//     );
//   }

//   request.onerror = function() {
//     alert('BufferLoader: XHR error');
//   }

//   request.send();
// };

// BufferLoader.prototype.load = function() {
//   for (var i = 0; i < this.urlList.length; ++i)
//   this.loadBuffer(this.urlList[i], i);
// };

// // var context = new window.AudioContext(); //
// // // переменные для буфера, источника и получателя
// // var buffer, source, destination, analyser; 

// // // функция для подгрузки файла в буфер
// // var loadSoundFile = function(url) {
// //   // делаем XMLHttpRequest (AJAX) на сервер
// //   var xhr = new XMLHttpRequest();
// //   xhr.open('GET', url, true);
// //   xhr.responseType = 'arraybuffer'; // важно
// //   xhr.onload = function(e) {
// //     // декодируем бинарный ответ
// //     context.decodeAudioData(this.response,
// //     function(decodedArrayBuffer) {
// //       // получаем декодированный буфер
// //       buffer = decodedArrayBuffer;
// //       play();
// //     }, function(e) {
// //       console.log('Error decoding file', e);
// //     });
// //   };
// //   xhr.send();
// // }

// // // функция начала воспроизведения
// // var play = function(){
// //     // создаем источник
// //     source = context.createBufferSource();
// //     // подключаем буфер к источнику
// //     source.buffer = buffer;
// //     console.log(buffer);
// //     // дефолтный получатель звука
// //     destination = context.destination;
// //     console.log(context);

// //     analyser = context.createAnalyser();
// //     analyser.connect(destination);

// //     // подключаем источник к получателю
// //     source.connect(destination);
// //     // воспроизводим
// //     source.start(0);

// //     onRenderFcts.push(function() {
// //         visualize();
// //     });
// // }

// // // функция остановки воспроизведения
// // var stop = function(){
// //   source.stop(0);
// // }

// // loadSoundFile('sounds/theField_overTheIce.mp3');


// // var visualize = function() {
// //     // console.log(analyser);
// //     var times = new Uint8Array(this.analyser.frequencyBinCount);
// //     this.analyser.getByteTimeDomainData(times);
// //     // console.log(times);
// //     for (var i = 0; i < times.length; i++) {
// //         var value = times[i];
// //         // console.log(value);
// //         var percent = value / 256;
// //         // console.log(percent);
// //     }
// // };

// $(function(){
//       var context = new window.AudioContext();
//       var destination;




//         oscillator = context.createOscillator();
//         analyser = context.createAnalyser();
//         destination = context.destination;

//         oscillator.connect(analyser);
//         analyser.connect(destination);

//         oscillator.start(0);

//         requestAnimFrame(visualize);



//       $('body').addClass('readytoplay');

//       $('.radio1').on('change', function(e){
//         oscillator.type = $('.radio1:checked').val()*1;
//       });

//       $('#frequency').on('change', function(e){
//         oscillator.frequency.value = $('#frequency').val()*1;
//       });

//       $('#detune').on('change', function(e){
//         oscillator.detune.value = $('#detune').val()*1;
//       });


//       var visualize = function() {
//         this.WIDTH = 800;
//         this.HEIGHT = 200;
//         canvas.width = this.WIDTH;
//         canvas.height = this.HEIGHT;
//         var drawContext = canvas.getContext('2d');

//         var times = new Uint8Array(this.analyser.frequencyBinCount);
//         this.analyser.getByteTimeDomainData(times);
//         for (var i = 0; i < times.length; i++) {
//           var value = times[i];
//           var percent = value / 256;
//           var height = this.HEIGHT * percent;
//           var offset = this.HEIGHT - height - 1;
//           var barWidth = this.WIDTH/times.length;
//           drawContext.fillStyle = '#0070af';
//           drawContext.fillRect(i * barWidth, offset, 1, 1);
//         }
//         requestAnimFrame(visualize);
//       };



//   });