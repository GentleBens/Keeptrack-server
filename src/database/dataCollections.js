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
  //Entries in Range for Chart use
  async getDateRange(rangeObj) {
    //console.log('[Collections] getDateRange');
    console.log('[Collections] rangeObj: ', rangeObj)
    let startDate = new Date(rangeObj.startDate);
    let endDate = new Date(rangeObj.endDate);
    //console.log('[Collections]:', rangeObj.startDate);

    let docs = await this.model.find({
      date: {
        $gte: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
        $lt: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1)
      }
    });
    console.log(`[Collections] Docs in DateRange: ${docs}`);
    return docs;
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
    let dateArr = ['01/12/2022', '01/13/2022', '01/14/2022', '01/15/2022', '01/16/2022', '01/17/2022', '01/18/2022', '01/19/2022', '01/20/2022'];
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
