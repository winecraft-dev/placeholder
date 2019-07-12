// requires for outside libs
const http = require('http');
const Express = require('express');

const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

// constant values
const cookie_secret = 'take a hit of this smoke stack';
const cookie_maxAge = 3 * 60 * 60 * 1000; // 3 hours, as milliseconds

const ConfigManager = require('./ConfigManager.js');

// running variables
var sessionParser;
var app;

var http_server;

module.exports = class ExpressManager
{
	static async initialize()
	{
		sessionParser = cookieSession({
			name: 'session',
			secret: cookie_secret,
			maxAge: cookie_maxAge
		});

		app = Express();
		app.use(Express.static(rootDirectory + '/public'));
		app.use(sessionParser);	
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({
			extended: true
		}));
		app.set('view engine', 'ejs');

		var ErrorController = require(rootDirectory + '/controllers/ErrorController.js');
		app.use(function(error, req, res, next) {
			console.log(error);
			ErrorController.error500(req, res);
		});

		ExpressManager.initializeControllers();

		app.use(function(req, res) {
			ErrorController.error404(req, res);
		});

		http_server = http.createServer(app);
		http_server.listen(ConfigManager.get('http_port'));
	}

	static getSessionParser()
	{
		return sessionParser;
	}

	static initializeControllers()
	{
		// for servers
		var ServerSessionController = require(rootDirectory + '/controllers/servers/ServerSessionController.js');
		var ServerLoginController = require(rootDirectory + '/controllers/servers/ServerLoginController.js');
		var ServerPlayerController = require(rootDirectory + '/controllers/servers/ServerPlayerController.js');

		app.post('/servers/login', [
			ServerSessionController.session,
			ServerSessionController.authenticateLoggedOut,
			ServerLoginController.login
		]);
		app.post('/servers/playerconnect', [
			ServerSessionController.session,
			ServerSessionController.authenticateLoggedIn,
			ServerPlayerController.playerConnect
		]);
		
		// for users
		var SessionController = require(rootDirectory + '/controllers/SessionController.js');
		var PageController = require(rootDirectory + '/controllers/PageController.js');
		var LoginController = require(rootDirectory + '/controllers/LoginController.js');
		var LibraryController = require(rootDirectory + '/controllers/LibraryController.js');
		var GameController = require(rootDirectory + '/controllers/GameController.js');
		//var ModerationController = require(rootDirectory + '/controllers/ModerationController.js');
		//var AdminController = require(rootDirectory + '/controllers/AdminController.js');

		app.get('/', [
			PageController.index
		]);
		app.get('/documentation', [
			PageController.documentation
		]);

		app.get('/login', [
			SessionController.session,
			SessionController.authenticateLoggedOut,
			LoginController.display
		]);
		app.get('/logout', [
			LoginController.logout
		]);
		app.post('/login', [
			SessionController.session,
			SessionController.authenticateLoggedOut,
			LoginController.login
		]);
		app.post('/register', [
			SessionController.session,
			SessionController.authenticateLoggedOut,
			LoginController.register
		]);

		app.get('/library', [
			SessionController.session,
			SessionController.authenticateLoggedIn,
			SessionController.authenticateOutGame,
			LibraryController.display
		]);

		app.get('/game', [
			SessionController.session,
			SessionController.authenticateLoggedIn,
			GameController.display
		]);
		app.get('/leavegame', [
			SessionController.session,
			SessionController.authenticateLoggedIn,
			GameController.leaveGame
		]);
	}	
}