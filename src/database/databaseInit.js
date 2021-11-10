'use strict'
// mongoose 
const mongoose = require('mongoose');
const counterModel = require('./counterModel.js');
const DataCollections = require('./dataCollections.js');
const collectionActions = new DataCollections();

const start = () => {
  mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'conection error: '));
  db.once('open', async () => {
    console.log('(3/3) MongoDB Connected');
    let getCollLength = await collectionActions.get();
    console.log('\tStartup Server Count:', getCollLength.length);
  });
}

module.exports = {
  start
}