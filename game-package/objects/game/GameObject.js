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

	removeFrom(world)
	{
		world.remove(this.body);
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
			y_pos: this.body.position.z,
			z_pos: this.body.position.y,
			x_quat: -1 * this.body.quaternion.x,
			y_quat: -1 * this.body.quaternion.z,
			z_quat: -1 * this.body.quaternion.y,
			w_quat: this.body.quaternion.w
		}
	} //268

	downloadUpdates() 
	{
		return {
			id: this.id,
			x_pos: this.body.position.x,
			y_pos: this.body.position.z,
			z_pos: this.body.position.y,
			x_quat: -1 * this.body.quaternion.x,
			y_quat: -1 * this.body.quaternion.z,
			z_quat: -1 * this.body.quaternion.y,
			w_quat: this.body.quaternion.w
		}
	}
}