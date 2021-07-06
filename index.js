'use strict';

require('dotenv').config();
const server = require('./src/server.js');
const socketServer = require('./src/socketServer');
// mongoose 
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true });

server.start(process.env.PORT);
socketServer.start(process.env.SOCKETPORT);

