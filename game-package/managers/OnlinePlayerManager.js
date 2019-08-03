const WebSocketServer = require('ws').Server;

const GameManager = require('./GameManager.js');
const MainManager = require('./MainManager.js');

const Logger = require(rootDirectory + '/objects/Logger.js');
const OnlinePlayer = require(rootDirectory + '/objects/OnlinePlayer.js');

var players;

module.exports = class OnlinePlayerManager
{
	static async initialize()
	{
		players = new Map();
		OnlinePlayerManager.start();
	}

	/*
	*	These two methods are for players who have yet to be queued
	*/
	static async playerConnect(token, socket)
	{
		// notify Match Maker of new player in queue

		var result = await MainManager.playerConnect(token);

		if(result != null)	
		{
			Logger.green("Player \"" + token + "\" has connected");
			
			players.set(token, new OnlinePlayer(token, result.id, result.username, socket));
			
			GameManager.playerConnect(token, result.username);
			return true;
		}
		return false;
	}

	static hasPlayer(token)
	{
		return players.has(token);
	}

	static handleMessage(token, receiver, message)
	{
		switch(receiver)
		{
			// other cases may be things like party commands, think about it later
			default:
				GameManager.handleMessage(token, receiver, message);
				break;
		}
	}

	static sendMessage(token, message)
	{
		if(players.has(token))
			players.get(token).send(message);
	}

	static playerDisconnect(token)
	{
		if(players.has(token))
		{
			Logger.red("Player \"" + token + "\" has disconnected");

			MainManager.playerDisconnect(players.get(token).id);
			GameManager.playerDisconnect(token);

			players.delete(token);
		}
	}

	static start()
	{
		new WebSocketServer({
			port: 1357,
			verifyClient: function(info, callback) {
				callback(true);
			}
		}).on('connection', function(socket, req) {
			var token = null;

			setTimeout(function() {
				if(token == null)
					socket.close();
			}, 5000);

			socket.on('message', async function(message) {
				var message = JSON.parse(message);

				if(message.receiver)
				{
					if(message.receiver == "token" && message.token)
					{
						if(OnlinePlayerManager.hasPlayer(message.token))
						{
							socket.close();
						}
						else if(!(await OnlinePlayerManager.playerConnect(message.token, socket)))
						{
							socket.close();
						}
						else
						{
							token = message.token;
						}
					}
					else if(token != null)
					{
						OnlinePlayerManager.handleMessage(token, message.receiver, message)
					}
				}
			});

			socket.on('close', function() {
				if(token != null)
					OnlinePlayerManager.playerDisconnect(token);
			});
		});
	}
}