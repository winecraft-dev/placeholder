const request = require('request');
const WebSocket = require('ws');

const ConfigManager = require('./ConfigManager.js');

const Logger = require(rootDirectory + '/objects/Logger.js');

var session;
var timeout;
var ws;

module.exports = class MainManager
{
	static async initialize()
	{
		timeout = false;
		session = request.jar();

		await MainManager.login();
		MainManager.start();

		setInterval(function() {
			//MainManager.pulse();
		}, 120000);
	}

	static async pulse()
	{
		var result = await MainManager.post("/servers/pulse", { });

		if(result != "SUCCESS")
		{
			Logger.red("Pulse failed; Response: " + result);
			process.exit();
		}
		else
		{
			console.log("test");
		}
	}

	static async login()
	{
		var result = await MainManager.post("/servers/login", {
			name: ConfigManager.get('name'),
			password: ConfigManager.get('password')
		});

		if(result == "SUCCESS")
		{
			Logger.green("Logged into " + ConfigManager.get('ip'));
		}
		else
		{
			Logger.red("Login failed; Response: " + result);
			process.exit();
		}
	}

	static async playerConnect(token)
	{
		var result = await MainManager.post("/servers/playerconnect", {
			token: token
		});

		if(result.id && result.username)
		{
			return result;
		}
		else if(result == "NOT CONNECTED" || result == "TOKEN NOT PROVIDED")
		{
			Logger.red("Player data fetch failed; Response: " + result);
		}
		else
		{
			return null;
		}
	}

	static playerDisconnect(player_id)
	{
		MainManager.sendMessage({
			receiver: 'player_disconnect',
			player: player_id
		});
	}

	static get(path)
	{
		return (new Promise(function(resolve) {
			if(!timeout)
			{
				request.get({
					url: "http://" + ConfigManager.get('ip') + ":" + ConfigManager.get('http_port') + path,
					json: true,
					jar: session
				}, function(error, response, body) {
					if(error)
					{
						//throw error;
						Logger.red("Connection Refused, Main Server Down");
						timeout = true;
						process.exit();
					}
					if(body == "NOT LOGGED IN")
					{
						Logger.red("Login Failed");
						timeout = true;
						process.exit();
					}
					resolve(body);
				});
			}
		}));
	}

	static post(path, body)
	{
		return (new Promise(function(resolve) {
			if(!timeout)
			{
				request.post({
					url: "http://" + ConfigManager.get('ip') + ":" + ConfigManager.get('http_port') + path,
					json: true,
					jar: session,
					body: body
				}, function(error, response, body) {
					if(error)
					{
						//throw error;
						Logger.red("Connection Refused, Main Server Down");
						timeout = true;
						process.exit();
					}
					if(body == "NOT LOGGED IN")
					{
						Logger.red("Not Logged In!");
						timeout = true;
						process.exit();
					}
					resolve(body);
				});
			}
		}));
	}

	static sendMessage(message)
	{
		ws.send(JSON.stringify(message));
	}

	static handleMessage(receiver, message)
	{
		switch(receiver)
		{

		}
	}

	static start()
	{
		var url = "ws://" + ConfigManager.get('ip') + ":1356";

		ws = new WebSocket(url, {
			headers: {
				Cookie: session.getCookieString(url)
			}
		});

		ws.on('open', function() {
			Logger.green("Connected to " + ConfigManager.get('ip'));
		}).on('error', function(e) {
			Logger.red(e);
		}).on('message', function(message) {
			var data = JSON.parse(message);
			if(data.receiver)
				MainManager.handleMessage(data.receiver, data);
		}).on('close', function() {
			Logger.red("Connection to " + ConfigManager.get('ip') + " closed");
			process.exit();
		});
	}
}