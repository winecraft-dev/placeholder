module.exports = class OnlineServer
{
	constructor(server, socket)
	{
		this.server = server;
		this.socket = socket;

		this.players = new Set();
	}

	send(message)
	{
		this.socket.send(JSON.stringify(message));
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

	playerConnect(id)
	{
		this.players.add(id);
	}

	hasPlayer(id)
	{
		return this.players.has(id);
	}

	playerDisconnect(id)
	{
		this.players.delete(id);
	}
}