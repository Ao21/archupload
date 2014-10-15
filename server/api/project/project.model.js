'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  name: String,
  studio: String,
  summary: String,
  detail: String,
  files:[{
  	bucket: String,
  	etag: String,
  	key: String,
  	location: String
  }]
});

module.exports = mongoose.model('Project', ProjectSchema);