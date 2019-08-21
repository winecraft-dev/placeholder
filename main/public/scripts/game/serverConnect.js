function Connection(ip, token)
{
	this.ip = ip;
	this.token = token;

	this.url = 'ws://' + ip + ':1357';
	this.open = false;

	this.ws = new WebSocket(this.url);

	var self = this;
	setTimeout(function() {
		if(!self.open)
		{
			window.location.reload();
		}
	}, 10000);

	this.ws.addEventListener('open', function(e) {
		console.log('connection open');
		self.open = true;

		self.send({
			receiver: "token",
			token: self.token
		});
	});

	this.ws.addEventListener('message', function(e) {
		var data = JSON.parse(e.data);

		switch(data.receiver)
		{
			case 'addobject':
				addObject(data.object.id, data.type, data.self, data.object);
				break;
			case 'updateobject':
				updateObject(data.object.id, data.type, data.object);
				break;
			case 'removeobject':
				removeObject(data.object_id);
				break;
			case 'team_message':
				// to do
				break;
			case 'match_message':
				// to do
				break;
			default:
				break;
		}
	});

	this.ws.addEventListener('close', function(e) {
		this.open = false;
		console.log('close, reloading in 5 seconds');
		setTimeout(function() {
			window.location.reload();
		}, 5000);
	});

	this.send = function(data) {
		if(this.open)
			this.ws.send(JSON.stringify(data));
	};

	this.leave = function() {
		window.location.href = '/leavegame';
	};
}
