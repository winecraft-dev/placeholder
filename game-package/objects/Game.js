const CANNON = require('cannon');

const OnlinePlayerManager = require(rootDirectory + '/managers/OnlinePlayerManager.js');

const Logger = require('./Logger.js');
const Terrain = require('./Terrain.js');

const terrainstring = 	"d0 d0 d0 d0 d0 d0 d0 d0 d0\n" +
						"d3 d2 d1 d1 d1 d1 d1 d0 d0\n" +
						"da d3 d2 d2 d1 d2 d2 d1 d1";

module.exports = class Game
{
	constructor(id, players)
	{
		this.id = id;
		this.players = players;

		this.world = new CANNON.World();
		this.world.gravity.set(0, 0, -9.82);

		this.terrain = new Terrain(terrainstring);
		this.terrain.addTo(this.world);
	}

	// adds player to the player map
	addPlayer(player)
	{
		Logger.blue("Player \"" + player.username + "\" added to Game " + this.id);
		this.players.set(player.token, player);
	}

	// runs routine stuff when the player is connected, like downloading map
	// probably don't need a player disconnect, for now
	playerConnect(token)
	{
		const OnlinePlayerManager = require(rootDirectory + '/managers/OnlinePlayerManager.js');
		OnlinePlayerManager.sendMessage(token, {
			receiver: "terrain",
			terrain: this.terrain.getTerrain()
		});
	}

	hasPlayer(token)
	{
		return this.players.has(token);
	}

	removePlayer(token)
	{
		if(this.hasPlayer(token))
		{
			var player = this.players.get(token);
			Logger.blue("Player \"" + player.username + "\" removed from Game " + this.id);
		}
		this.players.delete(token);
	}

	getTerrainMap()
	{
		return this.terrain.getTerrain();
	}
}
