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
// app.use(cors());

// app.use(express.json());  //turns the req.body into json
// app.use(express.urlencoded({ extended: true }));

module.exports = {
  start: SOCKETPORT => {
    server.listen(SOCKETPORT, () => {
      console.log(`(2/3) SocketIO Server: ${SOCKETPORT}`);
    })
  }
}

let currentUsers = [];
io.on('connection', (socket) => {
  //Initial Connection
  console.log(`User Connected. ID: ${socket.id}`);
  currentUsers.push({ id: socket.id, socket: socket });
  console.log('Number Clients -->', currentUsers.length);
  //(event, args, call back for response);

  let updatedArr = currentUsers.reduce((acc, curObj) => {
    console.log(curObj.id, curObj.socket.connected);
    if (curObj.socket.connected) acc.push(curObj);
    else {
      console.log('\nremoving id', curObj.id, '\n');
      curObj.socket.disconnect(true);
    }
    return acc;
  }, []);
  console.log('updatedArr', updatedArr.length);



  socket.emit('sendClientInfo', socket.id, (data) => console.log('reply:', data))
  socket.on('sendServerRequestClientCount', (data, func) => {
    console.log('recieved sendServerRequestClient');
    func(`Recieved Data ${data}`);
  })
  //Event Listeners
  //   socket.on('action', (data) => {
  //     //data = {type: obj: 0} <-type: action/message        

  //     if (data.type === 'server/totalUpdate') {
  //       console.log(`Client ID: ${socket.id}Total Value: ${data.obj}`);
  //       socket.broadcast.emit('updateCounter', { total: data.obj });
  //     }
  //   });
  //   socket.on('userinfo', (data) => {
  //     console.log('recieved user info from client');
  //     console.log(`ID: ${data.ID} Name: ${data.NAME}`);
  //     if (!currentUsers.find(e => data.ID === e.ID)) {
  //       currentUsers.push(data);
  //     }
  //     //{ID: socket.id, PORT: socket.PORT, NAME: 'CounterServer'};
  //     currentUsers.forEach(element => {
  //       console.log(`Current Users: ${element.ID} ${element.NAME}`);
  //     });
  //     console.log(`Total Users: ${currentUsers.length}`);
  //   });
  //   //socket.emit('UpdateTotalsOnAllClients', {totalCount: counter});

  //   setTimeout(() => {
  //     console.log('SocketServer: Requesting Client Information');
  //     io.to(socket.id).emit('sendClientInfo');
  //   }, 5);
  //   socket.on('UpdateTotalsOnAllClients', (data) => {
  //     console.log('SOCKETIO SERVER: Emitting SyncTotalCounter');
  //     socket.broadcast.emit('SyncTotalCounter', { totalCount: data.totalCount });
  //   });
});
io.on('disconnect', (socket) => {
  console.log(`Client ID: ${socket.id} disconnected`);
  let index = currentUsers.findIndex(e => { e.ID === socket.id });
  currentUsers.slice(index);
  console.log('Client Removed from Current Users List');
});







