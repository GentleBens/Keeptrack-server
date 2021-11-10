'use strict';
const model = require('./counterModel');

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
  delete(_id) {
    return this.model.findByIdAndDelete(_id);
  }
  async clearAndSeed() {
    await this.model.deleteMany({});
    let dateArr = ['5/28/2021', '5/29/2021', '5/30/2021', '5/31/2021'];
    let counter = 5;
    dateArr.forEach(async date => {
      await this.model.create({
        date: new Date(date),
        numberCount: counter += 5
      });
    })
  }
}
module.exports = DataCollections;
