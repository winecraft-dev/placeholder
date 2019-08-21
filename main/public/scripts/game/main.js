// global variables
global_scene = null;
global_renderer = null;
global_connection = null;
global_inputs = null;
global_camera = null;
global_modelLoader = null;

$(document).ready(function() {
	//create global_scene and set props
	// just so you know these variables are global variables
	global_scene = new THREE.Scene();

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
	global_scene.add(bgMesh);

	//create canvas and set props
	global_renderer = new THREE.WebGLRenderer();
	global_renderer.setSize(window.innerWidth, window.innerHeight);
	global_renderer.physicallyCorrectLights = true;
	global_renderer.shadowMap.enabled = true;
	document.body.appendChild(global_renderer.domElement);
	global_renderer.autoClearColor = false;

	global_modelLoader = new ModelLoader();

	global_modelLoader.preload('/models/BigHeadPerson.glb','bigHead');

	global_modelLoader.addToScene("bigHead",{position:new THREE.Vector3(5,10,0)});

	// sets up connection
	global_camera = new SelfCamera(new THREE.Vector3(10,10,25), window.innerWidth, window.innerHeight);
	//global_camera = new createFlyCamera(new THREE.Vector3(0,0,0));
	global_connection = new Connection($('#ip').text(), $('#token').text());
	global_inputs = new Inputs();

	let sun = new createSunLight(global_scene, 4, 8);

	window.addEventListener('resize',function(){
		global_renderer.setSize(window.innerWidth,window.innerHeight);
		global_camera.updateAspect(window.innerWidth, window.innerHeight);
	});

	//set update loop for all classes
	function animate() {
		requestAnimationFrame(animate);
		if(getSelfPosition() != null)
		{
			global_camera.updatePosition(getSelfPosition());
			global_camera.updateRotation(getSelfRotation());
		}
		sun.Update();
		bgMesh.position.copy(global_camera.camera.position);
		global_renderer.render(global_scene, global_camera.camera);
	}
	animate();
});