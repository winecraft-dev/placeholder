const ServerDatabaseModel = require(rootDirectory + '/models/ServerDatabaseModel.js');
const PlayerDatabaseModel = require(rootDirectory + '/models/PlayerDatabaseModel.js');

module.exports = class Game
{
	constructor(data)
	{
		this.id = data['id'];

		this.developer = data['developer'];
		this.name = data['name'];
		this.description = data['description'];
	}

	async getDeveloper()
	{
		return await PlayerDatabaseModel.getPlayerById(this.developer);
	}

	async getServersByGame()
	{
		return await ServerDatabaseModel.getServersByGame(this.id);
	}
}