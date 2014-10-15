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
var Unikey = require('./unikey.model');



// Get list of unikeys
exports.index = function(req, res) {
    var query = Unikey.find().select('unikey').exec(function(err, unikeys) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, unikeys);
    })

};

exports.checkUnikey = function(req, res) {
    console.log(req.body);
    var query = Unikey.findOne({
        unikey: req.body.unikey
    }).exec(function(err, unikey) {
        if (err) {
            return handleError(res, err);
        }
        if (!unikey) {
            return res.send(404);
        }
        if (unikey) {
            if (unikey.studentNo === req.body.studentNo) {
                return res.json(201, unikey);
            } else {
                return res.send(400, 'Wrong Student Number');
            }
        }
    })
}

// Get a single thing
exports.show = function(req, res) {
    Unikey.findById(req.params.id, function(err, unikey) {
        if (err) {
            return handleError(res, err);
        }
        if (!unikey) {
            return res.send(404);
        }
        return res.json(unikey);
    });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
    Unikey.create(req.body, function(err, unikey) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, unikey);
    });
};


// Updates an existing thing in the DB.
exports.update = function(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Unikey.findById(req.params.id, function(err, unikey) {
        if (err) {
            return handleError(res, err);
        }
        if (!unikey) {
            return res.send(404);
        }
        var updated = _.merge(unikey, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, unikey);
        });
    });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
    Unikey.findById(req.params.id, function(err, unikey) {
        if (err) {
            return handleError(res, err);
        }
        if (!unikey) {
            return res.send(404);
        }
        unikey.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};


function handleError(res, err) {
    return res.send(500, err);
}
