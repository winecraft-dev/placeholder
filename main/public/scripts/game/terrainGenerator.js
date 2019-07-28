var exampleHeightMap =
[
0,0,0,0,0,0,0,0,0,3,2,1,1,1,1,1,0,0,9,3,2,2,1,2,2,1,1
];

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
	plane.receiveShadow = true;
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
