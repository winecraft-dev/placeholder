
var playerList = new Map();

function playerObject(options)
{
	this.position = options.position;
	this.angle = options.angle;
	this.id = options.id;
	this.tag = "player";
	this.name = options.username;
	this.mesh = options.mesh;
	this.mass = options.mass;
	this.Update = function()
	{
		this.mesh.position.set(this.position.x,this.position.y,this.position.z);
		this.mesh.setRotationFromEuler(new THREE.Euler(this.angle.x, this.angle.y, this.angle.z, 'XYZ'));
	}
}

function generatePlayer(scene, object)
{
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
		angle: {x:object.x_ang,y:object.y_ang,z:object.z_ang},
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
	myPlayer.angle = {x:object.x_ang,y:object.y_ang,z:object.z_ang};
}

function removePlayer(object)
{
	//remove player from list AND the scene
	Scene.remove(playerList.get(object.id));
	playerList.delete(object.id);
}
