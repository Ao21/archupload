/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Studio = require('./studio.model');

// Get list of things
exports.index = function(req, res) {
  Studio.find(function (err, studios) {
    if(err) { return handleError(res, err); }
    return res.json(200, studios);
  });
};

exports.getStudio = function(studio, cb){
  Studio.findById(studio, function (err, studio) {
    if(err) { return handleError(res, err); }
    return cb(studio);
  });
}


// Get a single thing
exports.show = function(req, res) {
  Studio.findById(req.params.id, function (err, studio) {
    if(err) { return handleError(res, err); }
    if(!studio) { return res.send(404); }
    return res.json(studio);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Studio.create(req.body, function(err, studio) {
    if(err) { return handleError(res, err); }
    return res.json(201, studio);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Studio.findById(req.params.id, function (err, studio) {
    if (err) { return handleError(res, err); }
    if(!studio) { return res.send(404); }
    var updated = _.merge(studio, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, studio);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Studio.findById(req.params.id, function (err, studio) {
    if(err) { return handleError(res, err); }
    if(!studio) { return res.send(404); }
    studio.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}