'use strict';

require('dotenv').config();
//const socketServer = require('./src/socketServer');
const server = require('./src/server.js');
const mongo = require('./src/database/databaseInit.js')



console.log('\nStarting Servers and Database:');
mongo.start();
// socketServer.start(process.env.SOCKETPORT);
server.start(process.env.PORT, process.env.SOCKETPORT);

