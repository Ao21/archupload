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
var Project = require('./project.model');
var StudioCtrl = require('../studio/studio.controller');

// Get list of things
exports.index = function(req, res) {
    Project.find(function(err, projects) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, projects);
    });
};

// Get list of Users Projects
exports.showProjectByUnikey = function(req, res) {
    Project.find(req.params.unikey, function(err, projects) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, projects);
    });
};

// Get list of Users Projects
exports.showProjectsByStudio = function(req, res) {
    StudioCtrl.getStudio(req.params.id, function(studio) {
        Project.find({'studio': studio.name}).populate('author').exec(function(err, projects){
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, projects);
        })

    })
};

// Get a single thing
exports.show = function(req, res) {
    Project.findById(req.params.id).populate('author').exec(function(err,project){
        if (err) {
            return handleError(res, err);
        }
        if (!project) {
            return res.send(404);
        }
        return res.json(project);
    });


    
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
    Project.create(req.body, function(err, project) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, project);
    });
};




// Updates an existing thing in the DB.
exports.update = function(req, res) {
    console.log(req.body);
    if (req.body._id) {
        delete req.body._id;
    }
    req.body.author = req.body.author._id;
    Project.findById(req.params.id, function(err, project) {
        if (err) {
            return handleError(res, err);
        }
        if (!project) {
            return res.send(404);
        }

        var updated = _.merge(project, req.body, function(old, newer){
              return _.isArray(old) ? newer : undefined;
            });

        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, project);
        });
    });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
    Project.findById(req.params.id, function(err, project) {
        if (err) {
            return handleError(res, err);
        }
        if (!project) {
            return res.send(404);
        }
        project.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    console.log(err);
    return res.send(500, err);
}
