'use strict';

var express = require('express');
var controller = require('./aws.controller');

var router = express.Router();

router.get('/s3Policy', controller.getS3Policy);
router.get('/getClientConfig', controller.getClientConfig);

module.exports = router;