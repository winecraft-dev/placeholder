const PlayerDatabaseModel = require(rootDirectory + '/models/PlayerDatabaseModel.js');

exports.display = function(req, res)
{
	res.render("LoginView");
};

exports.login = async function(req, res)
{
	var email = req.body.email ? req.body.email : null;
	var password = req.body.password ? req.body.password : null;

	if(name != null && password != null)
	{
		var playerResult = await PlayerDatabaseModel.getPlayerByEmail(email);

		if(playerResult.hasData())
		{
			var player = playerResult.single();

			if(player.checkPassword(password))
			{
				req.session.id = player.id;
				res.send("SUCCESS");
			}
			else
			{
				res.send("INCORRECT PASSWORD");
			}
		}
		else
		{
			res.send("NO PLAYER WITH EMAIL FOUND");
		}
	}
	else
	{
		res.send("EMAIL OR PASSWORD NOT PROVIDED");
	}
};

exports.logout = function(req, res)
{
	delete req.session.id;
	delete req.session.server_id;
	res.redirect('/login');
};

exports.register = function(req, res)
{

};