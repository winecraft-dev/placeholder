//create scene and set props
// just so you know these variables are global variables
scene = new THREE.Scene();

const loader = new THREE.TextureLoader();
const texture = loader.load(
	'/images/Skybox.jpg',
);
texture.magFilter = THREE.NearestMipMapNearestFilter;
texture.minFilter = THREE.NearestMipMapNearestFilter;

const shader = THREE.ShaderLib.equirect;
	const material = new THREE.ShaderMaterial({
	fragmentShader: shader.fragmentShader,
	vertexShader: shader.vertexShader,
	uniforms: shader.uniforms,
	depthWrite: false,
	side: THREE.BackSide,
});
material.uniforms.tEquirect.value = texture;
const plane = new THREE.SphereBufferGeometry( 5, 10, 10 );
bgMesh = new THREE.Mesh(plane, material);
scene.add(bgMesh);

//create canvas and set props
var Renderer = new THREE.WebGLRenderer();
Renderer.setSize(window.innerWidth, window.innerHeight);
Renderer.physicallyCorrectLights = true;
Renderer.shadowMap.enabled = true;
document.body.appendChild( Renderer.domElement );
Renderer.autoClearColor = false;

Camera = new createFlyCamera(scene,new THREE.Vector3(10,10,25));

window.addEventListener('resize',function(){
	Renderer.setSize(window.innerWidth,window.innerHeight);
	Camera.camera.aspect = window.innerWidth / window.innerHeight;
	Camera.camera.updateProjectionMatrix();
});

var sun = new createSunLight(scene,4,0);
var modelLoader = new ModelLoader(scene);

var lastMousePos = {x:0,y:0};
//set update loop for all classes
function animate() {
	requestAnimationFrame(animate);

	checkInputs();
	Camera.Update();
	sun.Update();
	bgMesh.position.copy(Camera.camera.position);
	Renderer.render( scene, Camera.camera);
}
animate();

connection = new Connection($('#ip').text(), $('#token').text());

function checkInputs()
{
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
