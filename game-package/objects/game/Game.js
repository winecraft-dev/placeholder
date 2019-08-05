const CANNON = require('cannon');

const OnlinePlayerManager = require(rootDirectory + '/managers/OnlinePlayerManager.js');

const Logger = require(rootDirectory +'/objects/Logger.js');
const Terrain = require('./Terrain.js');

var terrainstring = 
	"g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3\n" +
	"g3 g3.9 g3.7 g3.4 g3.1 g2.7 g2.2 g1.7 g1.3 g0.8 g0.5 g0.2 g0.1 g0.1 g0.1 g0.3 g0.6 g1 g1.4 g1.9 g2.4 g2.8 g3.2 g3.6 g3.8 g3.9 g3.9 g3.8 g3.6 g3.3 g2.9 g2.5 g2 g1.5 g1.1 g0.7 g0.4 g0.2 g0.1 g0.1 g0.2 g0.4 g0.8 g1.2 g1.6 g2.1 g2.6 g3 g3.4 g3.7 g3.9 g3.9 g3.9 g3.8 g3.5 g3.2 g2.7 g2.3 g1.8 g1.3 g0.9 g0.6 g0.3 g3\n" +
	"g3 g3.7 g3.6 g3.3 g3 g2.6 g2.2 g1.7 g1.3 g0.9 g0.6 g0.4 g0.3 g0.2 g0.3 g0.5 g0.8 g1.1 g1.5 g1.9 g2.3 g2.8 g3.1 g3.4 g3.6 g3.7 g3.8 g3.7 g3.5 g3.2 g2.8 g2.4 g2 g1.6 g1.2 g0.8 g0.5 g0.3 g0.2 g0.3 g0.4 g0.6 g0.9 g1.2 g1.7 g2.1 g2.5 g2.9 g3.2 g3.5 g3.7 g3.8 g3.7 g3.6 g3.4 g3.1 g2.7 g2.3 g1.8 g1.4 g1 g0.7 g0.4 g3\n" +
	"g3 g3.4 g3.3 g3.1 g2.8 g2.5 g2.1 g1.8 g1.4 g1.1 g0.9 g0.7 g0.5 g0.5 g0.6 g0.7 g1 g1.2 g1.6 g1.9 g2.3 g2.6 g2.9 g3.2 g3.4 g3.5 g3.5 g3.4 g3.2 g3 g2.7 g2.4 g2 g1.6 g1.3 g1 g0.8 g0.6 g0.5 g0.5 g0.6 g0.8 g1.1 g1.4 g1.7 g2.1 g2.4 g2.8 g3 g3.3 g3.4 g3.5 g3.5 g3.3 g3.1 g2.9 g2.6 g2.2 g1.9 g1.5 g1.2 g0.9 g0.7 g3\n" +
	"g3 g3.1 g3 g2.8 g2.6 g2.4 g2.1 g1.8 g1.6 g1.3 g1.1 g1 g0.9 g0.9 g0.9 g1 g1.2 g1.4 g1.7 g1.9 g2.2 g2.5 g2.7 g2.9 g3 g3.1 g3.1 g3 g2.9 g2.7 g2.5 g2.3 g2 g1.7 g1.5 g1.3 g1.1 g1 g0.9 g0.9 g1 g1.1 g1.3 g1.5 g1.8 g2.1 g2.3 g2.6 g2.8 g3 g3.1 g3.1 g3.1 g3 g2.9 g2.7 g2.4 g2.2 g1.9 g1.6 g1.4 g1.2 g1 g3\n" +
	"g3 g2.7 g2.6 g2.5 g2.4 g2.2 g2.1 g1.9 g1.7 g1.6 g1.5 g1.4 g1.3 g1.3 g1.4 g1.4 g1.5 g1.7 g1.8 g2 g2.1 g2.3 g2.4 g2.5 g2.6 g2.7 g2.7 g2.6 g2.6 g2.5 g2.3 g2.2 g2 g1.8 g1.7 g1.5 g1.4 g1.4 g1.3 g1.3 g1.4 g1.5 g1.6 g1.7 g1.9 g2 g2.2 g2.3 g2.5 g2.6 g2.6 g2.7 g2.7 g2.6 g2.5 g2.4 g2.3 g2.1 g1.9 g1.8 g1.6 g1.5 g1.4 g3\n" +
	"g3 g2.2 g2.2 g2.1 g2.1 g2.1 g2 g2 g1.9 g1.9 g1.8 g1.8 g1.8 g1.8 g1.8 g1.8 g1.9 g1.9 g1.9 g2 g2 g2.1 g2.1 g2.2 g2.2 g2.2 g2.2 g2.2 g2.2 g2.1 g2.1 g2 g2 g2 g1.9 g1.9 g1.8 g1.8 g1.8 g1.8 g1.8 g1.8 g1.9 g1.9 g2 g2 g2.1 g2.1 g2.1 g2.2 g2.2 g2.2 g2.2 g2.2 g2.2 g2.1 g2.1 g2 g2 g1.9 g1.9 g1.9 g1.8 g3\n" +
	"g3 g1.7 g1.7 g1.8 g1.8 g1.9 g2 g2 g2.1 g2.2 g2.2 g2.3 g2.3 g2.3 g2.3 g2.3 g2.2 g2.2 g2.1 g2 g1.9 g1.9 g1.8 g1.8 g1.7 g1.7 g1.7 g1.7 g1.8 g1.8 g1.9 g1.9 g2 g2.1 g2.1 g2.2 g2.2 g2.3 g2.3 g2.3 g2.3 g2.2 g2.2 g2.1 g2.1 g2 g1.9 g1.8 g1.8 g1.7 g1.7 g1.7 g1.7 g1.7 g1.8 g1.8 g1.9 g2 g2 g2.1 g2.2 g2.2 g2.3 g3\n" +
	"g3 g1.3 g1.3 g1.4 g1.6 g1.7 g1.9 g2.1 g2.3 g2.5 g2.6 g2.7 g2.8 g2.8 g2.7 g2.7 g2.5 g2.4 g2.2 g2 g1.9 g1.7 g1.5 g1.4 g1.3 g1.2 g1.2 g1.3 g1.4 g1.5 g1.6 g1.8 g2 g2.2 g2.4 g2.5 g2.6 g2.7 g2.8 g2.8 g2.7 g2.6 g2.5 g2.3 g2.1 g2 g1.8 g1.6 g1.5 g1.3 g1.3 g1.2 g1.2 g1.3 g1.4 g1.5 g1.7 g1.9 g2.1 g2.3 g2.4 g2.6 g2.7 g3\n" +
	"g3 g0.8 g0.9 g1.1 g1.3 g1.6 g1.9 g2.2 g2.5 g2.7 g2.9 g3.1 g3.2 g3.2 g3.1 g3 g2.8 g2.6 g2.3 g2.1 g1.8 g1.5 g1.2 g1 g0.9 g0.8 g0.8 g0.9 g1 g1.2 g1.4 g1.7 g2 g2.3 g2.6 g2.8 g3 g3.1 g3.2 g3.2 g3.1 g3 g2.8 g2.5 g2.2 g1.9 g1.7 g1.4 g1.2 g1 g0.9 g0.8 g0.8 g0.9 g1.1 g1.3 g1.5 g1.8 g2.1 g2.4 g2.7 g2.9 g3.1 g3\n" +
	"g3 g0.5 g0.6 g0.9 g1.1 g1.5 g1.8 g2.2 g2.6 g2.9 g3.2 g3.4 g3.5 g3.5 g3.5 g3.3 g3.1 g2.8 g2.4 g2.1 g1.7 g1.3 g1 g0.8 g0.6 g0.5 g0.5 g0.5 g0.7 g1 g1.3 g1.6 g2 g2.4 g2.7 g3 g3.3 g3.5 g3.5 g3.5 g3.4 g3.2 g3 g2.7 g2.3 g1.9 g1.6 g1.2 g0.9 g0.7 g0.5 g0.5 g0.5 g0.6 g0.8 g1.1 g1.4 g1.8 g2.2 g2.5 g2.9 g3.1 g3.4 g3\n" +
	"g3 g0.2 g0.4 g0.7 g1 g1.4 g1.8 g2.3 g2.7 g3.1 g3.4 g3.6 g3.8 g3.8 g3.7 g3.6 g3.3 g2.9 g2.5 g2.1 g1.6 g1.2 g0.9 g0.5 g0.3 g0.2 g0.2 g0.3 g0.5 g0.8 g1.1 g1.6 g2 g2.4 g2.9 g3.2 g3.5 g3.7 g3.8 g3.8 g3.7 g3.5 g3.1 g2.8 g2.4 g1.9 g1.5 g1.1 g0.7 g0.4 g0.3 g0.2 g0.2 g0.4 g0.6 g0.9 g1.3 g1.7 g2.2 g2.6 g3 g3.3 g3.6 g3\n" +
	"g3 g0.1 g0.3 g0.5 g0.9 g1.3 g1.8 g2.3 g2.8 g3.2 g3.5 g3.8 g3.9 g4 g3.9 g3.7 g3.4 g3 g2.6 g2.1 g1.6 g1.2 g0.8 g0.4 g0.2 g0.1 g0 g0.2 g0.4 g0.7 g1.1 g1.5 g2 g2.5 g2.9 g3.3 g3.6 g3.8 g4 g3.9 g3.8 g3.6 g3.2 g2.8 g2.4 g1.9 g1.4 g1 g0.6 g0.3 g0.1 g0 g0.1 g0.2 g0.5 g0.8 g1.2 g1.7 g2.2 g2.7 g3.1 g3.5 g3.7 g3\n" +
	"g3 g0.1 g0.2 g0.5 g0.9 g1.3 g1.8 g2.3 g2.8 g3.2 g3.5 g3.8 g4 g4 g3.9 g3.7 g3.4 g3 g2.6 g2.1 g1.6 g1.1 g0.7 g0.4 g0.2 g0 g0 g0.1 g0.3 g0.7 g1.1 g1.5 g2 g2.5 g2.9 g3.3 g3.7 g3.9 g4 g4 g3.8 g3.6 g3.3 g2.9 g2.4 g1.9 g1.4 g1 g0.6 g0.3 g0.1 g0 g0 g0.2 g0.5 g0.8 g1.2 g1.7 g2.2 g2.7 g3.1 g3.5 g3.8 g3\n" +
	"g3 g0.1 g0.3 g0.6 g0.9 g1.4 g1.8 g2.3 g2.7 g3.1 g3.5 g3.7 g3.9 g3.9 g3.8 g3.6 g3.4 g3 g2.6 g2.1 g1.6 g1.2 g0.8 g0.5 g0.2 g0.1 g0.1 g0.2 g0.4 g0.7 g1.1 g1.5 g2 g2.5 g2.9 g3.3 g3.6 g3.8 g3.9 g3.9 g3.8 g3.5 g3.2 g2.8 g2.4 g1.9 g1.4 g1 g0.6 g0.4 g0.2 g0.1 g0.1 g0.3 g0.5 g0.9 g1.3 g1.7 g2.2 g2.6 g3.1 g3.4 g3.7 g3\n" +
	"g3 g0.3 g0.5 g0.7 g1 g1.4 g1.8 g2.3 g2.7 g3 g3.3 g3.6 g3.7 g3.7 g3.6 g3.5 g3.2 g2.9 g2.5 g2.1 g1.7 g1.3 g0.9 g0.6 g0.4 g0.3 g0.3 g0.4 g0.6 g0.8 g1.2 g1.6 g2 g2.4 g2.8 g3.2 g3.4 g3.6 g3.7 g3.7 g3.6 g3.4 g3.1 g2.7 g2.3 g1.9 g1.5 g1.1 g0.8 g0.5 g0.4 g0.3 g0.3 g0.4 g0.7 g1 g1.3 g1.7 g2.2 g2.6 g3 g3.3 g3.5 g3\n" +
	"g3 g0.6 g0.8 g1 g1.2 g1.5 g1.9 g2.2 g2.5 g2.8 g3.1 g3.3 g3.4 g3.4 g3.4 g3.2 g3 g2.7 g2.4 g2.1 g1.7 g1.4 g1.1 g0.9 g0.7 g0.6 g0.6 g0.7 g0.8 g1.1 g1.3 g1.7 g2 g2.3 g2.7 g2.9 g3.2 g3.3 g3.4 g3.4 g3.3 g3.1 g2.9 g2.6 g2.3 g1.9 g1.6 g1.3 g1 g0.8 g0.6 g0.6 g0.6 g0.7 g0.9 g1.2 g1.5 g1.8 g2.1 g2.5 g2.8 g3 g3.2 g3\n" +
	"g3 g1 g1.1 g1.2 g1.4 g1.7 g1.9 g2.2 g2.4 g2.6 g2.8 g2.9 g3 g3 g3 g2.9 g2.7 g2.5 g2.3 g2.1 g1.8 g1.6 g1.3 g1.2 g1.1 g1 g1 g1 g1.1 g1.3 g1.5 g1.8 g2 g2.2 g2.5 g2.7 g2.9 g3 g3 g3 g2.9 g2.8 g2.7 g2.4 g2.2 g1.9 g1.7 g1.5 g1.3 g1.1 g1 g1 g1 g1.1 g1.2 g1.4 g1.6 g1.8 g2.1 g2.3 g2.6 g2.8 g2.9 g3\n" +
	"g3 g1.4 g1.5 g1.6 g1.7 g1.8 g1.9 g2.1 g2.2 g2.3 g2.4 g2.5 g2.6 g2.6 g2.6 g2.5 g2.4 g2.3 g2.2 g2 g1.9 g1.8 g1.6 g1.5 g1.5 g1.4 g1.4 g1.5 g1.5 g1.6 g1.7 g1.9 g2 g2.1 g2.3 g2.4 g2.5 g2.5 g2.6 g2.6 g2.5 g2.5 g2.4 g2.2 g2.1 g2 g1.8 g1.7 g1.6 g1.5 g1.4 g1.4 g1.4 g1.5 g1.6 g1.7 g1.8 g1.9 g2.1 g2.2 g2.3 g2.4 g2.5 g3\n" +
	"g3 g1.9 g1.9 g1.9 g1.9 g2 g2 g2 g2 g2.1 g2.1 g2.1 g2.1 g2.1 g2.1 g2.1 g2.1 g2.1 g2 g2 g2 g2 g1.9 g1.9 g1.9 g1.9 g1.9 g1.9 g1.9 g1.9 g2 g2 g2 g2 g2 g2.1 g2.1 g2.1 g2.1 g2.1 g2.1 g2.1 g2.1 g2 g2 g2 g2 g1.9 g1.9 g1.9 g1.9 g1.9 g1.9 g1.9 g1.9 g1.9 g2 g2 g2 g2 g2.1 g2.1 g2.1 g3\n" +
	"g3 g2.4 g2.3 g2.3 g2.2 g2.1 g2 g1.9 g1.9 g1.8 g1.7 g1.6 g1.6 g1.6 g1.6 g1.7 g1.7 g1.8 g1.9 g2 g2.1 g2.2 g2.2 g2.3 g2.4 g2.4 g2.4 g2.4 g2.3 g2.3 g2.2 g2.1 g2 g1.9 g1.8 g1.7 g1.7 g1.6 g1.6 g1.6 g1.6 g1.7 g1.8 g1.8 g1.9 g2 g2.1 g2.2 g2.3 g2.3 g2.4 g2.4 g2.4 g2.4 g2.3 g2.2 g2.1 g2.1 g2 g1.9 g1.8 g1.7 g1.7 g3\n" +
	"g3 g2.8 g2.8 g2.6 g2.5 g2.3 g2.1 g1.9 g1.7 g1.5 g1.3 g1.2 g1.2 g1.1 g1.2 g1.3 g1.4 g1.6 g1.8 g2 g2.2 g2.4 g2.5 g2.7 g2.8 g2.8 g2.9 g2.8 g2.7 g2.6 g2.4 g2.2 g2 g1.8 g1.6 g1.4 g1.3 g1.2 g1.1 g1.2 g1.2 g1.3 g1.5 g1.6 g1.8 g2 g2.2 g2.4 g2.6 g2.7 g2.8 g2.9 g2.8 g2.8 g2.7 g2.5 g2.3 g2.1 g1.9 g1.7 g1.5 g1.4 g1.2 g3\n" +
	"g3 g3.2 g3.1 g2.9 g2.7 g2.4 g2.1 g1.8 g1.5 g1.2 g1 g0.9 g0.8 g0.7 g0.8 g0.9 g1.1 g1.3 g1.6 g1.9 g2.2 g2.5 g2.8 g3 g3.2 g3.3 g3.3 g3.2 g3.1 g2.9 g2.6 g2.3 g2 g1.7 g1.4 g1.1 g0.9 g0.8 g0.7 g0.7 g0.8 g1 g1.2 g1.5 g1.8 g2.1 g2.4 g2.7 g2.9 g3.1 g3.2 g3.3 g3.2 g3.1 g3 g2.8 g2.5 g2.2 g1.9 g1.6 g1.3 g1.1 g0.9 g3\n" +
	"g3 g3.6 g3.4 g3.2 g2.9 g2.5 g2.2 g1.8 g1.4 g1 g0.8 g0.5 g0.4 g0.4 g0.5 g0.6 g0.9 g1.2 g1.5 g1.9 g2.3 g2.7 g3 g3.3 g3.5 g3.6 g3.6 g3.5 g3.3 g3.1 g2.8 g2.4 g2 g1.6 g1.2 g0.9 g0.7 g0.5 g0.4 g0.4 g0.5 g0.7 g1 g1.3 g1.7 g2.1 g2.5 g2.8 g3.1 g3.4 g3.5 g3.6 g3.6 g3.5 g3.2 g3 g2.6 g2.2 g1.8 g1.5 g1.1 g0.8 g0.6 g3\n" +
	"g3 g3.8 g3.6 g3.4 g3 g2.6 g2.2 g1.7 g1.3 g0.9 g0.6 g0.3 g0.2 g0.2 g0.2 g0.4 g0.7 g1.1 g1.5 g1.9 g2.4 g2.8 g3.2 g3.5 g3.7 g3.8 g3.8 g3.7 g3.5 g3.2 g2.9 g2.4 g2 g1.6 g1.1 g0.8 g0.5 g0.3 g0.2 g0.2 g0.3 g0.5 g0.8 g1.2 g1.6 g2.1 g2.5 g2.9 g3.3 g3.6 g3.8 g3.8 g3.8 g3.7 g3.4 g3.1 g2.7 g2.3 g1.8 g1.4 g1 g0.6 g0.4 g3\n" +
	"g3 g3.9 g3.7 g3.5 g3.1 g2.7 g2.2 g1.7 g1.2 g0.8 g0.5 g0.2 g0.1 g0 g0.1 g0.3 g0.6 g1 g1.4 g1.9 g2.4 g2.8 g3.3 g3.6 g3.8 g4 g4 g3.9 g3.6 g3.3 g2.9 g2.5 g2 g1.5 g1.1 g0.7 g0.4 g0.1 g0 g0 g0.2 g0.4 g0.7 g1.2 g1.6 g2.1 g2.6 g3 g3.4 g3.7 g3.9 g4 g3.9 g3.8 g3.5 g3.2 g2.8 g2.3 g1.8 g1.3 g0.9 g0.5 g0.3 g3\n" +
	"g3 g3.9 g3.8 g3.5 g3.1 g2.7 g2.2 g1.7 g1.2 g0.8 g0.5 g0.2 g0 g0 g0.1 g0.3 g0.6 g1 g1.4 g1.9 g2.4 g2.9 g3.3 g3.6 g3.8 g4 g4 g3.9 g3.7 g3.3 g2.9 g2.5 g2 g1.5 g1.1 g0.7 g0.3 g0.1 g0 g0 g0.2 g0.4 g0.7 g1.1 g1.6 g2.1 g2.6 g3 g3.4 g3.7 g3.9 g4 g4 g3.8 g3.5 g3.2 g2.8 g2.3 g1.8 g1.3 g0.9 g0.5 g0.2 g3\n" +
	"g3 g3.8 g3.7 g3.4 g3 g2.6 g2.2 g1.7 g1.3 g0.9 g0.5 g0.3 g0.2 g0.1 g0.2 g0.4 g0.7 g1 g1.5 g1.9 g2.4 g2.8 g3.2 g3.5 g3.7 g3.9 g3.9 g3.8 g3.6 g3.3 g2.9 g2.5 g2 g1.5 g1.1 g0.7 g0.4 g0.2 g0.1 g0.1 g0.3 g0.5 g0.8 g1.2 g1.6 g2.1 g2.5 g3 g3.3 g3.6 g3.8 g3.9 g3.8 g3.7 g3.5 g3.1 g2.7 g2.3 g1.8 g1.4 g1 g0.6 g0.3 g3\n" +
	"g3 g3.6 g3.5 g3.2 g2.9 g2.6 g2.2 g1.8 g1.4 g1 g0.7 g0.5 g0.4 g0.3 g0.4 g0.6 g0.8 g1.1 g1.5 g1.9 g2.3 g2.7 g3.1 g3.3 g3.5 g3.6 g3.7 g3.6 g3.4 g3.1 g2.8 g2.4 g2 g1.6 g1.2 g0.9 g0.6 g0.4 g0.3 g0.4 g0.5 g0.7 g0.9 g1.3 g1.7 g2.1 g2.5 g2.9 g3.2 g3.4 g3.6 g3.7 g3.6 g3.5 g3.3 g3 g2.6 g2.2 g1.8 g1.4 g1.1 g0.8 g0.5 g3\n" +
	"g3 g3.3 g3.2 g3 g2.7 g2.5 g2.1 g1.8 g1.5 g1.2 g1 g0.8 g0.7 g0.7 g0.7 g0.8 g1.1 g1.3 g1.6 g1.9 g2.3 g2.6 g2.9 g3.1 g3.2 g3.3 g3.3 g3.3 g3.1 g2.9 g2.6 g2.3 g2 g1.7 g1.4 g1.1 g0.9 g0.7 g0.7 g0.7 g0.8 g0.9 g1.1 g1.4 g1.7 g2.1 g2.4 g2.7 g2.9 g3.2 g3.3 g3.3 g3.3 g3.2 g3 g2.8 g2.5 g2.2 g1.9 g1.5 g1.3 g1 g0.8 g3\n" +
	"g3 g2.9 g2.8 g2.7 g2.5 g2.3 g2.1 g1.9 g1.6 g1.4 g1.3 g1.1 g1.1 g1.1 g1.1 g1.2 g1.3 g1.5 g1.7 g2 g2.2 g2.4 g2.6 g2.8 g2.9 g2.9 g2.9 g2.9 g2.8 g2.6 g2.4 g2.2 g2 g1.8 g1.6 g1.4 g1.2 g1.1 g1.1 g1.1 g1.1 g1.2 g1.4 g1.6 g1.8 g2 g2.3 g2.5 g2.7 g2.8 g2.9 g2.9 g2.9 g2.9 g2.7 g2.6 g2.4 g2.1 g1.9 g1.7 g1.5 g1.3 g1.2 g3\n" +
	"g3 g2.5 g2.4 g2.4 g2.3 g2.2 g2 g1.9 g1.8 g1.7 g1.6 g1.6 g1.5 g1.5 g1.5 g1.6 g1.7 g1.8 g1.9 g2 g2.1 g2.2 g2.3 g2.4 g2.4 g2.5 g2.5 g2.5 g2.4 g2.3 g2.2 g2.1 g2 g1.9 g1.8 g1.7 g1.6 g1.5 g1.5 g1.5 g1.6 g1.6 g1.7 g1.8 g1.9 g2 g2.1 g2.2 g2.3 g2.4 g2.5 g2.5 g2.5 g2.4 g2.4 g2.3 g2.2 g2.1 g2 g1.8 g1.7 g1.6 g1.6 g3\n" +
	"g3 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g2 g3\n" +
	"g3 g1.5 g1.6 g1.6 g1.7 g1.8 g2 g2.1 g2.2 g2.3 g2.4 g2.4 g2.5 g2.5 g2.5 g2.4 g2.3 g2.2 g2.1 g2 g1.9 g1.8 g1.7 g1.6 g1.6 g1.5 g1.5 g1.5 g1.6 g1.7 g1.8 g1.9 g2 g2.1 g2.2 g2.3 g2.4 g2.5 g2.5 g2.5 g2.4 g2.4 g2.3 g2.2 g2.1 g2 g1.9 g1.8 g1.7 g1.6 g1.5 g1.5 g1.5 g1.6 g1.6 g1.7 g1.8 g1.9 g2 g2.2 g2.3 g2.4 g2.4 g3\n" +
	"g3 g1.1 g1.2 g1.3 g1.5 g1.7 g1.9 g2.1 g2.4 g2.6 g2.7 g2.9 g2.9 g2.9 g2.9 g2.8 g2.7 g2.5 g2.3 g2 g1.8 g1.6 g1.4 g1.2 g1.1 g1.1 g1.1 g1.1 g1.2 g1.4 g1.6 g1.8 g2 g2.2 g2.4 g2.6 g2.8 g2.9 g2.9 g2.9 g2.9 g2.8 g2.6 g2.4 g2.2 g2 g1.7 g1.5 g1.3 g1.2 g1.1 g1.1 g1.1 g1.1 g1.3 g1.4 g1.6 g1.9 g2.1 g2.3 g2.5 g2.7 g2.8 g3\n" +
	"g3 g0.7 g0.8 g1 g1.3 g1.5 g1.9 g2.2 g2.5 g2.8 g3 g3.2 g3.3 g3.3 g3.3 g3.2 g2.9 g2.7 g2.4 g2.1 g1.7 g1.4 g1.1 g0.9 g0.8 g0.7 g0.7 g0.7 g0.9 g1.1 g1.4 g1.7 g2 g2.3 g2.6 g2.9 g3.1 g3.3 g3.3 g3.3 g3.2 g3.1 g2.9 g2.6 g2.3 g1.9 g1.6 g1.3 g1.1 g0.8 g0.7 g0.7 g0.7 g0.8 g1 g1.2 g1.5 g1.8 g2.1 g2.5 g2.7 g3 g3.2 g3\n" +
	"g3 g0.4 g0.5 g0.8 g1.1 g1.4 g1.8 g2.2 g2.6 g3 g3.3 g3.5 g3.6 g3.7 g3.6 g3.4 g3.2 g2.9 g2.5 g2.1 g1.7 g1.3 g0.9 g0.7 g0.5 g0.4 g0.3 g0.4 g0.6 g0.9 g1.2 g1.6 g2 g2.4 g2.8 g3.1 g3.4 g3.6 g3.7 g3.6 g3.5 g3.3 g3.1 g2.7 g2.3 g1.9 g1.5 g1.1 g0.8 g0.6 g0.4 g0.3 g0.4 g0.5 g0.7 g1 g1.4 g1.8 g2.2 g2.6 g2.9 g3.2 g3.5 g3\n" +
	"g3 g0.2 g0.3 g0.6 g1 g1.4 g1.8 g2.3 g2.7 g3.1 g3.5 g3.7 g3.8 g3.9 g3.8 g3.6 g3.3 g3 g2.5 g2.1 g1.6 g1.2 g0.8 g0.5 g0.3 g0.1 g0.1 g0.2 g0.4 g0.7 g1.1 g1.5 g2 g2.5 g2.9 g3.3 g3.6 g3.8 g3.9 g3.9 g3.7 g3.5 g3.2 g2.8 g2.4 g1.9 g1.5 g1 g0.7 g0.4 g0.2 g0.1 g0.2 g0.3 g0.5 g0.9 g1.3 g1.7 g2.2 g2.6 g3 g3.4 g3.7 g3\n" +
	"g3 g0.1 g0.2 g0.5 g0.9 g1.3 g1.8 g2.3 g2.8 g3.2 g3.5 g3.8 g4 g4 g3.9 g3.7 g3.4 g3 g2.6 g2.1 g1.6 g1.1 g0.7 g0.4 g0.2 g0 g0 g0.1 g0.3 g0.7 g1.1 g1.5 g2 g2.5 g2.9 g3.3 g3.7 g3.9 g4 g4 g3.8 g3.6 g3.3 g2.9 g2.4 g1.9 g1.4 g1 g0.6 g0.3 g0.1 g0 g0 g0.2 g0.5 g0.8 g1.2 g1.7 g2.2 g2.7 g3.1 g3.5 g3.8 g3\n" +
	"g3 g0.1 g0.3 g0.5 g0.9 g1.3 g1.8 g2.3 g2.8 g3.2 g3.5 g3.8 g3.9 g4 g3.9 g3.7 g3.4 g3 g2.6 g2.1 g1.6 g1.2 g0.7 g0.4 g0.2 g0 g0 g0.1 g0.4 g0.7 g1.1 g1.5 g2 g2.5 g2.9 g3.3 g3.6 g3.9 g4 g4 g3.8 g3.6 g3.3 g2.8 g2.4 g1.9 g1.4 g1 g0.6 g0.3 g0.1 g0 g0.1 g0.2 g0.5 g0.8 g1.2 g1.7 g2.2 g2.7 g3.1 g3.5 g3.7 g3\n" +
	"g3 g0.2 g0.4 g0.6 g1 g1.4 g1.8 g2.3 g2.7 g3.1 g3.4 g3.7 g3.8 g3.8 g3.8 g3.6 g3.3 g2.9 g2.5 g2.1 g1.6 g1.2 g0.8 g0.5 g0.3 g0.2 g0.2 g0.3 g0.5 g0.8 g1.1 g1.6 g2 g2.4 g2.9 g3.2 g3.5 g3.7 g3.8 g3.8 g3.7 g3.5 g3.2 g2.8 g2.4 g1.9 g1.5 g1.1 g0.7 g0.4 g0.2 g0.2 g0.2 g0.3 g0.6 g0.9 g1.3 g1.7 g2.2 g2.6 g3 g3.4 g3.6 g3\n" +
	"g3 g0.4 g0.6 g0.8 g1.1 g1.5 g1.8 g2.2 g2.6 g3 g3.2 g3.5 g3.6 g3.6 g3.5 g3.4 g3.1 g2.8 g2.5 g2.1 g1.7 g1.3 g1 g0.7 g0.5 g0.4 g0.4 g0.5 g0.7 g0.9 g1.2 g1.6 g2 g2.4 g2.8 g3.1 g3.3 g3.5 g3.6 g3.6 g3.5 g3.3 g3 g2.7 g2.3 g1.9 g1.5 g1.2 g0.9 g0.6 g0.5 g0.4 g0.4 g0.5 g0.8 g1 g1.4 g1.8 g2.2 g2.5 g2.9 g3.2 g3.4 g3\n" +
	"g3 g0.8 g0.9 g1.1 g1.3 g1.6 g1.9 g2.2 g2.5 g2.8 g3 g3.1 g3.2 g3.3 g3.2 g3.1 g2.9 g2.7 g2.4 g2.1 g1.8 g1.5 g1.2 g1 g0.8 g0.7 g0.7 g0.8 g0.9 g1.1 g1.4 g1.7 g2 g2.3 g2.6 g2.9 g3.1 g3.2 g3.3 g3.3 g3.2 g3 g2.8 g2.5 g2.2 g1.9 g1.6 g1.3 g1.1 g0.9 g0.8 g0.7 g0.8 g0.9 g1 g1.2 g1.5 g1.8 g2.1 g2.4 g2.7 g2.9 g3.1 g3\n" +
	"g3 g1.2 g1.2 g1.4 g1.5 g1.7 g1.9 g2.1 g2.3 g2.5 g2.7 g2.8 g2.8 g2.9 g2.8 g2.7 g2.6 g2.4 g2.2 g2 g1.8 g1.6 g1.5 g1.3 g1.2 g1.2 g1.1 g1.2 g1.3 g1.4 g1.6 g1.8 g2 g2.2 g2.4 g2.6 g2.7 g2.8 g2.9 g2.8 g2.8 g2.7 g2.5 g2.4 g2.2 g2 g1.8 g1.6 g1.4 g1.3 g1.2 g1.1 g1.2 g1.2 g1.3 g1.5 g1.7 g1.9 g2.1 g2.3 g2.5 g2.6 g2.8 g3\n" +
	"g3 g1.6 g1.7 g1.7 g1.8 g1.9 g2 g2.1 g2.1 g2.2 g2.3 g2.4 g2.4 g2.4 g2.4 g2.3 g2.3 g2.2 g2.1 g2 g1.9 g1.8 g1.8 g1.7 g1.6 g1.6 g1.6 g1.6 g1.7 g1.7 g1.8 g1.9 g2 g2.1 g2.2 g2.3 g2.3 g2.4 g2.4 g2.4 g2.4 g2.3 g2.2 g2.2 g2.1 g2 g1.9 g1.8 g1.7 g1.7 g1.6 g1.6 g1.6 g1.6 g1.7 g1.8 g1.9 g1.9 g2 g2.1 g2.2 g2.3 g2.3 g3\n" +
	"g3 g2.1 g2.1 g2.1 g2.1 g2 g2 g2 g2 g1.9 g1.9 g1.9 g1.9 g1.9 g1.9 g1.9 g1.9 g1.9 g2 g2 g2 g2 g2.1 g2.1 g2.1 g2.1 g2.1 g2.1 g2.1 g2.1 g2 g2 g2 g2 g2 g1.9 g1.9 g1.9 g1.9 g1.9 g1.9 g1.9 g1.9 g2 g2 g2 g2 g2.1 g2.1 g2.1 g2.1 g2.1 g2.1 g2.1 g2.1 g2.1 g2 g2 g2 g2 g1.9 g1.9 g1.9 g3\n" +
	"g3 g2.6 g2.5 g2.4 g2.3 g2.2 g2.1 g1.9 g1.8 g1.7 g1.6 g1.5 g1.4 g1.4 g1.4 g1.5 g1.6 g1.7 g1.8 g2 g2.1 g2.2 g2.4 g2.5 g2.5 g2.6 g2.6 g2.5 g2.5 g2.4 g2.3 g2.1 g2 g1.9 g1.7 g1.6 g1.5 g1.5 g1.4 g1.4 g1.5 g1.5 g1.6 g1.8 g1.9 g2 g2.2 g2.3 g2.4 g2.5 g2.6 g2.6 g2.6 g2.5 g2.4 g2.3 g2.2 g2.1 g1.9 g1.8 g1.7 g1.6 g1.5 g3\n" +
	"g3 g3 g2.9 g2.8 g2.6 g2.3 g2.1 g1.8 g1.6 g1.4 g1.2 g1.1 g1 g1 g1 g1.1 g1.3 g1.5 g1.7 g1.9 g2.2 g2.4 g2.7 g2.8 g2.9 g3 g3 g3 g2.9 g2.7 g2.5 g2.2 g2 g1.8 g1.5 g1.3 g1.1 g1 g1 g1 g1.1 g1.2 g1.3 g1.6 g1.8 g2.1 g2.3 g2.5 g2.7 g2.9 g3 g3 g3 g2.9 g2.8 g2.6 g2.4 g2.2 g1.9 g1.7 g1.4 g1.2 g1.1 g3\n" +
	"g3 g3.4 g3.2 g3 g2.8 g2.5 g2.1 g1.8 g1.5 g1.2 g0.9 g0.7 g0.6 g0.6 g0.6 g0.8 g1 g1.3 g1.6 g1.9 g2.3 g2.6 g2.9 g3.1 g3.3 g3.4 g3.4 g3.3 g3.2 g2.9 g2.7 g2.3 g2 g1.7 g1.3 g1.1 g0.8 g0.7 g0.6 g0.6 g0.7 g0.9 g1.1 g1.4 g1.7 g2.1 g2.4 g2.7 g3 g3.2 g3.4 g3.4 g3.4 g3.3 g3.1 g2.8 g2.5 g2.2 g1.9 g1.5 g1.2 g1 g0.8 g3\n" +
	"g3 g3.7 g3.5 g3.3 g3 g2.6 g2.2 g1.7 g1.3 g1 g0.7 g0.4 g0.3 g0.3 g0.4 g0.5 g0.8 g1.1 g1.5 g1.9 g2.3 g2.7 g3.1 g3.4 g3.6 g3.7 g3.7 g3.6 g3.4 g3.2 g2.8 g2.4 g2 g1.6 g1.2 g0.8 g0.6 g0.4 g0.3 g0.3 g0.4 g0.6 g0.9 g1.3 g1.7 g2.1 g2.5 g2.9 g3.2 g3.5 g3.6 g3.7 g3.7 g3.6 g3.3 g3 g2.7 g2.3 g1.8 g1.4 g1 g0.7 g0.5 g3\n" +
	"g3 g3.9 g3.7 g3.4 g3.1 g2.6 g2.2 g1.7 g1.3 g0.9 g0.5 g0.3 g0.1 g0.1 g0.2 g0.4 g0.6 g1 g1.4 g1.9 g2.4 g2.8 g3.2 g3.5 g3.8 g3.9 g3.9 g3.8 g3.6 g3.3 g2.9 g2.5 g2 g1.5 g1.1 g0.7 g0.4 g0.2 g0.1 g0.1 g0.2 g0.5 g0.8 g1.2 g1.6 g2.1 g2.6 g3 g3.4 g3.6 g3.8 g3.9 g3.9 g3.7 g3.5 g3.1 g2.7 g2.3 g1.8 g1.4 g0.9 g0.6 g0.3 g3\n" +
	"g3 g3.9 g3.8 g3.5 g3.1 g2.7 g2.2 g1.7 g1.2 g0.8 g0.5 g0.2 g0 g0 g0.1 g0.3 g0.6 g1 g1.4 g1.9 g2.4 g2.9 g3.3 g3.6 g3.8 g4 g4 g3.9 g3.7 g3.3 g2.9 g2.5 g2 g1.5 g1.1 g0.7 g0.3 g0.1 g0 g0 g0.2 g0.4 g0.7 g1.1 g1.6 g2.1 g2.6 g3 g3.4 g3.7 g3.9 g4 g4 g3.8 g3.5 g3.2 g2.8 g2.3 g1.8 g1.3 g0.9 g0.5 g0.2 g3\n" +
	"g3 g3.9 g3.7 g3.5 g3.1 g2.7 g2.2 g1.7 g1.2 g0.8 g0.5 g0.2 g0.1 g0 g0.1 g0.3 g0.6 g1 g1.4 g1.9 g2.4 g2.8 g3.2 g3.6 g3.8 g3.9 g4 g3.8 g3.6 g3.3 g2.9 g2.5 g2 g1.5 g1.1 g0.7 g0.4 g0.2 g0 g0.1 g0.2 g0.4 g0.8 g1.2 g1.6 g2.1 g2.6 g3 g3.4 g3.7 g3.9 g4 g3.9 g3.8 g3.5 g3.2 g2.8 g2.3 g1.8 g1.3 g0.9 g0.5 g0.3 g3\n" +
	"g3 g3.8 g3.6 g3.3 g3 g2.6 g2.2 g1.7 g1.3 g0.9 g0.6 g0.4 g0.2 g0.2 g0.3 g0.4 g0.7 g1.1 g1.5 g1.9 g2.4 g2.8 g3.1 g3.5 g3.7 g3.8 g3.8 g3.7 g3.5 g3.2 g2.9 g2.4 g2 g1.6 g1.1 g0.8 g0.5 g0.3 g0.2 g0.2 g0.3 g0.5 g0.9 g1.2 g1.6 g2.1 g2.5 g2.9 g3.3 g3.6 g3.7 g3.8 g3.8 g3.6 g3.4 g3.1 g2.7 g2.3 g1.8 g1.4 g1 g0.7 g0.4 g3\n" +
	"g3 g3.5 g3.4 g3.1 g2.9 g2.5 g2.2 g1.8 g1.4 g1.1 g0.8 g0.6 g0.5 g0.5 g0.5 g0.7 g0.9 g1.2 g1.6 g1.9 g2.3 g2.7 g3 g3.2 g3.4 g3.5 g3.5 g3.5 g3.3 g3 g2.7 g2.4 g2 g1.6 g1.3 g1 g0.7 g0.5 g0.5 g0.5 g0.6 g0.8 g1 g1.3 g1.7 g2.1 g2.4 g2.8 g3.1 g3.3 g3.5 g3.5 g3.5 g3.4 g3.2 g2.9 g2.6 g2.2 g1.8 g1.5 g1.1 g0.9 g0.6 g3\n" +
	"g3 g3.2 g3.1 g2.9 g2.7 g2.4 g2.1 g1.8 g1.5 g1.3 g1.1 g0.9 g0.8 g0.8 g0.9 g1 g1.2 g1.4 g1.7 g1.9 g2.2 g2.5 g2.8 g3 g3.1 g3.2 g3.2 g3.1 g3 g2.8 g2.6 g2.3 g2 g1.7 g1.4 g1.2 g1 g0.9 g0.8 g0.8 g0.9 g1 g1.2 g1.5 g1.8 g2.1 g2.3 g2.6 g2.8 g3 g3.1 g3.2 g3.2 g3.1 g2.9 g2.7 g2.5 g2.2 g1.9 g1.6 g1.3 g1.1 g0.9 g3\n" +
	"g3 g2.7 g2.7 g2.6 g2.4 g2.3 g2.1 g1.9 g1.7 g1.5 g1.4 g1.3 g1.2 g1.2 g1.3 g1.3 g1.5 g1.6 g1.8 g2 g2.1 g2.3 g2.5 g2.6 g2.7 g2.8 g2.8 g2.7 g2.6 g2.5 g2.4 g2.2 g2 g1.8 g1.6 g1.5 g1.4 g1.3 g1.2 g1.2 g1.3 g1.4 g1.5 g1.7 g1.9 g2 g2.2 g2.4 g2.5 g2.7 g2.7 g2.8 g2.8 g2.7 g2.6 g2.5 g2.3 g2.1 g1.9 g1.7 g1.6 g1.4 g1.3 g3\n" +
	"g3 g2.3 g2.3 g2.2 g2.2 g2.1 g2 g2 g1.9 g1.8 g1.8 g1.7 g1.7 g1.7 g1.7 g1.7 g1.8 g1.8 g1.9 g2 g2.1 g2.1 g2.2 g2.2 g2.3 g2.3 g2.3 g2.3 g2.2 g2.2 g2.1 g2.1 g2 g1.9 g1.9 g1.8 g1.8 g1.7 g1.7 g1.7 g1.7 g1.8 g1.8 g1.9 g1.9 g2 g2.1 g2.2 g2.2 g2.3 g2.3 g2.3 g2.3 g2.3 g2.2 g2.2 g2.1 g2 g2 g1.9 g1.8 g1.8 g1.7 g3\n" +
	"g3 g1.8 g1.8 g1.9 g1.9 g1.9 g2 g2 g2.1 g2.1 g2.2 g2.2 g2.2 g2.2 g2.2 g2.2 g2.1 g2.1 g2.1 g2 g2 g1.9 g1.9 g1.8 g1.8 g1.8 g1.8 g1.8 g1.8 g1.9 g1.9 g2 g2 g2 g2.1 g2.1 g2.2 g2.2 g2.2 g2.2 g2.2 g2.2 g2.1 g2.1 g2 g2 g1.9 g1.9 g1.9 g1.8 g1.8 g1.8 g1.8 g1.8 g1.8 g1.9 g1.9 g2 g2 g2.1 g2.1 g2.1 g2.2 g3\n" +
	"g3 g1.3 g1.4 g1.5 g1.6 g1.8 g1.9 g2.1 g2.3 g2.4 g2.5 g2.6 g2.7 g2.7 g2.6 g2.6 g2.5 g2.3 g2.2 g2 g1.9 g1.7 g1.6 g1.5 g1.4 g1.3 g1.3 g1.4 g1.4 g1.5 g1.7 g1.8 g2 g2.2 g2.3 g2.5 g2.6 g2.6 g2.7 g2.7 g2.6 g2.5 g2.4 g2.3 g2.1 g2 g1.8 g1.7 g1.5 g1.4 g1.4 g1.3 g1.3 g1.4 g1.5 g1.6 g1.7 g1.9 g2.1 g2.2 g2.4 g2.5 g2.6 g3\n" +
	"g3 g0.9 g1 g1.2 g1.4 g1.6 g1.9 g2.2 g2.4 g2.7 g2.9 g3 g3.1 g3.1 g3.1 g3 g2.8 g2.6 g2.3 g2.1 g1.8 g1.5 g1.3 g1.1 g1 g0.9 g0.9 g1 g1.1 g1.3 g1.5 g1.7 g2 g2.3 g2.5 g2.7 g2.9 g3 g3.1 g3.1 g3 g2.9 g2.7 g2.5 g2.2 g1.9 g1.7 g1.4 g1.2 g1 g0.9 g0.9 g0.9 g1 g1.1 g1.3 g1.6 g1.8 g2.1 g2.4 g2.6 g2.8 g3 g3\n" +
	"g3 g0.6 g0.7 g0.9 g1.2 g1.5 g1.9 g2.2 g2.6 g2.9 g3.1 g3.3 g3.5 g3.5 g3.4 g3.3 g3 g2.8 g2.4 g2.1 g1.7 g1.4 g1.1 g0.8 g0.6 g0.5 g0.5 g0.6 g0.8 g1 g1.3 g1.6 g2 g2.4 g2.7 g3 g3.2 g3.4 g3.5 g3.5 g3.4 g3.2 g2.9 g2.6 g2.3 g1.9 g1.6 g1.2 g1 g0.7 g0.6 g0.5 g0.5 g0.7 g0.9 g1.1 g1.4 g1.8 g2.1 g2.5 g2.8 g3.1 g3.3 g3\n" +
	"g3 g0.3 g0.4 g0.7 g1 g1.4 g1.8 g2.3 g2.7 g3.1 g3.4 g3.6 g3.7 g3.8 g3.7 g3.5 g3.2 g2.9 g2.5 g2.1 g1.7 g1.2 g0.9 g0.6 g0.4 g0.3 g0.2 g0.3 g0.5 g0.8 g1.2 g1.6 g2 g2.4 g2.8 g3.2 g3.5 g3.7 g3.8 g3.7 g3.6 g3.4 g3.1 g2.8 g2.3 g1.9 g1.5 g1.1 g0.8 g0.5 g0.3 g0.2 g0.3 g0.4 g0.6 g0.9 g1.3 g1.7 g2.2 g2.6 g3 g3.3 g3.6 g3\n" +
	"g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3 g3";

module.exports = class Game
{
	constructor(id, players)
	{
		this.id = id;
		this.gameObjects = new Map();
		this.playerTokens = new Map();

		this.world = new CANNON.World();
		this.world.gravity.set(0, 0, -10);
		this.world.broadphase = new CANNON.NaiveBroadphase();

		this.addObject(new Terrain(terrainstring));

		for(var [object_id, player] of players)
		{
			this.addPlayer(object_id, player);
		}

		// Start the simulation loop
		this.id_gameLoop = null;
		this.id_sendLoop = null;
		this.gameLoop();
		this.sendLoop();
	}

	gameLoop() //
	{
		var self = this;
		var fixedTimeStep = 1.0 / 30.0; // seconds
		var maxSubSteps = 3;

		this.id_gameLoop = setInterval(function() {
			self.world.step(fixedTimeStep, fixedTimeStep, maxSubSteps);
		}, fixedTimeStep * 1000);
	}

	sendLoop() //
	{
		const OnlinePlayerManager = require(rootDirectory + '/managers/OnlinePlayerManager.js');

		var self = this;
		var fixedTimeStep = 1.0 / 30;
		var maxSubSteps = 3;

		this.id_sendLoop = setInterval(function() {
			for(var [token, player_id] of self.playerTokens)
			{
				for(var [object_id, gameObject] of self.gameObjects)
				{
					OnlinePlayerManager.sendMessage(token, {
						receiver: 'updateobject',
						type: gameObject.type,
						object: gameObject.downloadUpdates()
					});
				}
			}
		}, fixedTimeStep * 1000);		
	}

	addObject(object)
	{
		const OnlinePlayerManager = require(rootDirectory + '/managers/OnlinePlayerManager.js');

		if(this.gameObjects.has(object.id)) return;

		this.gameObjects.set(object.id, object);
		object.addTo(this.world);

		for(var [token, player_id] of this.playerTokens)
		{
			OnlinePlayerManager.sendMessage(token, {
				receiver: 'addobject',
				type: object.type,
				object: object.downloadInitial()
			});
		}
	}

	removeObject(object_id) //
	{
		const OnlinePlayerManager = require(rootDirectory + '/managers/OnlinePlayerManager.js');

		if(!this.gameObjects.has(object_id)) return;

		this.gameObjects.get(object_id).removeFrom(this.world);
		this.gameObjects.delete(object_id);

		for(var [token, player_id] of this.playerTokens)
		{
			OnlinePlayerManager.sendMessage(token, {
				receiver: 'removeobject',
				object_id: object_id
			});
		}
	}

	// runs routine stuff when the player is connected, like downloading map
	// probably don't need a player disconnect, for now
	playerConnect(token)
	{
		const OnlinePlayerManager = require(rootDirectory + '/managers/OnlinePlayerManager.js');

		for(var [object_id, gameObject] of this.gameObjects)
		{
			if(gameObject.token != token)
			{
				OnlinePlayerManager.sendMessage(token, {
					receiver: 'addobject',
					type: gameObject.type,
					object: gameObject.downloadInitial()
				});
			}
		}
	}

	handleMessage(token, receiver, message)
	{
		switch(receiver)
		{
			default:
				break;
		}
	}

	// adds player to the player map
	addPlayer(token, player)
	{
		Logger.blue("Player \"" + player.username + "\" added to Game " + this.id);

		this.playerTokens.set(token, player.id);
		this.addObject(player);

		// just set it to an arbirtary position
		player.updatePosition(10, 15, 20);
	}

	hasPlayer(token)
	{
		return this.playerTokens.has(token);
	}

	removePlayer(token)
	{
		if(this.playerTokens.has(token))
		{
			var player = this.gameObjects.get(this.playerTokens.get(token));
			this.removeObject(player.id);
			Logger.blue("Player \"" + player.username + "\" removed from Game " + this.id);
		}
		this.playerTokens.delete(token);
	}
}
