var keys = [];
var mouseButtons = [];
window.addEventListener("keydown",function(e)
{
  keys[e.which] = true;
},false);

window.addEventListener('keyup',function(e)
{
  keys[e.which] = false;
},false);

window.addEventListener("mousedown", function(e){
  mouseButtons[e.button] = true;
},false);
window.addEventListener("mouseup", function(e){
  mouseButtons[e.button] = false;
},false);

function keyIsDown(key)
{
	let bool = false;
	if('string' === typeof(key))
	{
		bool = keys[key.charCodeAt(0)];
	}
	else
		bool = keys[key];
	if(bool == undefined)
		bool = false;
	return bool;
}

function mouseIsDown(num)
{
  return mouseButtons[num];
}

var inPointerLock = false;

window.onload = function()
{
  console.log(document);
  document.body.getElementsByTagName("canvas")[0].addEventListener("click",function(e){
    let element = document.body.getElementsByTagName("canvas")[0];
    element.requestPointerLock = element.requestPointerLock ||
  			     element.mozRequestPointerLock ||
  			     element.webkitRequestPointerLock;
    element.requestPointerLock();
  },false);
  document.addEventListener('pointerlockchange', (e) => {
  console.log(document.activeElement);
});
}

var mousePos = {x:0,y:0};

window.addEventListener("mousemove", function(e){
  mousePos.x += e.movementX;
  mousePos.y += e.movementY;
});
