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
var dataRouter = require('./routes/data');
var manageRouter = require('./routes/manage');


var app = express()
var port = process.env['PORT']

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize())

// Load routes
app.use('/', indexRouter);
app.use('/data', dataRouter);
app.use('/manage',manageRouter);



app.listen(port, () => {
    var ip = networkUtil.getIp();
    console.log(`Habitat is up and running at: http://${ip}:${port}`)
})