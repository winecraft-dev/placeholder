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
		var eulerAngle = new CANNON.Vec3(0, 0, 0);
		this.body.quaternion.toEuler(eulerAngle);

		return {
			id: this.id,
			mass: this.body.mass,
			x_pos: this.body.position.x,
			y_pos: this.body.position.z,
			z_pos: this.body.position.y,
			x_ang: eulerAngle.z,
			y_ang: eulerAngle.x,
			z_ang: eulerAngle.y
		}
	}

	downloadUpdates() 
	{
		var eulerAngle = new CANNON.Vec3(0, 0, 0);
		this.body.quaternion.toEuler(eulerAngle);

		return {
			id: this.id,
			x_pos: this.body.position.x,
			y_pos: this.body.position.z,
			z_pos: this.body.position.y,
			x_ang: eulerAngle.y,
			y_ang: eulerAngle.z,
			z_ang: eulerAngle.x
		}
	}
}