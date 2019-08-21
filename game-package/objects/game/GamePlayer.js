const CANNON = require('cannon');

const GameObject = require('./GameObject.js');
const MaterialIndex = require('./MaterialIndex.js');

module.exports = class GamePlayer extends GameObject
{
	constructor(token, username, object_id)
	{
		super(object_id, 'player', 10, MaterialIndex.getMaterial('playerMaterial'));

		this.token = token;
		this.username = username;
		this.team = 0;

		// head construction
		this.head_diameter = 1;
		this.headShape = new CANNON.Box(new CANNON.Vec3(this.head_diameter, this.head_diameter, this.head_diameter));
		
		// body construction
		this.body_radius = 1;
		this.body_height = 3;
		this.body_numSegments = 20;
		this.bodyShape = new CANNON.Cylinder(this.body_radius, this.body_radius, this.body_height, this.body_numSegments);

		// feet construction
		this.feetShape = new CANNON.Sphere(this.body_radius);

		this.headOffset = new CANNON.Vec3(0, 0, this.body_height / 2 + this.head_diameter / 2);
		this.bodyOffset = new CANNON.Vec3(0, 0, 0);
		this.feetOffset = new CANNON.Vec3(0, 0, this.body_height / -2);

		this.body.addShape(this.headShape, this.headOffset);
		this.body.addShape(this.bodyShape, this.bodyOffset);
		this.body.addShape(this.feetShape, this.feetOffset);
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
		base.head_diameter = this.head_diameter;
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
		
		return base;
	}

	downloadUpdates()
	{
		var base = super.downloadUpdates();

		base.x_facing = -1 * this.body.shapeOrientations[0].x;
		base.y_facing = -1 * this.body.shapeOrientations[0].z;
		base.z_facing = -1 * this.body.shapeOrientations[0].y;
		base.w_facing = this.body.shapeOrientations[0].w;

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
		this.body.shapeOrientations[0].copy(new CANNON.Quaternion(-1 * quaternion.x, -1 * quaternion.z, -1 * quaternion.y, quaternion.w));

		if(controls.jump /* && this.onGround? */)
			this.body.velocity.z = 5;
		if(controls.move_forward)
			this.body.velocity.x = 5;
		else if(controls.move_backward)
			this.body.velocity.x = -5;
	}
}