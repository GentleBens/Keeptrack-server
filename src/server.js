'use strict';

const io = require('socket.io-client');
const express = require('express'); //express server
const app = express();
const cors = require('cors'); //allow cors
const morgan = require('morgan'); //helps with middleware
require('./models/counter');
const mongoose = require('mongoose');

//Server needs to be a client of the Socket Server as well
let socket = io('http://localhost:3050');
let socketId;
socket.on("connect", () => {
  console.log(`Server Socket Client ID: ${socket.id}`); // ojIckSD2jqNzOqIrAGzL
  socketId = socket.id;    
});
socket.on("sendClientInfo",() => {
  
  let infoData = {ID: socket.id, NAME: 'CounterServer'};
  console.log('Server: Sending ClientInfo: ' + infoData);  
  socket.emit('userinfo', infoData);
});
socket.on('updateCounter', (data) => {
  counter += data.total;
  console.log(`COUNTER SERVER: Updated counter to ${counter}`);
  console.log('Sent Emit to \'UpdateTotalsOnAllClients\'');
  socket.emit('UpdateTotalsOnAllClients', {totalCount: counter});
})
//const Counter = mongoose.model('counter');
const SimpleCounter = mongoose.model('simpleCounter');



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
// const { Console } = require('console');
// const { findByIdAndUpdate } = require('./models/counter');

//app middleware
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());  //turns the req.body into json
app.use(express.urlencoded({ extended: true }));

app.use('/counter', apiRoutes);  // all my routes
app.use(logger);   // console.log() routes and methods



// #region 
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


// async function getAll() {
//   return Counter.find()
//     .then((data) => data)
//     .catch(e => { console.log(e) });
// }

// async function printData(desiredDate) {
//   let dbase = await getAll();
//   //console.log(dbase[0]);
//   for (let i = 0; i < dbase.length; i++) {
//     let dbaseDate = dbase[i].dailyTotal.date.getDate();
//     if (desiredDate === dbaseDate) {
//       console.log('found it');
//       return true;
//     }
//   }
//   console.log('no find it');
//   return false;
// }
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
//#endregion


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


function callBackHandler(req, res, next) {
  res.status(200).send('Hello World');
}
//JPJ - This sill get all the documents in the database
async function getAll() {
  return SimpleCounter.find()
    .then((data) => data)
    .catch(e => { console.log(`Error Found: ${e}`) });
}
//Add a document entry for a desired date and countnumber TODO: add an update to this document
async function addDailyTotalData(desDate, count) {
  let entryDate = new Date();
  entryDate = desDate;
  SimpleCounter.create({
    date: entryDate,
    numberCount: count
  }, function (err) {
    if (err) return handleError(err);
    console.log('Entry Saved');
  });
}
// Prints out all the documents in the database as a console.log
async function printAllDbData() {
  let dbase = await getAll();
  dbase.forEach(i => {
    let formattedDate = `${i.date.getMonth()}/${i.date.getDate()}/${i.date.getFullYear()}`;
    console.log(`Date: ${formattedDate} Count: ${i.numberCount}`);
    console.log(`Full Format ${i.date}}`);
  });
}

//TODO: get it to actually search.  Perhaps change the schema to date and count.
//
//  const counterSchema = new mongoose.Schema({      
//  date: {type: Date, require: false},
//  numberCount: {type: Number, require: false},  
//});
// Would make it easier to scan non nested documents.
async function bombTheDatabase() {
  await SimpleCounter.deleteMany({});
  await seedDatabase();

  console.log('Database Slicked and Seeded');
}
async function findDbDocument(searchDate) {
  let countNum = 200;
  console.log(`Date to search: ${searchDate}`);
  console.log(`CountNumber: ${countNum}`);
  let data = await SimpleCounter.findOne({ date: searchDate }).exec();
  console.log(data);
  //will return null if no record found.  
  return data;
}
async function seedDatabase() {
  let dateArr = ['5/28/2021', '5/29/2021', '5/30/2021', '5/31/2021'];
  let counter = 5;
  dateArr.forEach(d => addDailyTotalData(d, counter += 5));
}
//This will determine if there is a record for the updated totals.  if true it will add to the total already stored.  if false it will create a new record and add the counter then reset it.
async function updateDailyTotals(clientCount) {
  let date = new Date();
  let dateString = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
  console.log(dateString);
  //TODO: find a more eloquent way to search for just the date
  let record = await findDbDocument(dateString);
  if (record === null) {
    console.log("No Record Exists.  Creating a new record and updating totals.");
    addDailyTotalData(dateString, counter);

  }
  else {
    let totalCount = counter + record.numberCount;
    console.log(`Aggregate total going into document: counter: ${counter} recordCount: ${record.numberCount} = ${totalCount}`);
    console.log(`Updating the following ${record.date} using id: ${record.id}`);

    await SimpleCounter.findByIdAndUpdate(record._id, {
      date: Date.parse(dateString),
      numberCount: record.numberCount + counter
    });
  }
  counter = 0;
}



//Execution lines


printAllDbData();

//addDailyTotalData('5/29/2021');
//let searchDate = new Date('5/30/2021');
//bombTheDatabase();
//counter = 20;
//console.log(`Counter: ${counter}`);

//updateDailyTotals();
//console.log(`Counter: ${counter}`);
//findDbDocument(searchDate);




