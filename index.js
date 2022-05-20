'use strict';

require('dotenv').config();
//const server = require('./src/server.js');
const socketServer = require('./src/socketServer.js');
const mongo = require('./src/database/databaseInit.js');

//Start up everything
console.log('\nStarting Servers and Database:');
mongo.start();
// server.start(process.env.PORT);
socketServer.start(process.env.PORT)

