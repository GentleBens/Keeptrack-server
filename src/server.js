'use strict';

const express = require('express'); //express server
const app = express(); 
const cors = require('cors'); //allow cors
const morgan = require('morgan'); //helps with middleware
require('./models/counter');
const mongoose = require('mongoose');
const Counter = mongoose.model('counter');


let server = require('http').createServer(app); 
let io = require('socket.io')(server);
//httpServer.listen(process.env.PORT) 

//keep track of how many times a bouncer clicks button
var counter = 0;
console.log('inside the server page counter', counter);
//var socket = io.connect();
// track
//var dailyTotal = 0; 
// update

// middleware
 const notFound = require('./error-handlers/404');
 const serverError = require('./error-handlers/500');
 const apiRoutes = require('./routes/apiRoutes.js');
 const logger = require('./middleware/logger');

//app middleware
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());  //turns the req.body into json
app.use(express.urlencoded({extended: true}));

app.use('/counter', apiRoutes);  // all my routes
app.use(logger);   // console.log() routes and methods

//let counter = 0;
io.on('connection', (socket) => {
  console.log('A bouncer connected:');
  socket.emit('setCounter', { counter: counter });

  socket.on('disconnect', () => {
    console.log('Disconnected: ' + socket); //socket.id
  });

  socket.on('increment', (data) => {
    counter++;
    socket.emit('setCounter', { counter: counter });
  });
  socket.on('decrement', (data) => {
    counter--;
    socket.emit('setCounter', { counter: counter });
  })
})


// io.on('connection', (socket) => {
//   console.log('A bouncer connected:');
//   socket.on('joinRoom', (room) => {
//     socket.join(room);
//     console.log('A bouncer joined counter room: ' + room);
//   });
// });



//proof of life
app.get('/alive', callBackHandler);

function callBackHandler(req, res, next) {
  res.status(200).send('Hello World');
}


//error handlers
app.use('*', notFound); //404 not found if we don't hit our route
app.use(serverError); //500 error when something throws an error



module.exports = {
    server: app,
    start: PORT => {
      if (!PORT) { throw new Error('No PORT here'); }
      app.listen(PORT, () => {
        console.log(`super connected ${PORT}`);
      });
    },
  };


// let server = require('http').createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
// io.on('connection', (socket) => {
//     console.log('a user connected');
//   });


