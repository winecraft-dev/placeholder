const OnlineServerManager = require(rootDirectory + '/managers/OnlineServerManager.js');

exports.display = async function(req, res)
{
	var id = req.session.id;
	var server_id = req.session.server_id;

	var server = OnlineServerManager.getOnlineServer(server_id);

	if(server != null)
	{
		if(OnlineServerManager.hasPlayer(id) == false)
		{
			var gameResult = await server.server.getGame();

			var game_info = gameResult.single();

			console.log(game_info);

			res.render("GameView", {
				ip: server.getIP(),
				id: id,
				title: game_info.name,
				description: game_info.description
			});
		}
		else
		{
			res.send("Already Logged in from another location!");
		}
	}
	else
	{
		delete req.session.server_id;
		res.redirect('/library');
	}
};

exports.leaveGame = function(req, res)
{
	
};