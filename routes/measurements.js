var express = require('express');
var router = express.Router();
var passport = require('passport')
var basicAuth = passport.authenticate('basic', { session: false })
var measurements = require('../controllers/measureControllers');

router.get('/',  measurements.getMeasurements);

router.post('/', basicAuth, measurements.postMeasurement);

module.exports = router;
