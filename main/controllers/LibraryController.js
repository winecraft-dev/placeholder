const OnlineServerManager = require(rootDirectory + '/managers/OnlineServerManager.js');

const GameDatabaseModel = require(rootDirectory + '/models/GameDatabaseModel.js');

exports.display = async function(req, res)
{
	var gameResult = await GameDatabaseModel.getAllGames();

	if(gameResult.hasData())
	{
		for(var game of gameResult.data)
		{
			var serverResult = await game.getServersByGame();
			game.servers = [];


			if(serverResult.hasData())
			{
				for(var server of serverResult.data)
				{
					if(OnlineServerManager.hasServer(server.id))
					{
						game.servers.push({
							id: server.id,
							name: server.name,
							online: true
						});
					}
					else
					{
						game.servers.push({
							id: server.id,
							name: server.name,
							online: false
						});
					}
				}
			}
		}
	}
	res.render("LibraryView", {
		games: gameResult.data
	});
};