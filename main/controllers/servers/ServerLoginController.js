const ServerDatabaseModel = require(rootDirectory + '/models/ServerDatabaseModel.js');

exports.login = async function(req, res)
{
	var name = req.body.name ? req.body.name : null;
	var password = req.body.password ? req.body.password : null;

	if(name != null && password != null)
	{
		var serverResult = await ServerDatabaseModel.getServerByName(name);

		if(serverResult.hasData())
		{
			var server = serverResult.single();

			if(server.checkPassword(password))
			{
				/*
				*	Potentially check if the server is already online
				*	maybe by checking time of last ping..?
				*/
				req.session.id = server.id;
				res.send("SUCCESS");
			}
			else
			{
				res.send("INCORRECT PASSWORD");
			}
		}
		else
		{
			res.send("NO SERVER WITH NAME FOUND");
		}
	}
	else
	{
		res.send("NAME OR PASSWORD NOT PROVIDED");
	}
};