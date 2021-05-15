'use strict';

const mongoose = require('mongoose');
const counterSchema = new mongoose.Schema({
    counter: {type: Number, required: true},
  })

module.exports = mongoose.model('counter', counterSchema); 