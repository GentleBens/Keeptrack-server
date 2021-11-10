'use strict';
const model = require('./counterModel');
//Schema
// date: { type: Date, require: true },
// numberCount: { type: Number, require: false }
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
    await this.model.deleteMany({});
    let dateArr = ['5/28/2021', '11/09/2021', '5/30/2021', '5/31/2021'];
    let counter = 5;
    dateArr.forEach(async date => {
      await this.model.create({
        date: new Date(date),
        numberCount: counter += 5
      });
    })
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
