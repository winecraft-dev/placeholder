var ws;
var open = false;

var ip;
var token;

$(document).ready(function() {
	ip = $('#ip').text();
	token = $('#token').text();
	url = 'ws://' + ip + ':1357';

	ws = new WebSocket(url);

	setTimeout(function() {
		if(!open)
		{
			window.location.reload();
		}
	}, 10000);

	ws.addEventListener('open', function(e) {
		console.log('open');
		open = true;

		ws.send(JSON.stringify({
			receiver: "token",
			token: token
		}));
	});

	ws.addEventListener('message', function(e) {
		var data = JSON.parse(e.data);
		console.log(data);
	});

	ws.addEventListener('close', function(e) {
		console.log('closed, reloading in 1 second');
		setTimeout(function() {
			window.location.reload();
		}, 1000);
	});
});

send = function(data)
{
	if(open)
		ws.send(JSON.stringify(data));
};

leaveGame = function()
{
	window.location.href = '/leavegame';
};