var terrain;

function terrainObject(options)
{
	this.id = options.id;
	this.position= options.position;
	this.rotation= options.rotation;
}

function generateTerrain(scene, object)
{
	var three_vertices = [];
	var three_faces = [];

	for(var vertex of object.vertices)
	{
		three_vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
	}
	for(var face of object.faces)
	{
		three_faces.push(new THREE.Face3(face.a, face.b, face.c));
		colorFace(three_faces[three_faces.length - 1], face.biome);
	}
	var geo = new THREE.Geometry();
	geo.vertices = three_vertices;
	geo.faces = three_faces;

	let material = new THREE.MeshStandardMaterial({
		roughness: .95,
		flatShading: true,
		vertexColors: THREE.FaceColors
	});
	let plane = new THREE.Mesh(geo, material);

	plane.position.set(object.x_pos, object.y_pos, object.z_pos);
	plane.receiveShadow = true;
	plane.castShadow = true;
	scene.add(plane);
}


function colorFace(face, biome)
{
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
}
