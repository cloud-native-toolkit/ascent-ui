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
const logger = log4js.getLogger(appName);
const request = require('request');
const https = require('https');

(async function () {


// Auth config, defaults to AppId unless config for OpenShift is provided
const AUTH_PROVIDER = process.env.OCP_OAUTH_CONFIG ? "openshift" : "appid";
const LOGIN_URL = "/login";
const LOGOUT_URL = "/logout";
const CALLBACK_URL = "/login/callback";

const conf = {
  application_url: process.env.APP_URI,
  port: 3000
};

function getOAuthServerConfig() {
  return new Promise((resolve,reject) => {
    https.get('https://openshift.default.svc/.well-known/oauth-authorization-server', {rejectUnauthorized: false}, (res) => {
      res.on('data', (d) => {
        console.log('data', d.toString());
        resolve(JSON.parse(d.toString()));
      });
    }).on('error', (e) => {
      reject(e);
    });
 });
}

// Set up authentication
let AuthStrategy;
if (AUTH_PROVIDER === "openshift") {
  AuthStrategy = require('passport-oauth').OAuth2Strategy;
  // Fetch OpenShift auth server config
  let oauthServer = {};
  try {
    oauthServer = await getOAuthServerConfig();
    console.log(oauthServer);
  } catch (error) {
    console.log(error);
    oauthServer = {};
  }
  conf.authConfig = Object.assign(oauthServer, JSON.parse(process.env.OCP_OAUTH_CONFIG));
  conf.authConfig.secret = conf.authConfig.clientSecret;
} else {
  // Auth provider defaults to App ID
  AuthStrategy = require("ibmcloud-appid").WebAppStrategy;
  conf.authConfig = JSON.parse(process.env.APPID_CONFIG);
}

const app = express();

// Health check
app.get('/health', function (req, res, next) {
  res.json({status: 'UP'});
});

app.use(session({
  secret: conf.authConfig.secret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    // secure: true,
    maxAge: 3600 * 2000 // Set session duration to 2 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

passport.use(AUTH_PROVIDER, AUTH_PROVIDER === "openshift" ?
  new AuthStrategy({
    authorizationURL: conf.authConfig.authorization_endpoint,
    tokenURL: conf.authConfig.token_endpoint,
    clientID: conf.authConfig.clientID,
    clientSecret: conf.authConfig.clientSecret,
    callbackURL: conf.application_url + CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    request({
      url: `${conf.authConfig.api_endpoint}/apis/user.openshift.io/v1/users/~`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }, (err, response, body) => {
      const user = JSON.parse(body);
      user.token = accessToken;
      done(err, user);
    });
  })
  :
  new AuthStrategy({
    tenantId: conf.authConfig.tenantId,
    clientId: conf.authConfig.clientId,
    secret: conf.authConfig.secret,
    oauthServerUrl: conf.authConfig.oauthServerUrl,
    redirectUri: conf.application_url + CALLBACK_URL
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
app.get(CALLBACK_URL, passport.authenticate(AUTH_PROVIDER), (req, res, next) => {
  res.redirect("/");
});
app.get(LOGIN_URL, passport.authenticate(AUTH_PROVIDER), function(req, res, next) {
  res.redirect("/");
});
app.get(LOGOUT_URL, function(req, res, next) {
  try {
    req.session.destroy();
    req.logout();
  } catch (e) {
    console.log(`req.logout() ERROR:`, e);
  }
  try {
    AuthStrategy.logout(req);
  } catch (e) {
    console.log(`AuthStrategy.logout(req):`, e);
  }
  res.clearCookie("refreshToken");
  res.redirect("/");
});
// app.use(passport.authenticate(WebAppStrategy.name ));
app.get('/userDetails', (req, res) => {
  if (req.isAuthenticated()) {
    let roles = ["read-only"];
    if (AUTH_PROVIDER === "openshift") {
      if (req.user?.groups?.includes("ascent-fs-viewers")) {
        roles.push("fs-viewer");
      }
      if (req.user?.groups?.includes("ascent-editors")) {
        roles.push("editor");
      }
      if (req.user?.groups?.includes("ascent-admins")) {
        roles.push("admin");
      }
      res.json({
        name: "OpenShift User",
        email: req.user?.metadata?.name,
        given_name: "OpenShift",
        family_name: "User",
        roles: roles,
        role: roles[roles.length-1],
        sessionExpire: req.session.cookie.expires
      });
    } else {
      if (AuthStrategy.hasScope(req, "view_controls")) {
        roles.push("fs-viewer");
      }
      if (AuthStrategy.hasScope(req, "edit")) {
        roles.push("editor");
      }
      if (AuthStrategy.hasScope(req, "super_edit")) {
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
    }
  } else {
    res.json({error: "Not authenticated"});
  }
})
app.use(express.static(path.join(__dirname, "../build")));

// Redirect to home when manually entering know URLs
app.get('/bom*', (req, res) => {res.redirect('/');});
app.get('/architectures*', (req, res) => {res.redirect('/');});
app.get('/solutions', (req, res) => {res.redirect('/');});
app.get('/mapping*', (req, res) => {res.redirect('/');});
app.get('/controls*', (req, res) => {res.redirect('/');});
app.get('/nists*', (req, res) => {res.redirect('/');});
app.get('/services*', (req, res) => {res.redirect('/');});
app.get('/docs*', (req, res) => {res.redirect('/');});
app.get('/onboarding*', (req, res) => {res.redirect('/');});

const protectedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
app.use('/api', (req, res, next) => {
  if (  req.isAuthenticated() && (!protectedMethods.includes(req.method)
      || (AUTH_PROVIDER === "appid" && AuthStrategy.hasScope(req, "edit"))
      || (AUTH_PROVIDER === "openshift" && (req.user.groups.includes("ascent-editors") || req.user.groups.includes("ascent-admins"))))
    ) {
    if (AUTH_PROVIDER === "openshift") {
      req.headers['Authorization'] = `Bearer ${req.user.token}`;
    } else {
      req.headers['Authorization'] = `Bearer ${req.session[AuthStrategy.AUTH_CONTEXT].accessToken} ${req.session[AuthStrategy.AUTH_CONTEXT].identityToken}`;
    }
    return next();
  } else {
    res.status(401).json({
      error: {
        message: "You must be authenticated and have editor role to perform this request."
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

})();