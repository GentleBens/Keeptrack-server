'use strict';
const model = require('./counterModel');
const moment = require('moment');

class DataCollections {
  constructor() {
    this.model = model;
  }
  async get(_id) {
    if (_id) {
      return await this.model.findOne({ _id });
    }
    else {
      return await this.model.find({});
    }
  }
  create(record) {
    let newRecord = new this.model(record);
    return newRecord.save();
  }
  update(_id, record) {
    return this.model.findByIdAndUpdate(_id, record, { new: true });
  }
  //Entries in Range for Chart use
  async getDateRange(rangeObj) {
    let startDate = new Date(rangeObj.startDate);
    let endDate = new Date(rangeObj.endDate);
    let docs = await this.model.find({
      date: {
        $gte: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
        $lt: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1)
      }
    });
    let sortedRange = docs.sort((a, b) => a.date - b.date);
    return sortedRange;
  }
  async syncClientTotal(clientCount) {
    let document = await retrieveCurrentDataDoc(new Date());
    if (document) {
      let updateDoc = {
        date: document.date,
        numberCount: document.numberCount + clientCount
      }
      await this.model.findByIdAndUpdate(document._id, updateDoc);
      return await this.get(document._id);
    }
    else {
      console.log('No Date Present in Collection: New Entry Created');
      let newDoc = await this.model.create({
        date: new Date(),
        numberCount: clientCount
      });
      return newDoc;
    }

  }
  delete(_id) {
    return this.model.findByIdAndDelete(_id);
  }
  async clearAndSeed() {
    //Clear all data in DB
    await this.model.deleteMany({});
    let dateArr = [];
    let startDate = moment(new Date());
    console.log(startDate.format("LLL"));
    startDate.add(1, 'd');
    console.log(startDate.format("LLL"));
    let dte = startDate.toDate();
    console.log(dte);
    for (let i = 1; i <= 180; i++) {
      let currentDate = startDate.clone();
      currentDate.add(i * -1, 'd');
      dateArr.push(currentDate.toDate());
      let randCount = Math.floor(Math.random() * (200 - 50) + 50);
      await this.model.create({
        date: currentDate.toDate(),
        numberCount: randCount
      });
    }

    // let counter = 5;
    // dateArr.forEach(async date => {
    //   await this.model.create({
    //     date: new Date(date),
    //     numberCount: counter += 5
    //   });
    // })
  }
}

let retrieveCurrentDataDoc = async (date) => {
  let record = await model.findOne({
    date: {
      $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    }
  });

  return record ? record : null;
}


module.exports = DataCollections;
