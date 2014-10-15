/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var csv = require('csv');
var fs = require('fs');
var _ = require('lodash')
var Unikey = require('./unikey.model');



// Uploads Unikeys From CSV File
exports.uploadFromCSV = function(req, res) {
    
	var parser = csv.parse();
	var csvData = [];

	//Start Stream
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        file.on('data', function(data) {
            parser.write(data);

        });

        //Parse the File
        parser.on('readable', function() {
            while (file = parser.read()) {
                csvData.push(file);
                //console.log(file);
            }
        });

        //Get array ready for entry into mongodb
        file.on('end', function(data) {
        	var headerValues = csvData[0];
        	csvData.shift();
        	for (var i = csvData.length - 1; i >= 0; i--) {
        		csvData[i] = _.zipObject(headerValues, csvData[i]);
        	};
            Unikey.create(csvData, function(err, unikey) {
                if (err) {
                    return handleError(res, err);
                }
                return res.json(201, 'success');
            });
        })


    });





    res.send("respond with a resource");
}

function handleError(res, err) {
	console.log(err);
    return res.send(500, err);
}
