const Game = require(rootDirectory + '/objects/game/Game.js');
const GamePlayer = require(rootDirectory + '/objects/game/GamePlayer.js');

var game_id;
var games;

var queueing;

var object_id = -1;

module.exports = class GameManager
{
	static async initialize()
	{
		game_id = 0;
		games = new Map();

		queueing = new Map();

		GameManager.createGame(new Map());
	}

	static createGame(players)
	{
		games.set(game_id, new Game(game_id, players));
		game_id ++;
	}

	static playerConnect(token, username)
	{
		// indexing 0 because only one game for testing purposes
		games.get(0).addPlayer(new GamePlayer(token, username, object_id --));
		games.get(0).playerConnect(token);
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