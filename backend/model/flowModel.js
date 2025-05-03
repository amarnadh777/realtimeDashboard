const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  id: String,
  type: String,
  data: Object,
  position: Object
}, { _id: false });

const edgeSchema = new mongoose.Schema({
  id: String,
  source: String,
  target: String
}, { _id: false });

const flowSchema = new mongoose.Schema({
  email:String,
  nodes: [nodeSchema],
  edges: [edgeSchema]
});

module.exports =  mongoose.model('Flow', flowSchema);
