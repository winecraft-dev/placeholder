const Game = require(rootDirectory + '/objects/game/Game.js');

var game_id;
var games;

var queueing;

module.exports = class GameManager
{
	static async initialize()
	{
		game_id = 0;
		games = new Map();

		queueing = new Map();

		GameManager.createGame([]); // passes an empty array, but should be an array of object token, username
	}

	static createGame(players)
	{
		games.set(game_id, new Game(game_id, players));
		game_id ++;
	}

	static playerConnect(token, username)
	{
		// indexing 0 because only one game for testing purposes
		games.get(0).addPlayer(token, username);
		games.get(0).playerConnect(token);
	}

	static handleMessage(token, receiver, message)
	{
		GameManager.getGameByPlayer(token).handleMessage(token, receiver, message);
	}

	static getGameByPlayer(token)
	{
		for(var [id, game] of games)
		{
			if(game.hasPlayer(token))
				return game;
		}
		return null;
	}

	static playerDisconnect(token)
	{
		// indexing 0 because only one game for testing purposes
		games.get(0).removePlayer(token);
	}
}