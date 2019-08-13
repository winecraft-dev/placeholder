const keyToAction = new Map();
keyToAction.set(87, 'move_forward');
keyToAction.set(83, 'move_backward');
keyToAction.set(65, 'move_left');
keyToAction.set(68, 'move_right');
keyToAction.set(16, 'crouch');
keyToAction.set(32, 'jump');
keyToAction.set(0, 'fire1'); // mouse 1-3
keyToAction.set(1, 'fire2');
keyToAction.set(2, 'fire3');

function Inputs(/* might have a way to get keys->action binds*/)
{
	var self = this;

	this.actions = {
		move_forward: false,
		move_backward: false,
		move_left: false,
		move_right: false,
		crouch: false,
		jump: false,
		fire1: false,
		fire2: false,
		fire3: false
	};
	this.inPointerLock = false;
	this.mousePosition = { x: 0, y: 0 }
	this.lastMousePos = { x: 0, y: 0 };

	this.actionUpdate = function(key, up)
	{
		if(this.inPointerLock == true && keyToAction.has(key))
			this.actions[keyToAction.get(key)] = up;
	}

	this.updateRotation = function(x, y)
	{
		//console.log(y);
		this.mousePosition.x += x;
		this.mousePosition.y += y;

		// calls global function to
		updateSelfRotation(this.mousePosition.x - this.lastMousePos.x, this.mousePosition.y - this.lastMousePos.y);

		this.lastMousePos.x = this.mousePosition.x;
		this.lastMousePos.y = this.mousePosition.y;
	}

	this.displayMenu = function()
	{
		$('.menu').show();
	}

	this.hideMenu = function()
	{
		$('.menu').hide();
	}

	window.addEventListener('keydown', function(e) {
		self.actionUpdate(e.which, true);
	}, false);
	window.addEventListener('keyup', function(e) {
		self.actionUpdate(e.which, false);
	}, false);
	window.addEventListener('mousedown', function(e) {
		self.actionUpdate(e.button, true);
	}, false);
	window.addEventListener('mouseup', function(e) {
		self.actionUpdate(e.button, false);
	}, false);

	this.id_sendLoop = setInterval(function() {
		// calls global websocket connection object
		global_connection.send({
			receiver: 'controls',
			controls: self.actions,
			quaternion: getSelfQuaternion()
		});
	}, 1000 / 20); // tweaking this will get you kicked for packet spam

	document.body.getElementsByTagName('canvas')[0].addEventListener('click', function(e) {
		self.hideMenu();
		let element = document.body.getElementsByTagName('canvas')[0];
		element.requestPointerLock = element.requestPointerLock ||
									element.mozRequestPointerLock ||
									element.webkitRequestPointerLock;
		if(!self.inPointerLock)
		{
			element.requestPointerLock();
		}
	});
	document.addEventListener('pointerlockchange', function(e) {
		self.inPointerLock = !self.inPointerLock;
	});
	document.body.getElementsByTagName('canvas')[0].addEventListener('disablePointerLock', function() {
		self.displayMenu();
		document.exitPointerLock = document.exitPointerLock ||
									document.mozExitPointerLock ||
									document.webkitExitPointerLock;
		if(self.inPointerLock)
		{
			document.exitPointerLock();
		}
	});

	window.addEventListener('mousemove', function(e) {
		if(self.inPointerLock)
			self.updateRotation(e.movementX, e.movementY);
	});
}
