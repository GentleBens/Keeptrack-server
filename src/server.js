'use strict';

const io = require('socket.io-client');
const express = require('express'); //express server
const app = express();
const cors = require('cors'); //allow cors
const morgan = require('morgan'); //helps with middleware
require('./database/counterModel');
const mongoose = require('mongoose');
const socketServer = require('./socketServer.js')



//keep track of how many times a bouncer clicks button
var counter = 0;
console.log('inside the server page counter', counter);


// middleware
const notFound = require('./error-handlers/404');
const serverError = require('./error-handlers/500');
const apiRoutes = require('./routes/apiRoutes.js');
const logger = require('./middleware/logger');
const DataCollections = require('./database/dataCollections.js');
const dataCollection = new DataCollections();
// const { Console } = require('console');
// const { findByIdAndUpdate } = require('./models/counter');

//app middleware
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());  //turns the req.body into json
app.use(express.urlencoded({ extended: true }));

app.get('/clearandseed', (req, res) => dataCollection.clearAndSeed())
app.use('/counter', apiRoutes);  // all my routes
app.use(logger);   // console.log() routes and methods

//proof of life
app.get('/alive', (req, res) => res.status(200).send('Yes, I am alive'));

//error handlers
app.use('*', notFound); //404 not found if we don't hit our route
app.use(serverError); //500 error when something throws an error


module.exports = {
  server: app,
  start: (PORT, SOCKETPORT) => {
    if (!PORT) { throw new Error('No PORT here'); }
    app.listen(PORT, () => {
      console.log(`(1/3) Express Server: ${PORT}`);
    });
    socketServer.start(SOCKETPORT)
  },
};




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

//TODO: get it to actually search.  Perhaps change the schema to date and count.
//
//  const counterSchema = new mongoose.Schema({      
//  date: {type: Date, require: false},
//  numberCount: {type: Number, require: false},  
//});
// Would make it easier to scan non nested documents.

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
  socket.emit('updateCounter', totalCount);
  counter = 0;
}



//Execution lines






