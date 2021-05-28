require('dotenv').config({ path: __dirname + '/.env' })
const { execSync } = require('child_process');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('./config/passport');
var networkUtil = require('./utils/networkUtil');

// Include routes
var indexRouter = require('./routes/index');
var measurementsRouter = require('./routes/measurements');


var app = express()
var port = 8000 // process.env['PORT']

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(passport.initialize())

// Load routes
app.use('/', indexRouter);
app.use('/measurements', measurementsRouter);

app.listen(port, () => {
    var ip = networkUtil.getIp();
    console.log(`Habitat is up and running at: http://${ip}:${port}`)
})
