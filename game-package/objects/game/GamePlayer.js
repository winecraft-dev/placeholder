const CANNON = require('cannon');

const GameObject = require('./GameObject.js');

module.exports = class GamePlayer extends GameObject
{
	constructor(token, username, object_id)
	{
		super(object_id, 10);

		this.token = token;
		this.username = username;
		this.team = 0;

		this.cylinder_radiusTop = 1;
		this.cylinder_radiusBot = 1;
		this.cylinder_height = 1;
		this.cylinder_numSegments = 20;

		this.shape = new CANNON.Cylinder(this.cylinder_radiusTop, this.cylinder_radiusBot, this.cylinder_height, this.cylinder_numSegments);
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
}