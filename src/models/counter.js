'use strict';

const mongoose = require('mongoose');
const counterSchema = new mongoose.Schema({
    counter: {type: Number, required: true}, // held in memory server.js as variable
    dailyTotal: {type: Number, require: true}, // store just incase - held in memory as server.js
    hourlyTotal: {
      date: {type: Date, require: false},
      numberCount: {type: Number, require: false}
    },
  });

module.exports = mongoose.model('counter', counterSchema); 