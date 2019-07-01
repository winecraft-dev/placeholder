const PlayerDatabaseModel = require(rootDirectory + '/models/PlayerDatabaseModel.js');
const ServerDatabaseModel = require(rootDirectory + '/models/ServerDatabaseModel.js');

exports.session = async function(req, res, next)
{
	req.logged_in = false;
	req.player = null;
	req.in_game = false;
	req.server = null;

	if(req.session.id)
	{
		var playerResult = await PlayerDatabaseModel.getPlayerById(req.session.id);

		if(playerResult.hasData())
		{
			req.logged_in = true;
			req.player = playerResult.single();

			if(req.session.server_id)
			{
				var serverResult = await ServerDatabaseModel.getServerById(req.session.id);

				if(serverResult.hasData())
				{
					req.in_game = true;
					req.server = serverResult.single();
				}
			}
		}
	}
	next();
};

exports.authenticateLoggedIn = function(req, res, next)
{
	if(req.logged_in == false)
		if(req.method == "POST")
			res.send("NOT LOGGED IN");
		else
			res.redirect('/login');
	else
		next();
};

exports.authenticateLoggedOut = function(req, res, next)
{
	if(req.logged_in == true)
		if(req.method == "POST")
			res.send("LOGGED IN");
		else
			res.redirect('/library');
	else
		next();
};

exports.authenticateInGame = function(req, res, next)
{
	if(req.in_game == false)
		if(req.method == "POST")
			res.send("NOT IN GAME");
		else
			res.redirect('/library');
	else
		next();
};

exports.authenticateOutGame = function(req, res, next)
{
	if(req.in_game == true)
		if(req.method == "POST")
			res.send("IN GAME");
		else
			res.redirect('/game');
	else
		next();
};