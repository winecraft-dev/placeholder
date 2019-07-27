
function createFallowCamera(scene,parent,options)
{
	let startingRotation = typeof(options.startingRotation)=='undefined'?new CANNON.Vec3(120,0,0):options.startingRotation;
	let offSet = typeof(options.offSet)=='undefined'?new CANNON.Vec3(0,0,0):options.offSet;
	let maxDistance = typeof(options.maxDistance)=='undefined'?1:options.maxDistance;
	let lerpRate = typeof(options.lerpRate)=='undefined'?.1:options.lerpRate;

	//create object
	this.CameraCore = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	this.Camera = new THREE.Object3D();
	this.Camera.add(this.CameraCore);
	this.Camera.position.copy(offSet);
	this.Camera.quaternion.set(0,startingRotation.y,startingRotation.z,1);
	this.CameraCore.quaternion.set(startingRotation.x,0,0,1);
	scene.add(this.Camera);

	this.parentsOffSet = new THREE.Object3D();
	this.parentsOffSet.position.copy(parent.position.add(offSet));
	parent.add(this.parentsOffSet);



	this.Update = function()
	{
		let parPos = parent.position.clone();
		let vec = offSet.clone();
		vec.applyAxisAngle(new THREE.Vector3(0,1,0),parent.rotation.reorder('YXZ').y);
		//this.Camera.position.lerp(parPos.add(vec),lerpRate);
		console.log(parent.children);
		this.Camera.position.lerp(this.parentsOffSet.getWorldPosition(),lerpRate);
		this.Camera.rotation.copy(parent.rotation);
	}
}

function createStaticCamera()
{

}

function createFlyCamera(scene,pos)
{
	//camera Stuff
	this.position = pos;
	this.rotation = new THREE.Euler(0,0,0,'YXZ');
	this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	scene.add(this.camera);
	//inputs
	this.forwardInput = 0;
	this.sideInput = 0;
	this.UpInput = 0;
	//update Vars
	this.flySpeed = .1;
	this.rotationSpeed = .003;
	this.mouseDif = new THREE.Vector2(0,0);
	this.Update = function()
	{
		this.position.add(new THREE.Vector3(this.flySpeed*this.sideInput,this.flySpeed*this.upInput,this.flySpeed*this.forwardInput).applyEuler(this.rotation));
		this.rotation.set(this.rotation.x+(this.mouseDif.y*this.rotationSpeed*-1),this.rotation.y+(this.mouseDif.x*this.rotationSpeed*-1),0,'YXZ');
		//console.log(this.mouseDif);
		this.camera.position.copy(this.position);
		this.camera.rotation.copy(this.rotation);
		this.mouseDif.set(0,0,0)
	}
}
