const PasswordHasher = require('password-hash');

const GameDatabaseModel = require(rootDirectory + '/models/GameDatabaseModel.js');
const PlayerDatabaseModel = require(rootDirectory + '/models/PlayerDatabaseModel.js');

const ConfigManager = require(rootDirectory + '/managers/ConfigManager.js');

module.exports = class Player
{
	constructor(data)
	{
		this.id = data['id'];

		this.email = data['email'];
		this.username = data['username'];
		this.password = data['password'];

		this.token = data['token'];
	}

	async getDevelopedGames()
	{
		return await GameDatabaseModel.getGamesByDeveloper(this.id);
		return result;
	}

	async setNewToken()
	{
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for(var i = 0; i < ConfigManager.get('token_length'); i ++)
		{
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		this.token = result;
		await this.update();
		return result;
	}

	async update()
	{
		return await PlayerDatabaseModel.update(this);
	}

	checkPassword(password)
	{
		return this.password == password;
		if(PasswordHasher.verify(password, this.password))
		{
			return true;
		}
		return false;
	}

	static generateHash(password)
	{
		return PasswordHasher.generate(password);
	}
}