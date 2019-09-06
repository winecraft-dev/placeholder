// global variables
global_scene = null;
global_renderer = null;
global_connection = null;
global_inputs = null;
global_camera = null;
global_models = null;
global_time = new THREE.Clock();

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


	let sun = new createSunLight(global_scene, 4, 8);

	// sets up connection
	global_camera = new SelfCamera(new THREE.Vector3(10,10,25), window.innerWidth, window.innerHeight);
	global_connection = new Connection($('#ip').text(), $('#token').text());
	global_inputs = new Inputs();

	window.addEventListener('resize',function(){
		global_renderer.setSize(window.innerWidth,window.innerHeight);
		global_camera.updateAspect(window.innerWidth, window.innerHeight);
	});

	global_models = new modelLoader();

	//need a way to preload in all important 3d models.
	global_models.preload("/models3D/bigHeadPerson.glb","bigHead");
	//set update loop for all classes
	function animate() {
		requestAnimationFrame(animate);

		if(getSelfPosition() != null)
		{
			updateSelfInputs(global_inputs.getMovement(), global_inputs.actions);
			global_camera.updatePosition(getSelfHeadPosition());
			global_camera.updateRotation(getSelfRotation());
		}

		sun.Update();
		bgMesh.position.copy(global_camera.camera.position);

		//console.log(global_time.getDelta());
		updateVelocities(global_time.getDelta());

		global_time.start();
		global_renderer.render(global_scene, global_camera.camera);
	}
	animate();

	var sendLoopId = setInterval(function() {
		var selfquat = getSelfQuaternion();
		if(selfquat != null)
		{
			var quaternion = {
				x: selfquat._x,
				y: selfquat._y,
				z: selfquat._z,
				w: selfquat._w
			};
			global_connection.send({
				receiver: 'controls',
				controls: global_inputs.actions,
				quaternion: quaternion
			});
		}
	}, 1000 / 20); // tweaking this will get you kicked for packet spam
});
