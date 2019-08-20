const CANNON = require('cannon');

const GameObject = require('./GameObject.js')

module.exports = class Terrain extends GameObject
{
	constructor(terrainText)
	{
		super(0, 'terrain', 0); // terrain is ALWAYS object 0, mass 0

		this.vertices = []; // arrays to send to the client
		this.faces = [];

		this.cannon_vertices = [];

		var x = 0;
		var y = 0;

		for(var row of terrainText.split('\n'))
		{
			x = 0;
			this.cannon_vertices.push([]);

			for(var vertex of row.split(' '))
			{
				var biome = vertex.charAt(0);
				var z = (Math.round(parseFloat(vertex.substr(1)) * 10) / 10);

				this.cannon_vertices[y].push(z);

				this.vertices.push({
					x: x,
					y: y,
					z: z,
					biome: biome
				});

				x += 1;
			}
			y += 1;
		}
		// at end of loop, x and z will be length and width

		var widthSegments = x - 1;
		var lengthSegments = y - 1;

		var alternate = false;
		for(var vertex = 0; vertex < this.vertices.length - (widthSegments + 1); vertex ++)
		{
			if((vertex % (widthSegments + 1)) == 0)
			{
				if(alternate)
				{
					// vertex,vertex+this.widthSegments+1,vertex+this.widthSegments+2)
					this.faces.push({
						a: vertex,
						b: vertex + widthSegments + 1,
						c: vertex + widthSegments + 2
					});
				}
				else
				{
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
					// vertex,vertex+this.widthSegments,vertex+this.widthSegments+1
					this.faces.push({
						a: vertex,
						b: vertex + widthSegments,
						c: vertex + widthSegments + 1
					});
				}
				else
				{
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
					//vertex,vertex+this.widthSegments,vertex+this.widthSegments+1
					this.faces.push({
						a: vertex,
						b: vertex + widthSegments,
						c: vertex + widthSegments + 1
					});

					this.addBiome(this.faces[this.faces.length - 1]);

					//vertex,vertex+this.widthSegments+1,vertex+this.widthSegments+2
					this.faces.push({
						a: vertex,
						b: vertex + widthSegments + 1,
						c: vertex + widthSegments + 2
					});
				}
				else
				{
					//vertex,vertex-1,vertex+this.widthSegments+1
					this.faces.push({
						a: vertex,
						b: vertex - 1,
						c: vertex + widthSegments + 1
					});

					this.addBiome(this.faces[this.faces.length - 1]);

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

		this.body.addShape(new CANNON.Heightfield(this.cannon_vertices, {
			elementSize: 1
		}));
	}

	addBiome(face)
	{
		var a = Math.abs(this.vertices[face.a].z - this.vertices[face.b].z);
		var b = Math.abs(this.vertices[face.a].z - this.vertices[face.c].z);
		var c = Math.abs(this.vertices[face.b].z - this.vertices[face.c].z);
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

		var converted_vertices = [];
		for(var vertex of this.vertices)
		{
			converted_vertices.push({
				x: vertex.x,
				y: vertex.z,
				z: vertex.y,
				biome: vertex.biome
			});
		}

		base.vertices = converted_vertices; // this is not a shape BECAUSE it is a trimesh
		base.faces = this.faces;

		return base;
	}
}