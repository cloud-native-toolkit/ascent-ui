/**
 * Copyright 2019 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

const appName = require("./../package").name;
const http = require("http");
const express = require("express");
const log4js = require("log4js");
//const localConfig = require("./config/local.json");
const path = require("path");
var cookieParser = require("cookie-parser");
const session = require('express-session')
const passport = require('passport');
const WebAppStrategy = require("ibmcloud-appid").WebAppStrategy;
const CALLBACK_URL = "/ibm/cloud/appid/callback";
const LOGOUT_URL = "/ibm/cloud/appid/logout";
const logger = log4js.getLogger(appName);

const conf = {
  application_url: process.env.APP_URI,
  appidConfig: JSON.parse(process.env.APPID_CONFIG),
  port: 3000
}

const app = express();

// Health check
app.get('/health', function (req, res, next) {
  res.json({status: 'UP'});
});

app.use(session({
  secret: conf.appidConfig.secret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    // secure: true,
    maxAge: 3600 * 1000 // Extend session duration to an hour
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
passport.use(new WebAppStrategy({
  tenantId: conf.appidConfig.tenantId,
  clientId: conf.appidConfig.clientId,
  secret: conf.appidConfig.secret,
  oauthServerUrl: conf.appidConfig.oauthServerUrl,
  redirectUri: conf.application_url+CALLBACK_URL
}));
passport.serializeUser(function(user, cb) {
  cb(null, user);
  });
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
  });
app.get(CALLBACK_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME));
app.get(LOGOUT_URL, function(req, res, next) {
  WebAppStrategy.logout(req);
  // If you chose to store your refresh-token, don't forgot to clear it also in logout:
  res.clearCookie("refreshToken");
  res.redirect("/");
});
app.use(passport.authenticate(WebAppStrategy.STRATEGY_NAME ));
app.get('/userDetails', passport.authenticate(WebAppStrategy.STRATEGY_NAME), (req, res) => {
  let roles = ["read-only"];
  if (WebAppStrategy.hasScope(req, "view_controls")) {
    roles.push("fs-viewer");
  }
  if (WebAppStrategy.hasScope(req, "edit")) {
    roles.push("editor");
  }
  if (WebAppStrategy.hasScope(req, "super_edit")) {
    roles.push("admin");
  }
  res.json({
    name: req.user.name,
    email: req.user.email,
    given_name: req.user.given_name,
    family_name: req.user.family_name,
    roles: roles,
    role: roles[roles.length-1],
    sessionExpire: req.session.cookie.expires
  });
})
app.use(express.static(path.join(__dirname, "../build")));

// Redirect to home when manually entering know URLs
app.get('/bom*', (req, res) => {res.redirect('/');});
app.get('/architectures*', (req, res) => {res.redirect('/');});
app.get('/myarchitectures', (req, res) => {res.redirect('/');});
app.get('/mapping*', (req, res) => {res.redirect('/');});
app.get('/controls*', (req, res) => {res.redirect('/');});
app.get('/nists*', (req, res) => {res.redirect('/');});
app.get('/services*', (req, res) => {res.redirect('/');});
app.get('/docs*', (req, res) => {res.redirect('/');});
app.get('/onboarding*', (req, res) => {res.redirect('/');});

const protectedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
app.use('/api', passport.authenticate(WebAppStrategy.STRATEGY_NAME), (req, res, next) => {
  if (!protectedMethods.includes(req.method) || WebAppStrategy.hasScope(req, "edit")) {
    req.headers['Authorization'] = `Bearer ${req.session[WebAppStrategy.AUTH_CONTEXT].accessToken} ${req.session[WebAppStrategy.AUTH_CONTEXT].identityToken}`;
    return next();
  } else {
    res.status(401).json({
      error: {
        message: "You must have editor role to perform this request."
      }
    });
  }
});

const server = http.createServer(app);

app.use(
  log4js.connectLogger(logger, { level: process.env.LOG_LEVEL || "info" })
);
const serviceManager = require("./services/service-manager");
require("./services/index")(app);
require("./routers/index")(app, server);

// Add your code here

const port = process.env.PORT || conf.port;
server.listen(port, function() {
  logger.info(`Server listening on http://localhost:${port}`);
});

app.use(function(req, res, next) {
  res.sendFile(path.join(__dirname, "../public", "404.html"));
});

app.use(function(err, req, res, next) {
  res.sendFile(path.join(__dirname, "../public", "500.html"));
});
module.exports = server;
