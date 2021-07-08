'use strict';

require('dotenv').config();
const socketServer = require('./src/socketServer');
const server = require('./src/server.js');
// mongoose 
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true });

socketServer.start(process.env.SOCKETPORT);
server.start(process.env.PORT);

