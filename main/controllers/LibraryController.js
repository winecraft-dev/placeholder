const OnlineServerManager = require(rootDirectory + '/managers/OnlineServerManager.js');

exports.display = function(req, res)
{
	res.render("LibraryView");
};

exports.joinGame = function(req, res)
{
	var id = req.session.id;
	var server_id = req.body.server_id;

	var server = OnlineServerManager.getOnlineServer(server_id);

	if(server != null)
	{
		if(OnlineServerManager.hasPlayer(id) == false)
		{
			req.session.server_id = server_id;
			res.send("SUCCESS");
		}
		else
		{
			res.send("LOGGED IN FROM ANOTHER LOCATION");
		}
	}
	else
	{
		res.send("SERVER NOT FOUND");
	}
};