const PasswordHasher = require('password-hash');

const GameDatabaseModel = require(rootDirectory + '/models/GameDatabaseModel.js');

module.exports = class Server
{
	constructor(data)
	{
		this.id = data['id'];

		this.game = data['game'];
		
		this.name = data['name'];
		this.password = data['password'];
		this.ip = data['ip'];
		this.max_players = data['max_players'];
	}

	secondsSinceLastPulse()
	{

	}

	async getGame()
	{
		return await GameDatabaseModel.getGameById(this.game);
	}

	async update()
	{
		return await ServerDatabaseModel.updateServer(this);
	}

	checkPassword(password)
	{
		return password == this.password;
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