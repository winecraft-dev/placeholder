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

	updateControls(controls)
	{
		/*
		if(controls.up == true)
		{
			this.body.velocity.set(5, 0, 0);
		}
		if(controls.down == true)
		{
			this.body.velocity.set(-5, 0, 0);
		}
		if(controls.left == true)
		{
			this.body.velocity.set(0, -5, 0);
		}
		if(controls.right == true)
		{
			this.body.velocity.set(0, 5, 0);
		}
		if(controls.jump == true)
		{
			this.body.velocity.set(0, 0, 5);
		}
		*/
	}
}