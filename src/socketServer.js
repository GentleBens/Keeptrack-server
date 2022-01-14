'use strict'
var currentUsers = [];

const express = require('express'); //express server
const app = express();
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
//Mongo Interface
const DataCollections = require('./database/dataCollections.js');
const dataCollection = new DataCollections();

module.exports = {
  start: SOCKETPORT => {
    server.listen(SOCKETPORT, () => {
      console.log(`(2/3) SocketIO Server: ${SOCKETPORT}`);
    })
  }
}

io.on('connection', (socket) => {
  //Initial Connection
  print(`User Connected. ID: ${socket.id}`);
  currentUsers.push({ id: socket.id, socket: socket });
  print('Number Clients -->', currentUsers.length);
  //(event, args, call back for response);

  let updatedArr = currentUsers.reduce((acc, curObj) => {
    print(curObj.id, curObj.socket.connected);
    if (curObj.socket.connected) acc.push(curObj);
    else {
      print('\nremoving id', curObj.id, '\n');
      curObj.socket.disconnect(true);
    }
    return acc;
  }, []);
  currentUsers = updatedArr;
  socket.on('sendServerRequestClientCount', (data, func) => {
    print('recieved sendServerRequestClient');
    func(`Recieved Data ${data}`);
  });
  socket.on('action', (action) => handleSocketAction(action, socket));

});
io.on('disconnect', (socket) => {
  print(`Client ID: ${socket.id} disconnected`);
  let index = currentUsers.findIndex(e => { e.ID === socket.id });
  currentUsers.slice(index);
  print('Client Removed from Current Users List');
});

async function handleSocketAction(action, socket) {
  let request = action.type.split('/');
  switch (request[1]) {

    case 'syncWithServer':
      print(`Syncing Totals from Client: ${socket.id}`)
      let updatedCount = (await dataCollection.syncClientTotal(action.clientCount)).numberCount;
      print(`New Updated Count: ${updatedCount}`);
      print('Emitting Updated Count to all Clients');
      socket.emit(`serverUpdatedCount`, updatedCount);
      break;
    //Get a customized array of date start/end
    case 'getDataRange':
      console.log("ClientAction: ", action.dataRange);
      let dataRange = await dataCollection.getDateRange(action.dataRange);
      console.log('[Collections] DataRange:', dataRange);
      let formattedData = dataRange.map(d => {
        return {

          group: `${d.date.getMonth() + 1}/${d.date.getDate()}/${d.date.getFullYear()}`,
          value: d.numberCount
        }
      });
      console.log('[Collections] Formatted Data: ', formattedData);
      socket.emit(`requestedDataRangeFromServer`, formattedData);
      break;
    //get an object of day, week, and month data for chartDisplay

    case 'getHistoricalData':
      console.log("Getting Historical Data");
      let currentDate = new Date();
      let startDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
      let weekEnd = `${currentDate.getMonth() + 1}/${currentDate.getDate() + 7}/${currentDate.getFullYear()}`;
      let monthEnd = `${currentDate.getMonth() + 2}/${currentDate.getDate() + 7}/${currentDate.getFullYear()}`;

      console.log(`Dates: startDate: ${startDate} weekEnd: ${weekEnd} monthEnd: ${monthEnd}`);

      let dayData = formatDocumentArray(await dataCollection.getDateRange({ startDate, endDate: startDate }));
      let weekData = formatDocumentArray(await dataCollection.getDateRange({ startDate, endDate: weekEnd }));
      let monthData = formatDocumentArray(await dataCollection.getDateRange({ startDate, endDate: monthEnd }));

      let dataToSend = { day: dayData, week: weekData, month: monthData }
      socket.emit(`requestedChartDataFromServer`, dataToSend);
      break;
    default:
      print()
      break;
  }
}
function formatDocumentArray(arr) {
  return arr.map(d => {
    return {
      group: `${d.date.getMonth() + 1}/${d.date.getDate()}/${d.date.getFullYear()}`,
      value: d.numberCount
    }
  });
}
function print(str) {
  console.log(`[Socket Server] ${str}`);
}





