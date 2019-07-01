module.exports = class OnlineServer
{
	constructor(server, socket)
	{
		this.server = server;
		this.socket = socket;

		this.playerCount = 0;
	}

	send(message)
	{
		this.socket.send(JSON.stringify(message));
	}

	setPlayerCount(count)
	{
		this.playerCount = count;
	}

	getName()
	{
		return this.server.name;
	}

	getID()
	{
		return this.server.id;
	}

	getIP()
	{
		return this.server.ip;
	}
}