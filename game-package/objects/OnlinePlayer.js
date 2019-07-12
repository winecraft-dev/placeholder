module.exports = class OnlinePlayer
{
	constructor(token, id, username, socket)
	{
		this.token = token;
		this.id = id;
		this.username = username;

		this.socket = socket;
	}

	send(message)
	{
		this.socket.send(JSON.stringify(message));
	}
}