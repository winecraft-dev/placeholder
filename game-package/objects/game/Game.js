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
		this.players = players;

		this.world = new CANNON.World();
		this.world.gravity.set(0, 0, -10);
		//this.world.broadphase = new CANNON.NaiveBroadphase();

		this.terrain = new Terrain(terrainstring);
		this.terrain.addTo(this.world);

		var fixedTimeStep = 1.0 / 30.0; // seconds
		var maxSubSteps = 3;

		// Start the simulation loop
		var self = this;
		setInterval(function() {
			self.gameAction(fixedTimeStep, fixedTimeStep, maxSubSteps);
			self.sendAction();
		}, fixedTimeStep * 1000);
	}

	gameAction(fixedTimeStep, dt, maxSubSteps)
	{
		this.world.step(fixedTimeStep, dt, maxSubSteps);
	}

	sendAction()
	{
		const OnlinePlayerManager = require(rootDirectory + '/managers/OnlinePlayerManager.js');

		for(var [token, player] of this.players)
		{
			OnlinePlayerManager.sendMessage(token, {
				receiver: 'updateobject',
				type: 'terrain',
				object: this.terrain.downloadUpdates()
			});

			for(var [token, player] of this.players)
			{
				OnlinePlayerManager.sendMessage(token, {
					receiver: 'updateobject',
					type: 'player',
					object: player.downloadUpdates()
				});
			}
		}
	}

	// adds player to the player map
	addPlayer(player)
	{
		Logger.blue("Player \"" + player.username + "\" added to Game " + this.id);
		this.players.set(player.token, player);
		this.players.get(player.token).updatePosition(10, 10, 10);
		this.players.get(player.token).addTo(this.world);
	}

	// runs routine stuff when the player is connected, like downloading map
	// probably don't need a player disconnect, for now
	playerConnect(token)
	{
		const OnlinePlayerManager = require(rootDirectory + '/managers/OnlinePlayerManager.js');

		OnlinePlayerManager.sendMessage(token, {
			receiver: "addobject",
			type: 'terrain',
			object: this.terrain.downloadInitial()
		});

		for(var [token, player] of this.players)
		{
			OnlinePlayerManager.sendMessage(token, {
				receiver: "addobject",
				type: 'player',
				object: player.downloadInitial()
			});
		}
	}

	hasPlayer(token)
	{
		return this.players.has(token);
	}

	removePlayer(token)
	{
		if(this.hasPlayer(token))
		{
			var player = this.players.get(token);
			player.removeFrom(this.world);
			Logger.blue("Player \"" + player.username + "\" removed from Game " + this.id);
		}
		this.players.delete(token);
	}
}
