const CANNON = require('cannon');

const OnlinePlayerManager = require(rootDirectory + '/managers/OnlinePlayerManager.js');

const Logger = require(rootDirectory +'/objects/Logger.js');
const Terrain = require('./Terrain.js');
const MaterialIndex = require('./MaterialIndex.js');

// temporary map text, later we'll add a way to load maps from text files or something
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
	constructor(game_id, players)
	{
		this.id = game_id;
		this.gameObjects = new Map(); // single map of object_id => gameobject
		this.playerTokens = new Map(); // map of player token => their avatar's object_id

		// creates the world
		this.world = new CANNON.World();
		this.world.gravity.set(0, 0, -10);
		this.world.broadphase = new CANNON.NaiveBroadphase();
		MaterialIndex.addContactMaterials(this.world);

		// passes a Terrain to the addObject function (declared below)
		this.addObject(new Terrain(terrainstring));

		// passes each GamePlayer of players map to the addPlayer function (declared below)
		for(var [object_id, player] of players)
		{
			this.addPlayer(object_id, player);
		}

		// Start the simulation loop
		this.id_gameLoop = null;
		this.id_sendLoop = null;
		this.gameLoop();
		this.sendLoop();

		// to deal with contacts
		this.currentContacts = new Set();
	}

	gameLoop()
	{
		var self = this;
		var fixedTimeStep = 1.0 / 60.0; // seconds
		var maxSubSteps = 3;

		// simple loop that happens 30x a sec.
		this.id_gameLoop = setInterval(function() {
			// steps the world 1/30 sec.
			self.world.step(fixedTimeStep, fixedTimeStep, maxSubSteps);
			self.handleContacts();
		}, fixedTimeStep * 1000);
	}

	sendLoop()
	{
		const OnlinePlayerManager = require(rootDirectory + '/managers/OnlinePlayerManager.js');

		var self = this;
		var fixedTimeStep = 1.0 / 20;

		// simple loop that happens 20x a sec
		this.id_sendLoop = setInterval(function() {
			// for each player:
			for(var [token, player_id] of self.playerTokens)
			{
				// send each gameobject in the gameObject map to the player
				for(var [object_id, gameObject] of self.gameObjects)
				{
					// sends only an update of the gameObject to the player
					// usually stuff about position, rotation etc.
					OnlinePlayerManager.sendMessage(token, {
						receiver: 'updateobject', // to receiver updateobject
						type: gameObject.type,
						object: gameObject.downloadUpdates()
					});
				}
			}
		}, fixedTimeStep * 1000);	
	}

	handleContacts()
	{
		var oldContacts = new Set(this.currentContacts);

		for(var contact of this.world.contacts)
		{
			oldContacts.delete(([contact.bi.id, contact.bj.id]).toString());
			oldContacts.delete(([contact.bj.id, contact.bi.id]).toString());

			if(!this.currentContacts.has(([contact.bi.id, contact.bj.id]).toString())
				&& !this.currentContacts.has(([contact.bj.id, contact.bi.id]).toString()))
			{
				this.currentContacts.add(([contact.bi.id, contact.bj.id]).toString());

				this.gameObjects.get(contact.bi.id).beginContact(this.gameObjects.get(contact.bj.id));
				this.gameObjects.get(contact.bj.id).beginContact(this.gameObjects.get(contact.bi.id));
			}
		}

		for(var pairText of oldContacts)
		{
			this.currentContacts.delete(pairText);
			var pair = pairText.split(',');

			this.gameObjects.get(parseInt(pair[0])).endContact(this.gameObjects.get(parseInt(pair[1])));
			this.gameObjects.get(parseInt(pair[1])).endContact(this.gameObjects.get(parseInt(pair[0])));
		}
		//console.log(this.currentContacts);
	}

	// function that consolidates all of the trouble of adding objects to the game
	addObject(object)
	{
		const OnlinePlayerManager = require(rootDirectory + '/managers/OnlinePlayerManager.js');

		// if the object with the id already exists, something broke...
		if(this.gameObjects.has(object.id)) return;

		// adds the object to the map, then uses the object.addTo function to add the object to the world
		this.gameObjects.set(object.id, object);
		object.addTo(this.world);

		// sends data about the object to each player
		for(var [token, player_id] of this.playerTokens)
		{
			// sends all the info about the gameObject, like all of the data to create the mesh in ThreeJS
			if(object.token && token != object.token)
			{
				OnlinePlayerManager.sendMessage(token, {
					receiver: 'addobject', // to receiver addobject
					type: object.type,
					self: false,
					object: object.downloadInitial()
				});
			}
		}
	}

	// function that consolidates all of the trouble of removing objects from the game
	removeObject(object_id)
	{
		const OnlinePlayerManager = require(rootDirectory + '/managers/OnlinePlayerManager.js');

		// if the object with the id doesn't exist...something really broke
		if(!this.gameObjects.has(object_id)) return;

		// removes the object from the world, then from the gameObject map
		this.gameObjects.get(object_id).removeFrom(this.world);
		this.gameObjects.delete(object_id);

		// sends the id of the gameObject to remove to all of the players
		for(var [token, player_id] of this.playerTokens)
		{
			OnlinePlayerManager.sendMessage(token, {
				receiver: 'removeobject', // to receiver removeobject
				object_id: object_id
			});
		}
	}

	// when a player connects, they need to get all of the objects in gameObjects map, so this method
	// sends all of them to the player
	playerConnect(token)
	{
		const OnlinePlayerManager = require(rootDirectory + '/managers/OnlinePlayerManager.js');

		for(var [object_id, gameObject] of this.gameObjects)
		{
			if(gameObject.token != token)
			{	
				OnlinePlayerManager.sendMessage(token, {
					receiver: 'addobject', // to receiver addobject
					type: gameObject.type,
					self: false,
					object: gameObject.downloadInitial()
				});
			}
			else
			{
				OnlinePlayerManager.sendMessage(token, {
					receiver: 'addobject',
					type: gameObject.type,
					self: true,
					object: gameObject.downloadInitial()
				});
			}
		}
	}

	// takes all user input stuff
	handleMessage(token, receiver, message)
	{
		var gameObject = this.gameObjects.get(this.playerTokens.get(token));

		switch(receiver)
		{
			case 'controls':
				if(message.controls && message.quaternion)
					gameObject.updateControls(message.controls, message.quaternion);
				break;
			case 'team_chat':
				// future stuff to send messages between players
				break;
			case 'match_chat':
				// future stuff to send messages between players
				break;
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
		player.updatePosition(Math.random() * 20 + 5, Math.random() * 20 + 5, 20);
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
