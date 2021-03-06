const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require our routes into the applications.
require('./server/routes')(app);

app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the employee statistics server',
}));

module.exports = app;
