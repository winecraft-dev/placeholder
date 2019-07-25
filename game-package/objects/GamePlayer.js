module.exports = class GamePlayer
{
	constructor(token, username)
	{
		this.token = token;
		this.username = username;
		
		this.team = 0;
	}

	setTeam(team)
	{
		this.team = team;
	}
}