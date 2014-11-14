'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UnikeySchema = new Schema({
  name: String,
  surname: String,
  unikey: String,
  email: String,
  studentNo: String,
  submitted: Boolean,
  bio: String,
  dateSubmitted: Date,
  files:[{
  	id: String,
  	url: String,
  	type: String,
  	dateUploaded: Date
  }]
});

UnikeySchema
  .virtual('login')
  .get(function() {
    return {
      'unikey': this.unikey
    };
  });


module.exports = mongoose.model('Unikey', UnikeySchema);