
function wallpaperAudioListener(audioArray) {
	
	var audioCanvas = document.getElementById("myCanvas");
	var audioCanvasCtx = audioCanvas.getContext("2d");
	
	audioCanvasCtx.clearRect(0,0,audioCanvas.width, audioCanvas.height);
	
	var barWidth = Math.round(1.0 / 128.0 * audioCanvas.width);
	
	var halfCount = audioArray.length / 2;

	audioCanvasCtx.fillStyle = 'rgb(255,115,157)';

	for (var i = 0; i < halfCount; ++i) {
		var height = audioCanvas.height * audioArray[i];
		audioCanvasCtx.fillRect(barWidth * i, audioCanvas.height - height, barWidth,height);
	}

	for (var i = halfCount; i < audioArray.length; ++i) {
		var height = audioCanvas.height * audioArray[191-i];
		audioCanvasCtx.fillRect(barWidth * i, audioCanvas.height - height, barWidth, height);
	}		
	
}

window.onload = function() {
	window.wallpaperRegisterAudioListener(wallpaperAudioListener);
};