var exampleHeightMap =
[
0,0,0,0,0,0,0,0,0,3,2,1,1,1,1,1,0,0,9,3,2,2,1,2,2,1,1
];

function generateTerrain2(scene, vertices, faces)
{
	var three_vertices = [];
	var three_faces = [];

	for(var vertex of vertices)
	{
		three_vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
	}
	for(var face of faces)
	{
		three_faces.push(new THREE.Face3(face.a, face.b, face.c));
		colorFace2(three_faces[three_faces.length - 1], face.biome);
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

function colorFace2(face, biome)
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

function generateTerrain(thisScene, options)
{
	//TO DO: change defaulats to better defaults
	this.width = typeof(options.width)!=='undefined'?options.width:14;
	this.length = typeof(options.length)!=='undefined'?options.length:10;
	this.widthSegments = typeof(options.widthSegments)!=='undefined'?options.widthSegments:200;
	this.lengthSegments = typeof(options.lengthSegments)!=='undefined'?options.lengthSegments:300;
	this.heightMap = typeof(options.heightMap)!=='undefined'?options.heightMap:[];

	let vertices = [];
	let edges = [];
	let num = 0;
	for(let y=0;y<=this.length;y+=this.length/this.lengthSegments)
	{
		for(let x=0;x<=this.width;x+=this.width/this.widthSegments)
		{
				vertices.push(new THREE.Vector3(x-this.width/2,exampleHeightMap[num++],y-this.length/2));
		}
	}

	let alternate = false;
	for(let vertex=0;vertex<vertices.length-(this.widthSegments+1);vertex++)
	{
		if(vertex%(this.widthSegments+1) == 0)
		{
			if(alternate)
			{
				edges.push(new THREE.Face3(vertex,vertex+this.widthSegments+1,vertex+this.widthSegments+2));
			}
			else
			{
				edges.push(new THREE.Face3(vertex,vertex+this.widthSegments+1,vertex+1));
			}
		}
		else if((vertex+1)%(this.widthSegments+1) == 0)
		{
			if(alternate)
			{
				edges.push(new THREE.Face3(vertex,vertex+this.widthSegments,vertex+this.widthSegments+1));
			}
			else
			{
				edges.push(new THREE.Face3(vertex,vertex-1,vertex+this.widthSegments+1));
			}
		}
		else
		{
			if(alternate)
			{
				edges.push(new THREE.Face3(vertex,vertex+this.widthSegments,vertex+this.widthSegments+1));
				colorFace(edges[edges.length-1],vertices);
				edges.push(new THREE.Face3(vertex,vertex+this.widthSegments+1,vertex+this.widthSegments+2));
			}
			else
			{
				edges.push(new THREE.Face3(vertex,vertex-1,vertex+this.widthSegments+1));
				colorFace(edges[edges.length-1],vertices);
				edges.push(new THREE.Face3(vertex,vertex+this.widthSegments+1,vertex+1));
			}
		}

		colorFace(edges[edges.length-1],vertices);

		if((vertex+1)%(this.widthSegments+1) == 0 && this.widthSegments%2 != 0)
		{
			alternate = !alternate;
		}
		alternate = !alternate;
	}
	let geo = new THREE.Geometry();
	geo.vertices = vertices;
	geo.faces = edges;
	let material = new THREE.MeshStandardMaterial({
		roughness: .9,
		flatShading: true,
		vertexColors: THREE.FaceColors
	});
	let plane = new THREE.Mesh(geo,material);
	plane.receiveShadow = true;
	thisScene.add(plane);
}

function colorFace(face,allVertices)
{
	let vertexHeightDifference = Math.max(Math.abs(allVertices[face.a].y - allVertices[face.b].y), Math.abs(allVertices[face.a].y - allVertices[face.c].y),Math.abs(allVertices[face.b].y - allVertices[face.c].y));
	if(vertexHeightDifference > 5)
	{
		face.color.setStyle("#918679");
		face.color.add(new THREE.Color(THREE.Math.randFloat(-.02,.02),THREE.Math.randFloat(-.02,.02),THREE.Math.randFloat(-.02,.02)));
	}
	else
	{
		face.color.setStyle("#3db020");
		face.color.add(new THREE.Color(THREE.Math.randFloat(-.02,.02),THREE.Math.randFloat(-.05,.05),THREE.Math.randFloat(-.01,.01)));
	}
}
