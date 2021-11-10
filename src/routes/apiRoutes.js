'use strict';
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Collection = require('../database/dataCollections');
const counter = new Collection();

console.log('made it to the apiRoutes page');
console.log('this is the collection', Collection);
console.log('this is the counter', counter);

router.get('/', handleGetAll);
router.get('/:id', handleGetOne);
router.post('/', handleAdd);
router.put('/:id', handleUpdate);
router.delete('/:id', handleDelete);
async function handleGetAll(req, res) {
  console.log('made it in the get all function');
  try {
    let allClicks = await counter.get();
    res.status(200).json(allClicks);
  } catch (e) {
    throw new Error(e.message)
  }
}
async function handleGetOne(req, res) {
  try {
    console.log('this is GET one request');
    const id = req.params.id;
    let oneClick = await counter.get(id)
    res.status(200).json(oneClick);
  } catch (e) {
    throw new Error(e.message)
  }
}
async function handleAdd(req, res) {
  try {
    console.log('this is the POST request', req.body);
    let obj = req.body;
    let addNewClick = await counter.create(obj);
    res.status(201).json(addNewClick);
  } catch (e) {
    throw new Error(e.message)
  }
}
async function handleUpdate(req, res) {
  try {
    console.log('this is the request', req);
    const id = req.params.id;
    const obj = req.body;
    let updatedRecordClicks = await counter.update(id, obj)
    res.status(200).json(updatedRecordClicks);
  } catch (e) {
    throw new Error(e.message)
  }
}
async function handleDelete(req, res) {
  try {
    let id = req.params.id;
    let deletedRecordClicks = await counter.delete(id);
    res.status(200).json(deletedRecordClicks);
  } catch (e) {
    throw new Error(e.message)
  }
}

module.exports = router;