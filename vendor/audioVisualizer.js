var fft,
	channels, 
	rate, 
	frameBufferLength;

function loadedMetadata(event) {
  
  	// check if the Mozilla Audio API is available
  	if (event.mozChannels === undefined) createElaborated3D();
  	else {
		channels			= event.mozChannels,
		rate				= event.mozSampleRate,
		frameBufferLength	= event.mozFrameBufferLength;
	
		fft 			 	= new FFT(frameBufferLength / channels, rate);
		
		
		createSimple3D();
		setTimeout('document.getElementById("audio_element").play();', 4000);
  	}
  
	
}

function audioWritten(event) { 
	
	if (event.mozFrameBuffer === undefined) return false;
  
	var fb			= event.mozFrameBuffer,
		signal		= new Float32Array(fb.length / channels),
		magnitudes	= [];

	for (var i = 0, fbl = frameBufferLength / 2; i < fbl; i++ ) {
		// Assuming interlaced stereo channels,
		// need to split and merge into a stero-mix mono signal
		signal[i] = (fb[2*i] + fb[2*i+1]) / 2;
	}

	fft.forward(signal);


	var fft_length = fft.spectrum.length,
		num_blocks = 4,
		num_magnitudes_per_block = Math.ceil(fft_length / num_blocks),
		cont_blocks = 0,
		num_block = 0;
		
	for (var i = 0; i < fft_length; i++ ) {
		// multiply spectrum by a zoom value
		var magnitud = fft.spectrum[i] * 100;
			
		if (cont_blocks == num_magnitudes_per_block){
			cont_blocks = 0;
			num_block++;
		}
		if (cont_blocks == 0) magnitudes[num_block] = 0;
			
		magnitudes[num_block] += magnitud;
		cont_blocks++; 
	}
		
	// Calculate the magnitudes in a four-data spectrum
	for (var i=0; i<numCubes; i++){
		nextHeight[i] = (i==0)? parseInt(magnitudes[i]*.75) : parseInt(magnitudes[i]*2);
	}
		
		
}