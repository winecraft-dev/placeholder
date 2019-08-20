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

		this.cylinder_radiusTop = 1;
		this.cylinder_radiusBot = 1;
		this.cylinder_height = 3;
		this.cylinder_numSegments = 20;

		this.facing = new CANNON.Quaternion(0, 0, 0, 0);

		this.walkRate = 1;

		this.body.addShape(new CANNON.Cylinder(this.cylinder_radiusTop, this.cylinder_radiusBot, this.cylinder_height, this.cylinder_numSegments));
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
		
		var x_vel = ;
		var y_vel = controls.move_forward;
		var z_vel = controls.jump;
		this.body.velocity.set(x_vel, y_vel, z_vel);
	}
}