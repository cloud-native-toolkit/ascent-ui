const express = require('express');
const path = require('path');
var cookieParser = require("cookie-parser");
const session = require('express-session')
const passport = require('passport');
const https = require('https');
const config = require('../config/config');

(async function () {
  const conf = {
    applicationUrl: config.externalUri,
    port: 3000
  };

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({
    extended: false
  }));
  app.use(cookieParser());

  app.use(express.static(path.join(__dirname, "../dist")));

  require('./api')(app, config.apiHost);

  app.get('/health', function (req, res) {
    res.json({
      status: 'UP'
    });
  });

  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });

  app.listen(config.servicePort, function () {
    console.info(`Server listening on http://localhost:${config.servicePort}`);
  });

})();
