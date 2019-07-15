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
			var id = result.id;
			var username = result.username;

			players.set(token, new OnlinePlayer(token, id, username, socket));
			Logger.green("Player \"" + token + "\" has connected");
			return true;
		}
		return false;
	}

	static hasPlayer(token)
	{
		return players.has(token);
	}

	static playerDisconnect(token)
	{
		if(players.has(token))
		{
			// notify Match Maker unqueue of player in queue
			
			MainManager.playerDisconnect(players.get(token).id);
			players.delete(token);
			Logger.red("Player \"" + token + "\" has disconnected");
		}
	}

	/*
	*	These two methods are for players who have already been queued
	*	and are in a match, so the games have to know about it
	*/

	/*
	static playerReconnect(game_id, token, socket)
	{
		// notify game of the reconnection

		players.set(id, new OnlinePlayer(id, username, socket));
		Logger.green("Player \"" + username + "\" has reconnected to Game \"" + game_id + "\"");
	}

	static playerGameDisconnect(game_id, token)
	{
		if(players.has(id))
		{
			var username = players.get(id).username;
			players.delete(id);

			// notify game of the disconnect

			Logger.red("Player \"" + username + "\" has disconnected from Game \"" + game_id + "\"");
		}
	}*/

	static start()
	{
		const GameManager = require('./GameManager.js');

		new WebSocketServer({
			port: 1357,
			verifyClient: function(info, callback) {
				callback(true);
			}
		}).on('connection', function(socket, req) {
			var game_id = null;
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
						if(!(await OnlinePlayerManager.playerConnect(message.token, socket)))
						{
							socket.close();
						}
						else
						{
							token = message.token;
						}
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