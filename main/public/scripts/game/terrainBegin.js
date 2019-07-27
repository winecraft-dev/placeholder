//create scene and set props
// just so you know these variables are global variables
var Scene = new THREE.Scene();
Scene.background = new THREE.Color( 0x3773d3 );

//create canvas and set props
var Renderer = new THREE.WebGLRenderer();
Renderer.setSize(window.innerWidth, window.innerHeight);
Renderer.physicallyCorrectLights = true;
Renderer.shadowMap.enabled = true;
document.body.appendChild( Renderer.domElement );

var Camera = new createFlyCamera(Scene,new THREE.Vector3(0,0,5));

window.addEventListener('resize',function(){
		Renderer.setSize(window.innerWidth,window.innerHeight);
		Camera.camera.aspect = window.innerWidth / window.innerHeight;
    Camera.camera.updateProjectionMatrix();
});

createSunLight(0xffffff,3,new THREE.Vector3(5,10,0),new THREE.Vector3(1,0,0));
createAmbientLight(0xffffff);


var lastMousePos = {x:0,y:0};
//set update loop for all classes
function animate() {
	requestAnimationFrame(animate);

	checkInputs();
	Camera.Update();

	playerList.forEach(function(player){
		player.Update();
	});

	Renderer.render( Scene, Camera.camera);
}
animate();

var ip;
var token;

// HEY. im pretty sure we can sent this websocket stuff to its own folder.
$(document).ready(function() {
	ip = $('#ip').text();
	token = $('#token').text();
	url = 'ws://' + ip + ':1357';

	ws = new WebSocket(url);

	setTimeout(function() {
		if(!open)
		{
			window.location.reload();
		}
	}, 10000);

	ws.addEventListener('open', function(e) {
		console.log('open');
		open = true;

		ws.send(JSON.stringify({
			receiver: "token",
			token: token
		}));
	});

	ws.addEventListener('message', function(e) {
		var data = JSON.parse(e.data);

		switch(data.receiver)
		{
<<<<<<< HEAD
			case 'terrain':
				console.log(data.terrain);
				generateTerrain2(Scene, data.terrain.vertices, data.terrain.faces);
=======
			case 'addobject':
				switch(data.type)
				{
					case 'terrain':
						generateTerrain(Scene, data.object);
						break;
					case 'player':
						console.log(data);
						generatePlayer(Scene, data.object);
						break;
					default:
						break;
				}
				break;
			case 'updateobject':
>>>>>>> origin/master
				break;
			default:
				break;
		}
	});

	ws.addEventListener('close', function(e) {
		console.log('closed, reloading in 5 seconds');
		setTimeout(function() {
			window.location.reload();
		}, 5000);
	});
});

send = function(data)
{
	if(open)
		ws.send(JSON.stringify(data));
};

leaveGame = function()
{
	window.location.href = '/leavegame';
};


function checkInputs() {
	/*
		this stuff will be different for every game and will get complicated
		very fast. SO some day i wish to see this be put into it's own scripts
		and streamlined
	*/
	Camera.forwardInput = 0;
	Camera.sideInput = 0;
	Camera.upInput = 0;
  //check for input control
	if (keyIsDown("W")||keyIsDown("I")) {
    Camera.forwardInput = -1;
  }
  if (keyIsDown("S")||keyIsDown("K")) {
    Camera.forwardInput = 1;
  }
	if (keyIsDown("A")||keyIsDown("J")) {
    Camera.sideInput = -1;
  }
  if (keyIsDown("D")||keyIsDown("L")) {
    Camera.sideInput = 1;
  }
	if (keyIsDown("E")||keyIsDown("O")) {
    Camera.upInput = 1;
  }
  if (keyIsDown("Q")||keyIsDown("U")) {
    Camera.upInput = -1;
  }
	if(keyIsDown(16))
	{
		Camera.flySpeed = .2;
	}
	else
	{
		Camera.flySpeed = .1;
	}
	if(inPointerLock)
	{
		Camera.mouseDif.set(mousePos.x-lastMousePos.x,mousePos.y-lastMousePos.y);
	}
	 lastMousePos.x = mousePos.x;
	 lastMousePos.y = mousePos.y;
	 if (keyIsDown(77)) {
		 document.body.getElementsByTagName("canvas")[0].dispatchEvent(disablePointerLock);
   }
};
