const WebSocketServer = require('ws').Server;

const GameManager = require('./GameManager.js');

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
	static playerConnect(id, username, socket)
	{
		// notify Match Maker of new player in queue

		players.set(id, new OnlinePlayer(id, username, socket));
		Logger.green("Player \"" + username + "\" has connected");
	}

	static playerDisconnect(id)
	{
		if(players.has(id))
		{
			// notify Match Maker unqueue of player in queue
			
			var username = players.get(id).username;
			players.delete(id);
			Logger.red("Player \"" + username + "\" has disconnected");
		}
	}

	/*
	*	These two methods are for players who have already been queued
	*	and are in a match, so the games have to know about it
	*/
	static playerReconnect(game_id, id, username, socket)
	{
		// notify game of the reconnection

		players.set(id, new OnlinePlayer(id, username, socket));
		Logger.green("Player \"" + username + "\" has reconnected to Game \"" + game_id + "\"");
	}

	static playerGameDisconnect(game_id, id)
	{
		if(players.has(id))
		{
			var username = players.get(id).username;
			players.delete(id);

			// notify game of the disconnect

			Logger.red("Player \"" + username + "\" has disconnected from Game \"" + game_id + "\"");
		}
	}

	static start()
	{
		const GameManager = require('./GameManager.js');

		new WebSocketServer({
			port: 1357,
			verifyClient: function(info, callback) {
				callback(true);
			}
		}).on('connection', function(socket, req) {
			var id = null;
			var username = null;
			var game_id = null;

			setTimeout(function() {
				if(id == null)
					socket.close();
			}, 5000);

			socket.on('message', function(message) {
				var message = JSON.parse(message);

				if(message.receiver)
				{
					if(message.receiver == "token" && message.id && message.username)
					{
						game_id = GameManager.getPlayerGameId(message.id);
						id = message.id;
						username = message.username;

						if(game_id != null)
							OnlinePlayerManager.playerReconnect(game_id, id, username, socket);
						else
							OnlinePlayerManager.playerConnect(id, username, socket);
					}
					else if(game_id != null)
					{
						OnlinePlayerManager.handleMessage(game_id, id, message.receiver, message);
					}
				}
			});

			socket.on('close', function() {
				if(game_id != null)
					OnlinePlayerManager.playerGameDisconnect(game_id, id);
				else
					OnlinePlayerManager.playerDisconnect(id);
			});
		});
	}
}