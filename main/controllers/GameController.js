const OnlineServerManager = require(rootDirectory + '/managers/OnlineServerManager.js');

const PlayerDatabaseModel = require(rootDirectory + '/models/PlayerDatabaseModel.js');

exports.display = async function(req, res)
{
	var player_id = req.session.id;
	var server_id = req.query.server ? req.query.server : null;

	if(server_id != null)
	{
		var server = OnlineServerManager.getOnlineServer(server_id);

		if(server != null)
		{
			req.session.server_id = server_id;

			var gameResult = await server.server.getGame();
			var playerResult = await PlayerDatabaseModel.getPlayerById(player_id);

			if(gameResult.hasData() && playerResult.hasData())
			{
				var game = gameResult.single();
				var player = playerResult.single();

				res.render("GameView", {
					token: player.token,
					ip: server.getIP(),
					title: game.name,
					description: game.description
				});
			}
			else
			{
				res.render("ErrorView", {
					code: '500',
					message: 'Database Error'
				});
			}
			return;
		}
	}
	delete req.session.server_id;
	res.redirect('/library');
};

exports.leaveGame = function(req, res)
{
	delete req.session.server_id;
	res.redirect('/library');
};
