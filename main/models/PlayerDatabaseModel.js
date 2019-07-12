const DatabaseManager = require(rootDirectory + '/managers/DatabaseManager.js');

const Player = require(rootDirectory + '/objects/Player.js');

exports.getPlayerById = async function(id)
{
	var query = "SELECT * FROM players WHERE id='" + id + "' LIMIT 1";
	return await DatabaseManager.query(query, Player);
};

exports.getPlayerByEmail = async function(email)
{
	var query = "SELECT * FROM players WHERE email='" + email + "' LIMIT 1";
	return await DatabaseManager.query(query, Player);
};

exports.getPlayerByUsername = async function(username)
{
	var query = "SELECT * FROM players WHERE username='" + username + "' LIMIT 1";
	return await DatabaseManager.query(query, Player);
};

exports.getPlayerByToken = async function(token)
{
	var query = "SELECT * FROM players WHERE token='" + token + "' LIMIT 1";
	return await DatabaseManager.query(query, Player);
};

exports.update = async function(player)
{
	var query = "UPDATE players SET username='" + player.username + "', "
			+ "password='" + player.password + "', "
			+ "email='" + player.email + "', "
			+ "token='" + player.token + "' WHERE id='" + player.id + "'";

	return await DatabaseManager.query(query);
};