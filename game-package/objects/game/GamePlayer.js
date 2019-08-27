const CANNON = require('cannon');

const GameObject = require('./GameObject.js');
const MaterialIndex = require('./MaterialIndex.js');

module.exports = class GamePlayer extends GameObject
{
	constructor(token, username, object_id)
	{
		super(object_id, 'player', 5, MaterialIndex.getMaterial('playerMaterial'));

		this.token = token;
		this.username = username;
		this.team = 0;

		// head construction
		this.head_radius = .5;
		this.headShape = new CANNON.Box(new CANNON.Vec3(this.head_radius, this.head_radius, this.head_radius));
		
		// body construction
		this.body_radius = 1;
		this.body_height = 3;
		this.body_numSegments = 20;
		this.bodyShape = new CANNON.Cylinder(this.body_radius, this.body_radius, this.body_height, this.body_numSegments);

		// feet construction
		this.feetShape = new CANNON.Sphere(this.body_radius);

		this.headOffset = new CANNON.Vec3(0, 0, this.body_height / 2 + this.head_radius);
		this.bodyOffset = new CANNON.Vec3(0, 0, 0);
		this.feetOffset = new CANNON.Vec3(0, 0, this.body_height / -2);

		this.body.addShape(this.headShape, this.headOffset);
		this.body.addShape(this.bodyShape, this.bodyOffset);
		this.body.addShape(this.feetShape, this.feetOffset);
		this.body.fixedRotation = true;
		this.body.updateMassProperties();

		this.headOrientation = this.body.shapeOrientations[0];
	}

	setTeam(team)
	{
		this.team = team;
	}

	downloadInitial()
	{
		var base = super.downloadInitial();
		
		base.username = this.username;
		base.head_diameter = this.head_radius * 2;
		base.body_radius = this.body_radius;
		base.body_height = this.body_height;
		base.body_numSegments = this.body_numSegments;
		base.head_offset = {
			x: this.headOffset.x,
			y: this.headOffset.z,
			z: this.headOffset.y
		};
		base.body_offset = {
			x: this.bodyOffset.x,
			y: this.bodyOffset.z,
			z: this.bodyOffset.y
		};
		base.feet_offset = {
			x: this.feetOffset.x,
			y: this.feetOffset.z,
			z: this.feetOffset.y
		};
		base.facing = {
			x: this.headOrientation.x,
			y: this.headOrientation.z,
			z: this.headOrientation.y,
			w: this.headOrientation.w
		};
		
		return base;
	}

	downloadUpdates()
	{
		var base = super.downloadUpdates();

		base.facing = {
			x: this.headOrientation.x,
			y: this.headOrientation.z,
			z: this.headOrientation.y,
			w: this.headOrientation.w
		};

		return base;
	}

	/* this.actions = {
		move_forward: false,
		move_backward: false,
		move_left: false,
		move_right: false,
		crouch: false,
		jump: false,
		fire1: false,
		fire2: false,
		fire3: false
	}; */
	updateControls(controls, quaternion)
	{
		// index 0 is the head
		console.log(quaternion);
		this.headOrientation.set(quaternion.x, quaternion.z, quaternion.y, quaternion.w);
		super.updateAngle(quaternion.x, quaternion.z, quaternion.y, quaternion.w);
	}
}