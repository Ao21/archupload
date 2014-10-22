'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var StudioSchema = new Schema({
  name: String,
  description: String,
  files:[{
    bucket: String,
    etag: String,
    key: String,
    location: String
  }]
});

module.exports = mongoose.model('Studio', StudioSchema);