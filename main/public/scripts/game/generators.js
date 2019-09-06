var objectList = new Map();

var selfID = null;
var selfRotationSpeed = .003;

function addObject(id, type, self, object)
{
	switch(type)
	{
		case 'terrain':
			objectList.set(id, new Terrain(id, object));
			break;
		case 'player':
			objectList.set(id, new Player(id, self, object));
			if(self)
				selfID = id;
			break;
	}
}

function updateObject(id, type, object)
{
	if(objectList.has(id))
	{
		objectList.get(id).update(object);
	}
}

function removeObject(id)
{
	if(objectList.has(id))
	{
		objectList.get(id).remove();
		objectList.delete(id);
	}
}

function Terrain(id, initobject)
{
	this.update = function(updateobject) {
		this.mesh.position.set(updateobject.position.x, updateobject.position.y, updateobject.position.z);
		this.mesh.quaternion.set(updateobject.quaternion.x, updateobject.quaternion.y, updateobject.quaternion.z, updateobject.quaternion.w);
	};

	this.remove = function() {
		global_scene.remove(this.mesh);
	};

	this.colorFace = function(face, biome) {
		if(biome == 0)
		{
			face.color.setStyle("#918679");
			face.color.add(new THREE.Color(THREE.Math.randFloat(-.02,.02),THREE.Math.randFloat(-.02,.02),THREE.Math.randFloat(-.02,.02)));
		}
		else if(biome == 1)
		{
			face.color.setStyle("#ff00ff");
			face.color.add(new THREE.Color(THREE.Math.randFloat(-.02,.02),THREE.Math.randFloat(-.05,.05),THREE.Math.randFloat(-.01,.01)));
		}
		else if(biome == 2)
		{
			face.color.setStyle("#3db020");
			face.color.add(new THREE.Color(THREE.Math.randFloat(-.02,.02),THREE.Math.randFloat(-.05,.05),THREE.Math.randFloat(-.01,.01)));
		}
		else if(biome == 3)
		{

		}
	};

	// actual construction of the terrain object
	this.id = id;

	var three_vertices = [];
	var three_faces = [];

	for(var vertex of initobject.vertices)
	{
		three_vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
	}
	for(var face of initobject.faces)
	{
		three_faces.push(new THREE.Face3(face.a, face.b, face.c));
		this.colorFace(three_faces[three_faces.length - 1], face.biome);
	}

	this.geometry = new THREE.Geometry();
	this.geometry.vertices = three_vertices;
	this.geometry.faces = three_faces;

	this.material = new THREE.MeshStandardMaterial({
		roughness: .95,
		flatShading: true,
		vertexColors: THREE.FaceColors
	});
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.receiveShadow = true;
	this.mesh.castShadow = true;
	this.update(initobject);

	global_scene.add(this.mesh); // adds the mesh to the global scene
}

function Player(id, self, initobject)
{
	this.update = function(updateobject) {

		if(updateobject.velocity != undefined)
			this.velocity.set(updateobject.velocity.x,updateobject.velocity.y,updateobject.velocity.z);

		let objectFacingQuaternion = new THREE.Quaternion(updateobject.facing.x, updateobject.facing.y, updateobject.facing.z, updateobject.facing.w);
		let objectFacingEuler = new THREE.Euler();
		objectFacingEuler.setFromQuaternion(objectFacingQuaternion,"YXZ");
		objectFacingEuler.x *= 1;
		// boi this is some ugly ass code
		if(!this.self)
		{
			//console.log(updateobject);
			this.head.mesh.quaternion.set(updateobject.facing.x, updateobject.facing.y, updateobject.facing.z, updateobject.facing.w);
		}
		this.body.mesh.quaternion.set(updateobject.quaternion.x, updateobject.quaternion.y, updateobject.quaternion.z, updateobject.quaternion.w);
		// later this position will need to be interpolated, not just straight up set
		this.head.mesh.position.set(updateobject.position.x + this.head.offset.x,
			updateobject.position.y + this.head.offset.y,
			updateobject.position.z + this.head.offset.z
		);
		this.body.mesh.position.set(updateobject.position.x,
			updateobject.position.y,
			updateobject.position.z
		);
		this.feet.mesh.position.set(updateobject.position.x + this.feet.offset.x,
			updateobject.position.y + this.feet.offset.y,
			updateobject.position.z + this.feet.offset.z
		);

		this.model3D.position.set(updateobject.position.x,updateobject.position.y,updateobject.position.z);
		this.model3D.rotation.set(0,objectFacingEuler.y,0);
		this.model3D.getObjectByName("Head").rotation.set(objectFacingEuler.x,Math.PI,0);
	};

	this.updateVelocity = function()
	{
		this.velocity.add(new THREE.Vector3(0,-10,0));
		this.model3D.position.add(new THREE.Vector3(this.velocity.x * global_time.getDelta,this.velocity.y * global_time.getDelta,this.velocity.z * global_time.getDelta));
	}

	this.remove = function() {
		global_scene.remove(this.head.mesh);
		global_scene.remove(this.body.mesh);
		global_scene.remove(this.feet.mesh);
		global_scene.remove(this.model3D);
	};

	this.getPosition = function() {
		return this.body.mesh.position;
	};

	this.getRotation = function() {
		return this.head.mesh.rotation;
	};

	this.getQuaternion = function() {
		return this.head.mesh.quaternion;
	};

	// function called by inputManager to update the rotation of the self player
	this.updateInputs = function(x, y) {
		var x_rot = this.head.mesh.rotation.x + (y * selfRotationSpeed * -1);
		var y_rot = this.head.mesh.rotation.y + (x * selfRotationSpeed * -1);
		var z_rot = 0;

		if(x_rot >= Math.PI / 2)
			x_rot = Math.PI / 2;
		else if(x_rot <= Math.PI / -2)
			x_rot = Math.PI / -2;


		this.head.mesh.rotation.set(x_rot, y_rot, z_rot, 'YXZ');
	};

	// actual construction of the player object:
	this.id = id;
	this.username = initobject.username;
	this.self = self;

	this.velocity = new THREE.Vector3(0,0,0);

	this.material = new THREE.MeshStandardMaterial({
		roughness: .9,
		flatShading: true,
		color: this.self == true ? new THREE.Color(0x0000ff) : new THREE.Color(0xff0000)
	});

	this.head = {
		geometry: new THREE.BoxGeometry(initobject.head_diameter,
			initobject.head_diameter,
			initobject.head_diameter
		),
		offset: new THREE.Vector3(initobject.head_offset.x,
			initobject.head_offset.y,
			initobject.head_offset.z
		)
	};
	this.body = {
		geometry: new THREE.CylinderGeometry(initobject.body_radius,
			initobject.body_radius,
			initobject.body_height,
			initobject.body_numSegments
		),
		offset: new THREE.Vector3(initobject.body_offset.x,
			initobject.body_offset.y,
			initobject.body_offset.z
		)
	};
	this.feet = {
		geometry: new THREE.SphereGeometry(initobject.body_radius,
			initobject.body_numSegments,
			initobject.body_numSegments
		),
		offset: new THREE.Vector3(initobject.feet_offset.x,
			initobject.feet_offset.y,
			initobject.feet_offset.z
		)
	};
	this.head.mesh = new THREE.Mesh(this.head.geometry, this.material);
	this.head.mesh.receiveShadow = true;
	this.head.mesh.castShadow = true;
	this.body.mesh = new THREE.Mesh(this.body.geometry, this.material);
	this.body.mesh.receiveShadow = true;
	this.body.mesh.castShadow = true;
	this.feet.mesh = new THREE.Mesh(this.feet.geometry, this.material);
	this.feet.mesh.receiveShadow = true;
	this.feet.mesh.castShadow = true;

	this.model3D = global_models.getModel("bigHead").clone();
	for(let obj of this.model3D.children)
	{
		obj.material = this.material;
	}
	this.update(initobject); //

	if(!this.self)
	{
		//global_scene.add(this.head.mesh);
		//global_scene.add(this.body.mesh);
		//global_scene.add(this.feet.mesh);
		global_scene.add(this.model3D);
	}
}

function getSelfPosition()
{
	if(selfID != null)
	{
		return objectList.get(selfID).getPosition();
	}
}

function getSelfRotation()
{
	if(selfID != null)
	{
		return objectList.get(selfID).getRotation();
	}
	return null;
}

function getSelfQuaternion()
{
	if(selfID != null)
	{
		return objectList.get(selfID).getQuaternion();
	}
	return null;
}

function updateSelfInputs(movement, actions)
{
	if(selfID != null)
	{
		objectList.get(selfID).updateInputs(movement.x, movement.y);
	}
}
