'use strict';

require('dotenv').config();
//const socketServer = require('./src/socketServer');
const server = require('./src/server.js');
// mongoose 
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true });

console.log('\nStarting Servers and Database:');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'conection error: '));
db.once('open', () => console.log('(3/3) MongoDB Connected'));

// socketServer.start(process.env.SOCKETPORT);
server.start(process.env.PORT, process.env.SOCKETPORT);

