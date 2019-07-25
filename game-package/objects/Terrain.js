const CANNON = require('cannon');

const heights = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

module.exports = class Terrain
{
	constructor(terrainText)
	{
		this.vertices = []; // arrays to send to the client
		this.faces = [];

		this.cannon_vertices = [];
		this.cannon_faces = [];

		var x = 0;
		var z = 0;

		for(var row of terrainText.split('\n'))
		{
			x = 0;
			for(var vertex of row.split(' '))
			{
				var biome = vertex.charAt(0);
				var y = heights.indexOf(vertex.charAt(1));

				this.vertices.push({
					x: x,
					y: y,
					z: z,
					biome: biome
				});
				this.cannon_vertices.push(x);
				this.cannon_vertices.push(y);
				this.cannon_vertices.push(z);
				x ++;
			}
			z ++;
		}
		// at end of loop, x and z will be length and width

		var widthSegments = x - 1;
		var lengthSegments = z - 1;
		console.log(widthSegments, lengthSegments);

		var alternate = false;
		for(var vertex = 0; vertex < this.vertices.length - (widthSegments + 1); vertex ++)
		{
			if((vertex % (widthSegments + 1)) == 0)
			{
				if(alternate)
				{
					this.cannon_faces.push(vertex);
					this.cannon_faces.push(vertex + widthSegments + 1);
					this.cannon_faces.push(vertex + widthSegments + 2);

					// vertex,vertex+this.widthSegments+1,vertex+this.widthSegments+2)
					this.faces.push({
						a: vertex,
						b: vertex + widthSegments + 1,
						c: vertex + widthSegments + 2
					});
				}
				else
				{
					this.cannon_faces.push(vertex);
					this.cannon_faces.push(vertex + widthSegments + 1);
					this.cannon_faces.push(vertex + 1);

					// vertex,vertex+this.widthSegments+1,vertex+1
					this.faces.push({
						a: vertex,
						b: vertex + widthSegments + 1,
						c: vertex + 1
					});
				}
			}
			else if(((vertex + 1) % (widthSegments + 1)) == 0)
			{
				if(alternate)
				{
					console.log("a", vertex);
					this.cannon_faces.push(vertex);
					this.cannon_faces.push(vertex + widthSegments);
					this.cannon_faces.push(vertex + widthSegments + 1);

					// vertex,vertex+this.widthSegments,vertex+this.widthSegments+1
					this.faces.push({
						a: vertex,
						b: vertex + widthSegments,
						c: vertex + widthSegments + 1
					});
				}
				else
				{
					this.cannon_faces.push(vertex);
					this.cannon_faces.push(vertex - 1);
					this.cannon_faces.push(vertex + widthSegments + 1);

					//vertex,vertex-1,vertex+this.widthSegments+1
					this.faces.push({
						a: vertex,
						b: vertex - 1,
						c: vertex + widthSegments + 1
					});
				}
			}
			else
			{
				if(alternate)
				{
					console.log("a", vertex);
					this.cannon_faces.push(vertex);
					this.cannon_faces.push(vertex + widthSegments);
					this.cannon_faces.push(vertex + widthSegments + 1);

					//vertex,vertex+this.widthSegments,vertex+this.widthSegments+1
					this.faces.push({
						a: vertex,
						b: vertex + widthSegments,
						c: vertex + widthSegments + 1
					});

					this.addBiome(this.faces[this.faces.length - 1]);

					this.cannon_faces.push(vertex);
					this.cannon_faces.push(vertex + widthSegments + 1);
					this.cannon_faces.push(vertex + widthSegments + 2);

					//vertex,vertex+this.widthSegments+1,vertex+this.widthSegments+2
					this.faces.push({
						a: vertex,
						b: vertex + widthSegments + 1,
						c: vertex + widthSegments + 2
					});
				}
				else
				{
					console.log("b", vertex);
					this.cannon_faces.push(vertex);
					this.cannon_faces.push(vertex  - 1);
					this.cannon_faces.push(vertex + widthSegments + 1);

					//vertex,vertex-1,vertex+this.widthSegments+1
					this.faces.push({
						a: vertex,
						b: vertex - 1,
						c: vertex + widthSegments + 1
					});

					this.addBiome(this.faces[this.faces.length - 1]);

					this.cannon_faces.push(vertex);
					this.cannon_faces.push(vertex + widthSegments + 1);
					this.cannon_faces.push(vertex + 1);

					//vertex,vertex+this.widthSegments+1,vertex+1
					this.faces.push({
						a: vertex,
						b: vertex + widthSegments + 1,
						c: vertex + 1
					});
				}
			}
			this.addBiome(this.faces[this.faces.length - 1]);

			if(((vertex + 1) % (widthSegments + 1) == 0) && ((widthSegments % 2) != 0))
			{
				alternate = !alternate;
			}
			alternate = !alternate;
		}

		this.groundBody = new CANNON.Body({ mass: 0 });
		this.groundBody.addShape(new CANNON.Trimesh(this.cannon_vertices, this.cannon_faces));
	}

	addBiome(face)
	{
		console.log(face);
		var a = Math.abs(this.vertices[face.a].y - this.vertices[face.b].y);
		var b = Math.abs(this.vertices[face.a].y - this.vertices[face.c].y);
		var c = Math.abs(this.vertices[face.b].y - this.vertices[face.c].y);
		var vertexHeightDifference = Math.max(a, b, c);

		if(vertexHeightDifference > 5)
		{
			face.biome = 0; // rock
		}
		else
		{
			switch(this.vertices[face.a].biome)
			{
				case 'd':
					face.biome = 1; // desert
					break;
				case 'g':
					face.biome = 2; // grassy
					break;
				case 't':
					face.biome = 3; // tunrda
					break;
				default:
					face.biome = 2; // default is just grassy
					break;
			}
		}
	}

	addTo(world)
	{
		world.addBody(this.groundBody);
	}

	getTerrain()
	{
		return {
			vertices: this.vertices,
			faces: this.faces,
			cannon_vertices: this.cannon_vertices,
			cannon_faces: this.cannon_faces
		};
	}
}