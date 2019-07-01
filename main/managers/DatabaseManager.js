const mysql = require('mysql');

const ConfigManager = require('./ConfigManager.js');
const DatabaseResult = require(rootDirectory + '/objects/utilities/DatabaseResult.js');

var connection;

module.exports = class DatabaseManager
{
	static async initialize()
	{
		connection = mysql.createConnection({
			host: ConfigManager.get('sql_host'),
			user: ConfigManager.get('sql_user'),
			password: ConfigManager.get('sql_password'),
			database: ConfigManager.get('sql_database')
		});

		await (new Promise(function(resolve) {
			connection.connect(function(err) {
				if (err) throw err;
				console.log("SQL Database connected!");
				resolve();
			});
		}));
	}

	static query(query, type = undefined)
	{
		return (new Promise(function(resolve) {
			connection.query(query, function(err, result) {
				if(err)
				{
					console.log(err);
					// error on execution
					resolve(new DatabaseResult(false));
				}
				else
				{
					var items = JSON.parse(JSON.stringify(result));

					if(!Array.isArray(items)) // then action
					{
						resolve(new DatabaseResult(true));
					}
					else // then actual result
					{
						if(type != undefined) // bundle as type
						{
							var list = [];

							for(let item of items)
							{
								list.push(new type(item));
							}

							resolve(new DatabaseResult(true, list));
						}
						else // typless bundle
						{
							resolve(new DatabaseResult(true, items));
						}
					}
				}
			});
		}));
	}
}