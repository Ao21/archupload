'use strict';

var express = require('express');
var controller = require('./unikey.controller');
var upload = require('./unikey.upload');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/names', controller.names);
router.get('/:id', controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.post('/upload', auth.hasRole('admin'), upload.uploadFromCSV);
router.post('/check', controller.checkUnikey);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;