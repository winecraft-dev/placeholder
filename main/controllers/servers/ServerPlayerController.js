const OnlineServerManager = require(rootDirectory + '/managers/OnlineServerManager.js');

const PlayerDatabaseModel = require(rootDirectory + '/models/PlayerDatabaseModel.js');

exports.playerConnect = async function(req, res)
{
	var server_id = req.session.id;
	var token = req.body.token ? req.body.token : null;

	if(OnlineServerManager.hasServer(server_id))
	{
		if(token != null)
		{
			var playerResult = await PlayerDatabaseModel.getPlayerByToken(token);

			if(playerResult.hasData())
			{
				var player = playerResult.single();

				OnlineServerManager.playerConnect(server_id, player.id);

				res.send({
					id: player.id,
					username: player.username
				});
			}
			else
			{
				res.send("DATABASE ERROR");
			}
		}
		else
		{	
			res.send("TOKEN NOT PROVIDED");
		}
	}
	else
	{
		res.send("NOT CONNECTED");
	}
};