const DatabaseManager = require(rootDirectory + '/managers/DatabaseManager.js');

const Game = require(rootDirectory + '/objects/Game.js');

exports.getGameById = async function(id)
{
	var query = "SELECT * FROM games WHERE id='" + id + "' LIMIT 1";
	return await DatabaseManager.query(query, Game);
};

exports.getGamesByDeveloper = async function(developer)
{
	var query = "SELECT * FROM games WHERE developer='" + developer + "'";
	return await DatabaseManager.query(query, Game);
};