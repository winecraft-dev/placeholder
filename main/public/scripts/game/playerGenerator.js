
var playerList = new Map();

function playerObject(options)
{
	this.position = options.position;
	this.quaternion = options.quaternion;
	this.id = options.id;
	this.tag = "player";
	this.name = options.username;
	this.mesh = options.mesh;
	this.mass = options.mass;
	this.Update = function()
	{
		this.mesh.position.set(this.position.x,this.position.y,this.position.z);
		this.mesh.quaternion.copy(this.quaternion);
	}
}

function generatePlayer(scene, object)
{
	console.log(object.id);
	//create an object and put into list
	let geo = new THREE.CylinderGeometry(object.radiusTop,object.radiusBot,object.height,object.numSegments);
	let material = new THREE.MeshStandardMaterial({
		roughness: .9,
		flatShading: true,
		color: new THREE.Color(0xff0000),
	});
	let mesh = new THREE.Mesh(geo,material);
	//push the stuff
	playerList.set(object.id,new playerObject({
		position: {x:object.x_pos,y:object.y_pos,z:object.z_pos},
		quaternion: {
			x: object.x_quat,
			y: object.y_quat,
			z: object.z_quat,
			w: object.w_quat
		},
		id: object.id,
		mesh: mesh,
		mass: object.mass,
	}));
	//console.log(playerList[playerList.length-1].mesh);
	scene.add(playerList.get(object.id).mesh);
}

function updatePlayer(object)
{
	//get the object from list and update them here
	let myPlayer = playerList.get(object.id);
	//update player object stuff
	myPlayer.position = {x:object.x_pos,y:object.y_pos,z:object.z_pos};
	myPlayer.quaternion = {
		x: object.x_quat,
		y: object.y_quat,
		z: object.z_quat,
		w: object.w_quat
	};
}

function removePlayer(id)
{
	console.log(id);
	//remove player from list AND the scene
	Scene.remove(playerList.get(id).mesh);
	playerList.delete(id);
}
