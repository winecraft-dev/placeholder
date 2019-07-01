const ServerDatabaseModel = require(rootDirectory + '/models/ServerDatabaseModel.js');

exports.session = async function(req, res, next)
{
	req.logged_in = false;

	if(req.session.id)
	{
		req.logged_in = true;
	}
	next();
};

exports.authenticateLoggedOut = async function(req, res, next)
{
	if(req.logged_in == true)
		res.send("LOGGED IN");
	else
		next();
};

exports.authenticateLoggedIn = async function(req, res, next)
{
	if(req.logged_in == false)
		res.send("NOT LOGGED IN");
	else
		next();
};