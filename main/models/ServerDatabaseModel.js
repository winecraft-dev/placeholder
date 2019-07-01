const DatabaseManager = require(rootDirectory + '/managers/DatabaseManager.js');

const Server = require(rootDirectory + '/objects/Server.js');

exports.getServerById = async function(id)
{
	var query = "SELECT * FROM servers WHERE id='" + id + "' LIMIT 1";
	return await DatabaseManager.query(query, Server);
};

exports.getServerByName = async function(name)
{
	var query = "SELECT * FROM servers WHERE name='" + name + "' LIMIT 1";
	return await DatabaseManager.query(query, Server);
};

exports.update = async function(server)
{
	var query = "UPDATE servers SET name='" + server.name + "', "
			+ "password='" + server.password + "', "
			+ "ip='" + server.ip + "', "
			+ "max_players='" + server.max_players + "', "
			+ "time='" + server.time + "', "
			+ "player_count='" + server.player_count + "' WHERE id='" + server.id + "'";

	return await DatabaseManager.query(query);
};

/*
*	Create a query builder class that takes in a string query with placeholders,
*	and follows up with data to put into those place holders. This will server to
*	mitigate the risk of sql injection (hopefully).
*/