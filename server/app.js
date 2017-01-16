var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var index = require('./routes/index');
var apiRoutes = require('./routes/APIRoutes');

app.use(logger('dev'));
app.use(express.static('../PresFiles'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', index);
app.use('/api', apiRoutes);

module.exports = app;
