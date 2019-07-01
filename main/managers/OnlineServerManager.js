const WebSocketServer = require('ws').Server;

const ExpressManager = require('./ExpressManager.js');

const ServerDatabaseModel = require(rootDirectory + '/models/ServerDatabaseModel.js');

const Logger = require(rootDirectory + '/objects/utilities/Logger.js');
const OnlineServer = require(rootDirectory + '/objects/OnlineServer.js');

var servers;

module.exports = class OnlineServerManager
{
	static async initialize()
	{
		servers = new Map();
		OnlineServerManager.start();

		setInterval(function() {
			console.log(servers);
		}, 1000);
	}

	static async serverConnect(id, socket)
	{
		var serverResult = await ServerDatabaseModel.getServerById(id);

		servers.set(id, new OnlineServer(serverResult.single(), socket));
		Logger.green("Server \"" + serverResult.single().name + "\" has connected");
	}

	static handleMessage(id, receiver, message)
	{
		switch(receiver)
		{
			case 'player_count':
				if(message.player_count && servers.has(id))
					servers.get(id).setPlayerCount(message.player_count);
				break;
			default:
				break;
		}
	}

	static hasServer(id)
	{
		return servers.has(id);
	}

	static async serverDisconnect(id)
	{
		if(servers.has(id))
		{
			var server = servers.get(id);
			Logger.red("Server \"" + server.getName() + "\" has disconnected");
			servers.delete(id);
		}
	}

	static start()
	{
		new WebSocketServer({
			port: 1356,
			verifyClient: function(info, callback) {
				(ExpressManager.getSessionParser())(info.req, {}, async function() {
					if(info.req.session.id && !OnlineServerManager.hasServer(info.req.session.id))
						callback(true);
					else
						callback(false);
				});
			}
		}).on('connection', function(socket, req) {
			var id = req.session.id;

			OnlineServerManager.serverConnect(id, socket);

			socket.on('message', function(message) {
				var message = JSON.parse(message);
				if(message.receiver)
					OnlineServer.handleMessage(id, message.receiver, message);
			});
			socket.on('close', function() {
				OnlineServerManager.serverDisconnect(id);
			});
		});
	}
}