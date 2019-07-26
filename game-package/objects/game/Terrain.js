const CANNON = require('cannon');

const GameObject = require('./GameObject.js')

module.exports = class Terrain extends GameObject
{
	constructor(terrainText)
	{
		super(0, 0); // terrain is ALWAYS object 0, mass 0

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
				var y = parseFloat(vertex.substr(1)) / 2;

				this.vertices.push({
					x: x,
					y: y,
					z: z,
					biome: biome
				});
				this.cannon_vertices.push(x);
				this.cannon_vertices.push(y);
				this.cannon_vertices.push(z);
				x += .5;
			}
			z += .5;
		}
		// at end of loop, x and z will be length and width

		var widthSegments = (x * 2) - 1;
		var lengthSegments = (z * 2) - 1;

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

		this.body.addShape(new CANNON.Trimesh(this.cannon_vertices, this.cannon_faces));
	}

	addBiome(face)
	{
		var a = Math.abs(this.vertices[face.a].y - this.vertices[face.b].y);
		var b = Math.abs(this.vertices[face.a].y - this.vertices[face.c].y);
		var c = Math.abs(this.vertices[face.b].y - this.vertices[face.c].y);
		var vertexHeightDifference = Math.max(a, b, c);

		if(vertexHeightDifference > 5 / 4)
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

	downloadInitial()
	{
		var base = super.downloadInitial();

		base.vertices = this.vertices;
		base.faces = this.faces;
		base.cannon_faces = this.cannon_faces;
		base.cannon_vertices = this.cannon_vertices;

		return base;
	}
}