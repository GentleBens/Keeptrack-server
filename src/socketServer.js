'use strict'
const express = require('express'); //express server
const app = express();
const cors = require('cors'); //allow cors
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(cors());

app.use(express.json());  //turns the req.body into json
app.use(express.urlencoded({ extended: true }));

module.exports = {
    server: server,
    start: SOCKETPORT => {
        server.listen(3050, () => {
            console.log('listening on localHost:3050');
          });
        },
    };
    io.on('connection', (socket) => {
      console.log('User Connected');
    
      socket.on('action', (data) => {
        console.log('Received Emit from client.  Sending response');
        //console.log(`${socket.username} ${socket.message}`);
        if (data.type === 'server/increment'){
          console.log('increment received', data.obj);
          // socket.broadcast.emit('action', {type:'increment', data:'10'});
          // socket.emit('DoTest');
        }
      });
    
    });






