const ServerDatabaseModel = require(rootDirectory + '/models/ServerDatabaseModel.js');

exports.session = async function(req, res, next)
{
	req.logged_in = false;
	req.in_game = false;
	
	if(req.session.id)
	{
		req.logged_in = true;

		if(req.session.server_id)
		{
			req.in_game = true;
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

exports.authenticateOutGame = function(req, res, next)
{
	if(req.in_game == true)
		if(req.method == "POST")
			res.send("IN GAME");
		else
			res.redirect('/game?server=' + req.session.server_id);
	else
		next();
};