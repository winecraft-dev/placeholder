//create scene and set props
var Scene = new THREE.Scene();
Scene.background = new THREE.Color( 0x3773d3 );

//create canvas and set props
var Renderer = new THREE.WebGLRenderer();
Renderer.setSize(window.innerWidth, window.innerHeight);
Renderer.physicallyCorrectLights = true;
Renderer.shadowMap.enabled = true;
document.body.appendChild( Renderer.domElement );



var Camera = new createFlyCamera(Scene,new THREE.Vector3(0,5,0));

window.addEventListener('resize',function(){
		Renderer.setSize(window.innerWidth,window.innerHeight);
		Camera.camera.aspect = window.innerWidth / window.innerHeight;
});

generateTerrain(Scene,{
	width:15,
	length:15,
	widthSegments:4,
	lengthSegments:4
});

createSunLight(0xffffff,3,new THREE.Vector3(5,10,0),new THREE.Vector3(1,0,0));
createAmbientLight(0xffffff);


var lastMousePos = {x:0,y:0};
//set update loop for all classes
function animate() {
	requestAnimationFrame(animate);

	checkInputs();
	Camera.Update();

	Renderer.render( Scene, Camera.camera);
}
animate();



function checkInputs() {
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
	if(inPointerLock)
	{
		Camera.mouseDif.set(mousePos.x-lastMousePos.x,mousePos.y-lastMousePos.y);
	}
	 lastMousePos.x = mousePos.x;
	 lastMousePos.y = mousePos.y;
};
