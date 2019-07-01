// global variable for the root directory
rootDirectory = __dirname;

var ConfigManager = require('./managers/ConfigManager.js');
var MainManager = require('./managers/MainManager.js');
var OnlinePlayerManager = require('./managers/OnlinePlayerManager.js');
var MatchMakerManager = require('./managers/MatchMakerManager.js');
var GameManager = require('./managers/GameManager.js');

(async function() {
	await ConfigManager.initialize();
	await MainManager.initialize();
	await OnlinePlayerManager.initialize();
	await MatchMakerManager.initialize();
	await GameManager.initialize();
})();