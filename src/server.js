'use strict';

const express = require('express'); //express server
const app = express();
const cors = require('cors'); //allow cors
const morgan = require('morgan'); //helps with middleware
require('./models/counter');
const mongoose = require('mongoose');
const Counter = mongoose.model('counter');


let server = require('http').createServer(app);
//let io = require('socket.io')(server);
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
app.use(express.urlencoded({ extended: true }));

app.use('/counter', apiRoutes);  // all my routes
app.use(logger);   // console.log() routes and methods


// app.get('/counter', (req, res) => {
//  console.log('counter response', req.query);
//  let output = {
//    counter: req.query.
//  }
//  res.status(200).json(output)
// });

// determine if table exist for current date if not make a new table for that date
// let doesTableExist = async (desiredDate) => {

//  //let currentDate = new Date();
//   // let daily = dailyTotal.date.getDate();

//   let allRecords = await Counter.find().exec() // everything in db
//     for(let i = 0; i < allRecords.length; i++) {

//       if(desiredDate === allRecords[i].dailyTotal.date.getDate())
//       console.log('Record located');
//       return true;
//     } 
//     return false;
//   // if(daily === currentDate.getDate())
//   // console.log('Daily total date', {currentDate})
// };
// console.log(doesTableExist(21));


async function getAll() {
  return Counter.find()
    .then((data) => data)
    .catch(e => { console.log(e) });
}

async function printData(desiredDate) {
  let dbase = await getAll();
  //console.log(dbase[0]);
  for (let i = 0; i < dbase.length; i++) {
    let dbaseDate = dbase[i].dailyTotal.date.getDate();
    if (desiredDate === dbaseDate) {
      console.log('found it');
      return true;
    }
  }
  console.log('no find it');
  return false;
}
console.log(printData(21).toString());




// add to socket.io server
//let counter = 0;
// io.on('connection', (socket) => {
//   console.log('A bouncer connected:');
//   socket.emit('connection', { counter: counter });

//   socket.on('disconnect', () => {
//     console.log('Disconnected: ' + socket); //socket.id
//   });

//   socket.on('increment', (data) => {
//     counter++;
//     socket.emit('increment', { counter: counter });
//   });
//   socket.on('decrement', (data) => {
//     counter--;
//     socket.emit('decrement', { counter: counter });
//   })
// })



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

async function getAll() {
  return Counter.find()
    .then((data) => data)
    .catch(e => { console.log(e) });
}


async function printData(desiredDate) {
  let dbase = await getAll();
  //console.log(dbase[0]);
  for (let i = 0; i < dbase.length; i++) {
    let dbaseDate = dbase[i].dailyTotal.date.getDate();
    if (desiredDate === dbaseDate) {
      console.log('found it');
      return true;
    }
  }
  console.log('no find it');
  return false;
}
function callBackHandler(req, res, next) {
  res.status(200).send('Hello World');
}

var boolStuff = '123';
console.log(`umm ${boolStuff}`);
boolStuff = printData(27);
console.log(`umm ${boolStuff}`);

console.log(typeof (boolStuff));
