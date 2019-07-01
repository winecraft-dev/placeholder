const PasswordHasher = require('password-hash');

const GameDatabaseModel = require(rootDirectory + '/models/GameDatabaseModel.js');

module.exports = class Player
{
	constructor(data)
	{
		this.id = data['id'];

		this.email = data['email'];
		this.username = data['username'];
		this.password = data['password'];
	}

	async getDevelopedGames()
	{
		return await GameDatabaseModel.getGamesByDeveloper(this.id);
		return result;
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