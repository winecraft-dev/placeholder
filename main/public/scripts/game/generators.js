var objectList = new Map();

function addObject(id, type, self, object)
{
	switch(type)
	{
		case 'terrain':
			objectList.set(id, new Terrain(id, object));
			break;
		case 'player':
			objectList.set(id, new Player(id, self, object));
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

function Terrain(id, object)
{
	this.update = function(object) {
		this.mesh.position.set(object.x_pos, object.y_pos, object.z_pos);
		this.mesh.quaternion.copy({
			x: object.x_quat,
			y: object.y_quat,
			z: object.z_quat,
			w: object.w_quat
		});
	};

	this.remove = function() {
		scene.remove(this.mesh);
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

	for(var vertex of object.vertices)
	{
		three_vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
	}
	for(var face of object.faces)
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
	this.update(object);

	scene.add(this.mesh); // adds the mesh to the global scene

	
}

function Player(id, self, object)
{
	this.update = function(object) {
		this.mesh.position.set(object.x_pos, object.y_pos, object.z_pos);
		this.mesh.quaternion.copy({
			x: object.x_quat,
			y: object.y_quat,
			z: object.z_quat,
			w: object.w_quat
		});
	};

	this.remove = function() {
		scene.remove(this.mesh);
	};

	// actual construction of the player object:
	this.id = id;
	this.self = self;

	this.geometry = new THREE.CylinderGeometry(object.radiusTop, object.radiusBot, object.height, object.numSegments);

	this.material = new THREE.MeshStandardMaterial({
		roughness: .9,
		flatShading: true,
		color: this.self == true ? new THREE.Color(0x0000ff) : new THREE.Color(0xff0000)
	});

	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.receiveShadow = true;
	this.mesh.castShadow = true;
	this.update(object);

	scene.add(this.mesh);
}