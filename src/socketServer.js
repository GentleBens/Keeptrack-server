'use strict'
const express = require('express'); //express server
const app = express();
const cors = require('cors'); //allow cors
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:19006", //for testing local
    //origin: "https://parent-pickup-coordinator.netlify.app/", //for deployment
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
  });


app.use(cors());

app.use(express.json());  //turns the req.body into json
app.use(express.urlencoded({ extended: true }));

module.exports = {
    server: server,
    start: SOCKETPORT => {server.listen(3050, () => {
          console.log('SocketIO Server listening on localHost:3050');
        })
    }
  }
      
    let currentUsers = [];
    io.on('connection', (socket) => {
      io.sockets()
      console.log(`User Connected. ID: ${socket.id}`);
      socket.on('action', (data) => {
        console.log(`SOCKETIO Server: Received Emit from client: ${data.type}. Sending response`);
        //console.log(`${socket.username} ${socket.message}`);
        if (data.type === 'server/totalUpdate'){
          console.log(`Client ID: ${socket.id}Total Value: ${data.obj}`);
          socket.broadcast.emit('updateCounter', {total: data.obj});
        }        
      });        
      socket.on('userinfo', (data) =>{
        console.log('recieved user info from client');
        console.log(`ID: ${data.ID} Name: ${data.NAME}`);
        if(!currentUsers.find(e => data.ID === e.ID)){
                    currentUsers.push(data);
        }
        //{ID: socket.id, PORT: socket.PORT, NAME: 'CounterServer'};
        currentUsers.forEach(element => {
          console.log(`Current Users: ${element.ID} ${element.NAME}`);          
        });
        console.log(`Total Users: ${currentUsers.length}`);
      });
      
      setTimeout(()=>{
        console.log('SocketServer: Requesting Client Information');
        io.to(socket.id).emit('sendClientInfo');
      },5);
    });
    io.on('disconnect', (socket) => {
      console.log(`Client ID: ${socket.id} disconnected`);
      let index = currentUsers.findIndex(e => {e.ID === sockect.id});
      currentUsers.slice(index);
      console.log('Client Removed from Current Users List');      
    });






