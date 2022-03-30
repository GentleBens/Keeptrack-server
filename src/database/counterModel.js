'use strict';

const mongoose = require('mongoose');
const simpleCounterSchema = new mongoose.Schema({
  date: { type: Date, require: true },
  numberCount: { type: Number, require: false }
});
module.exports = mongoose.model('simpleCounter', simpleCounterSchema);