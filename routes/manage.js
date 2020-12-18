var express = require('express');
var router = express.Router();
//var passport = require('passport')
//var basicAuth = passport.authenticate('basic', { session: false })
var manager = require('../controllers/managementControllers');

//router.get('/latest/', basicAuth, measurements.getLatestMeasurement);

//router.post('/', basicAuth, measurements.postNewMeasurement);

router.post('/', manager.postNewFeed);

module.exports = router;