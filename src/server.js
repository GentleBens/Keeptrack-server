'use strict';

const express = require('express'); //express server
const app = express();
const cors = require('cors'); //allow cors
const morgan = require('morgan'); //helps with middleware
require('./database/counterModel');
const socketServer = require('./socketServer.js')

//keep track of how many times a bouncer clicks button
var counter = 5;

// middleware
const notFound = require('./error-handlers/404');
const serverError = require('./error-handlers/500');
const apiRoutes = require('./routes/apiRoutes.js');
const logger = require('./middleware/logger');
const DataCollections = require('./database/dataCollections.js');
const dataCollection = new DataCollections();

//app middleware
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());  //turns the req.body into json
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  apiRoutes.handleGetAll(req, res);
})

app.get('/clearandseed', (req, res) => {
  dataCollection.clearAndSeed();
  res.status(200).send('Cleared and Seeded');
})
app.use('/counter', apiRoutes);  // all my routes
app.use(logger);   // console.log() routes and methods

//Test Routes
app.get('/alive', (req, res) => res.status(200).send('Yes, I am alive'));
app.post('/range', async (req, res) => {
  let start = new Date(req.body.start);
  let end = new Date(req.body.end);
  let rangeDocs = await dataCollection.getDateRange(
    {
      startDate: start,
      endDate: end
    }
  );
  res.status(200).send(rangeDocs);
});


//error handlers
app.use('*', notFound); //404 not found if we don't hit our route
app.use(serverError); //500 error when something throws an error


module.exports = {
  server: app,
  start: (PORT) => {
    if (!PORT) { throw new Error('No PORT here'); }
    app.listen(PORT, () => {
      console.log(`(1/3) Express Server: ${PORT}`);
    });
  },
  counter: counter
};









