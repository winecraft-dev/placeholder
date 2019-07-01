module.exports = class OnlinePlayer
{
	constructor(id, username, socket)
	{
		this.id = id;
		this.username = username;

		this.socket = socket;
	}

	send(message)
	{
		this.socket.send(JSON.stringify(message));
	}
}