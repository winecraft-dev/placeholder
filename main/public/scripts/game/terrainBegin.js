//create scene and set props
var Scene = new THREE.Scene();
Scene.background = new THREE.Color( 0x3773d3 );

//create canvas and set props
var Renderer = new THREE.WebGLRenderer();
Renderer.setSize( window.innerWidth, window.innerHeight );
Renderer.physicallyCorrectLights = true;
Renderer.shadowMap.enabled = true;
document.body.appendChild( Renderer.domElement );

var Camera = new createFlyCamera(Scene,new THREE.Vector3(0,5,0));

generateTerrain(Scene,{
	width:9,
	length:3,
	widthSegments:8,
	lengthSegments:2
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
  //check for input control
	if (keyIsDown("W")||keyIsDown("I")) {
    Camera.forwardInput = 1;
  }
  if (keyIsDown("S")||keyIsDown("K")) {
    Camera.forwardInput = -1;
  }
	if(mouseIsDown(0))
	{
		Camera.mouseDif.set(mousePos.x-lastMousePos.x,mousePos.y-lastMousePos.y);
	}
	 lastMousePos.x = mousePos.x;
	 lastMousePos.y = mousePos.y;
};
