const CANNON = require('cannon');

module.exports = class GameObject
{
	constructor(id, mass)
	{
		this.id = id;

		this.body = new CANNON.Body({
			mass: mass
		});
	}

	addTo(world)
	{
		world.add(this.body);
	}

	updatePosition(x_pos, y_pos, z_pos)
	{
		this.body.position = new CANNON.Vec3(x_pos, y_pos, z_pos);
	}

	downloadInitial() 
	{
		return {
			id: this.id,
			mass: this.body.mass,
			x_pos: this.body.position.x,
			y_pos: this.body.position.y,
			z_pos: this.body.position.z
		}
	}

	downloadUpdates() 
	{ 
		return {
			id: this.id,
			x_pos: this.body.position.x,
			y_pos: this.body.position.y,
			z_pos: this.body.position.z,
		}
	}
}