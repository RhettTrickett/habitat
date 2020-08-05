var express = require('express');
var router = express.Router();
var passport = require('passport')
var basicAuth = passport.authenticate('basic', { session: false })
var measurements = require('../controllers/measureControllers');

router.get('/latest/', basicAuth, measurements.getLatestMeasurement);

router.post('/', basicAuth, measurements.postNewMeasurement);

module.exports = router;