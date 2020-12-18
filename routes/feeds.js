var express = require('express');
var router = express.Router();
//var passport = require('passport')
//var basicAuth = passport.authenticate('basic', { session: false })
var feeds = require('../controllers/feedControllers');

//router.get('/latest/', basicAuth, measurements.getLatestMeasurement);

//router.post('/', basicAuth, measurements.postNewMeasurement);

router.post('/', feeds.postNewFeed);

module.exports = router;