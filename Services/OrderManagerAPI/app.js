const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      morgan = require('morgan'),
      consign = require('consign'),
      cors = require('cors'),
      passport = require('passport'),
      passportConfig = require('./passport')(passport),
      jwt = require('jsonwebtoken'),
      config = require('./index.js'),
      database = require('./database')(mongoose, config);
      var path = require('path');

app.use(express.static('.'));
//app.use(express.static(path.resolve(__dirname + '../../../../../Application/dist/static')));
console.log(path.resolve(__dirname + '../../../../../Application/dist/'));
console.log(path.resolve(__dirname + '../'));
app.use("/static", express.static(path.resolve(__dirname +"../")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.use(passport.initialize());
app.set('budgetsecret', config.secret);     
 console.log("test");
consign({ cwd: 'services' })
      .include('OrderManagerAPI/app/setup')
      .then('OrderManagerAPI/app/api')
      .then('OrderManagerAPI/app/routes')
      .into(app);
module.exports = app;