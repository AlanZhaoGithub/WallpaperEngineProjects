window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      function( callback ){
        window.setTimeout(callback, 1000 / 60);
      };
})();

// Clock script

var displayClock = document.querySelector("#clock");
var clock24hour = false; // AMPM OR 24 HOUR CLOCK STYLES

function getTime()
{
	var currentTime = new Date();
	var h = currentTime.getHours();
	var m = currentTime.getMinutes();
	var s = currentTime.getSeconds();
	if (clock24hour){
	displayClock.innerHTML = "<span id='time'>"+ add0(h) + " : " + add0(m) +" <span class='sec'>" + add0(s) +"</span>";
	}
	else{
		var ampm = h < 12 ? " AM" : " PM"
		h = h < 12 ? h : h - 12;
		displayClock.innerHTML = "<span id='time'>"+ add0(h) + " : " + add0(m) +" <span class='sec'>" + add0(s) +"</span><span class='st'>"+ampm+"</span></span>";
	}
}

function add0(val)
{
	return val < 10 ? "0" + val : val;
}

function updateTime()
{
	getTime();
	setTimeout(updateTime,1000);
}

updateTime();

// Resizes clock and canvas
var w,h, minW;
var myCanvas = document.querySelector("#myCanvas");
function resize(){
	myCanvas.width = w = window.innerWidth;
	myCanvas.height = h = window.innerHeight;
	minW = Math.min(w,h);
	displayClock.style.width = w + "px";
	displayClock.style.height = displayClock.style.lineHeight = h + "px";
}
resize();
displayClock.style.fontSize = Math.floor(h/300*20) + "px";
window.onresize = resize;


var param = {
  style : 1,
  r : 0.5,
  color : "rgba(255,0,0,0.8)",
  customimage : "url('zima.png')",
  blurColor : "red",
  arr1 : [],
  arr2 : [],
  isRotate : true,
  offsetAngle : 0,
  arr : [],
  waveArr : new Array(120),
  cX : 0.5,
  cY : 0.5,
  tX : 50,
  tY : 50,
  range : 1
};
var ctx = myCanvas.getContext("2d");

ctx.strokeStyle = param.color;
ctx.lineWidth = 3;
ctx.shadowBlur = 15;
ctx.shadowColor = param.blurColor;

window.wallpaperPropertyListener={
        applyUserProperties: function(properties){
	if (properties.style)
	{
		param.style = properties.style.value;
	}
	if (properties.customimage)
	{
		if (properties.customimage.value){
		param.customimage = properties.customimage;
		document.querySelector('#background').style.backgroundImage='url("file:///'+properties.customimage.value+'")';
		}
		else{
			document.querySelector('#background').style.backgroundImage = 'url("zima.png")';
		}
    };
    if(properties.radius){
      param.r = properties.radius.value/100;
    };
    if(properties.range){
      param.range = properties.range.value/5;
    };
    if(properties.color){
      var c = properties.color.value.split(' ').map(function(c){return Math.ceil(c*255)});
      ctx.strokeStyle = param.color = 'rgba('+ c +',0.6)';
      displayClock.style.color = 'rgb('+c+')';
    };
    if(properties.blurColor){
      var c = properties.blurColor.value.split(' ').map(function(c){return Math.ceil(c*255)});
      ctx.shadowColor = param.blurColor = 'rgb('+ c +')';
      displayClock.style.textShadow = '0 0 20px rgb('+c+')';
    };
    if(properties.showTime){
      displayClock.style.display = properties.showTime.value ? 'block' : 'none';
    };
    if(properties.cX){
      param.cX = properties.cX.value*0.01;
    };
    if(properties.cY){
      param.cY = properties.cY.value*0.01;
    };
    if(properties.tX){
      param.tX = properties.tX.value;
      displayClock.style.left = param.tX-50+'%';
    };
    if(properties.tY){
      param.tY = properties.tY.value;
      displayClock.style.top = param.tY-50+'%';
    };
    if(properties.tSize){
      var s = properties.tSize.value;
      displayClock.style.fontSize = Math.floor(h/300*s) + 'px';
    };
    if(properties.clock24hour){
      clock24hour = properties.clock24hour.value;
      getTime();
    };
    if(properties.isRotate){
      param.isRotate = properties.isRotate.value;
    };
  }
}


function createPoint(arr){
  param.arr1 = [];
  param.arr2 = [];
  for(var i=0; i<120; i++){
    var deg = Math.PI/180*(i+param.offsetAngle)*3;
    var w1 = arr[i] ? arr[i] : 0;
    var w2;
    if(param.waveArr[i]){
      w2 = param.waveArr[i] - 0.1;
    }else{
      w2 = 0;
    };
    w1 = Math.max(w1, w2);
    param.waveArr[i] = w1 = Math.min(w1, 1.2);
    var w = w1*param.range*100;
    var offset1 = param.r*minW/2+w+1;
    var offset2 = param.r*minW/2-w-1;
    var p1 = getXY(offset1, deg);
    var p2 = getXY(offset2, deg);
    param.arr1.push({'x':p1.x, 'y':p1.y});
    param.arr2.push({'x':p2.x, 'y':p2.y});
  };
  if(param.isRotate){
    param.offsetAngle += 1/5;
    if(param.offsetAngle>=360) param.offsetAngle = 0;
  };
};
function getXY(offset, deg){
  return {'x':Math.cos(deg)*offset+param.cX*w, 'y':Math.sin(deg)*offset+param.cY*h};
};
createPoint([]);

function style1(){
  ctx.beginPath();
  ctx.moveTo(param.arr1[0].x, param.arr1[0].y);
  for(var i=0; i<120; i++){
    ctx.lineTo(param.arr1[i].x, param.arr1[i].y);
  };
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(param.arr2[0].x, param.arr2[0].y);
  for(var i=0; i<120; i++){
    ctx.lineTo(param.arr2[i].x, param.arr2[i].y);
  };
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  for(var i=0; i<120; i++){
    ctx.moveTo(param.arr1[i].x, param.arr1[i].y);
    ctx.lineTo(param.arr2[i].x, param.arr2[i].y);
  };
  ctx.closePath();
  ctx.stroke();
};

function style2(){
  ctx.beginPath();
  for(var i=0; i<120; i++){
    ctx.moveTo(param.arr1[i].x, param.arr1[i].y);
    ctx.lineTo(param.arr2[i].x, param.arr2[i].y);
  };
  ctx.closePath();
  ctx.stroke();
};
style2();
window.wallpaperRegisterAudioListener && window.wallpaperRegisterAudioListener(wallpaperAudioListener);
function wallpaperAudioListener(arr){
  ctx.clearRect(0,0,w,h);
  createPoint(arr);
  switch (param.style) {
    case 1:
	style1();
    break;
    case 2:
    style2();
    break;
  }
}