const CANNON = require('cannon');

const GameObject = require('./GameObject.js');

module.exports = class GamePlayer extends GameObject
{
	constructor(token, username, object_id)
	{
		super(object_id, 'player', 10);

		this.token = token;
		this.username = username;
		this.team = 0;

		this.facing = new CANNON.Quaternion(0, 0, 0, 0);

		this.walkRate = 1;

		this.headShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
		this.headOffset = new CANNON.Vec3(0, 0, 1.5 + 1);

		this.bodyShape = new CANNON.Cylinder(1, 1, 3, 20);
		this.bodyOffset = new CANNON.Vec3(0, 0, 0);

		this.feetShape = new CANNON.Sphere(1);
		this.feetOffset = new CANNON.Vec3(0, 0, -1.5);

		this.body.addShape(this.feetShape, this.feetOffset);
		this.body.addShape(this.bodyShape, this.bodyOffset);
		this.body.addShape(this.headShape, this.headOffset);
		this.body.fixedRotation = true;
		this.body.updateMassProperties();
	}

	setTeam(team)
	{
		this.team = team;
	}

	downloadInitial()
	{
		var base = super.downloadInitial();

		base.username = this.username;
		base.radiusTop = this.cylinder_radiusTop;
		base.radiusBot = this.cylinder_radiusBot;
		base.height = this.cylinder_height;
		base.numSegments = this.cylinder_numSegments;

		return base;
	}

	downloadUpdates()
	{
		var base = super.downloadUpdates();

		base.x_facing = -1 * this.facing.x;
		base.y_facing = -1 * this.facing.z;
		base.z_facing = -1 * this.facing.y;
		base.w_facing = this.facing.w;

		return base;
	}

	updateControls(controls, quaternion)
	{
		this.facing = new CANNON.Quaternion(-1 * quaternion.x, -1 * quaternion.z, -1 * quaternion.y, quaternion.w);
		
		//this.body.velocity.set(x_vel, y_vel, z_vel);
	}
}
