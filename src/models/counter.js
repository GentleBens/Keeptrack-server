'use strict';

const mongoose = require('mongoose');
const counterSchema = new mongoose.Schema({
  counter: { type: Number, required: true }, // held in memory server.js as variable
  dailyTotal: {
    date: { type: Date, require: false },
    numberCount: { type: Number, require: false }
  },
});
const simpleCounterSchema = new mongoose.Schema({
  date: { type: Date, require: true },
  numberCount: { type: Number, require: false }
});
module.exports = mongoose.model('counter', counterSchema);
module.exports = mongoose.model('simpleCounter', simpleCounterSchema);