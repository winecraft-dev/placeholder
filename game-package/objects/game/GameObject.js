const CANNON = require('cannon');

module.exports = class GameObject
{
	constructor(id, type, mass, material)
	{
		this.id = id; // object_id
		this.type = type; // "terrain", "player", "chest"...

		this.body = new CANNON.Body({ //defines the cannonjs body
			mass: mass,
			material: material
		});
		this.body.quaternion.setFromEuler(0, 0, Math.Pi, "XYZ");
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

	updateQuaternion(x_quat, y_quat, z_quat, w_quat)
	{
		this.body.quaternion = new CANNON.Quaternion(x_quat, y_quat, z_quat, w_quat);
	}

	downloadInitial() 
	{
		return {
			id: this.id,
			x_pos: this.body.position.x,
			y_pos: this.body.position.z,
			z_pos: this.body.position.y,
			x_quat: this.body.quaternion.x,
			y_quat: this.body.quaternion.y,
			z_quat: this.body.quaternion.z,
			w_quat: this.body.quaternion.w
		}
	}

	downloadUpdates() 
	{
		return {
			id: this.id,
			x_pos: this.body.position.x,
			y_pos: this.body.position.z,
			z_pos: this.body.position.y,
			x_quat: this.body.quaternion.x,
			y_quat: this.body.quaternion.y,
			z_quat: this.body.quaternion.z,
			w_quat: this.body.quaternion.w
		}
	}
}