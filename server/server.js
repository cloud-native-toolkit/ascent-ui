const express = require('express');
const path = require('path');
var cookieParser = require("cookie-parser");
const session = require('express-session')
const passport = require('passport');
const https = require('https');
const config = require('../config/config');

(async function () {

  // Auth config, defaults to AppId unless config for OpenShift is provided
  const LOGIN_URL = "/login";
  const LOGOUT_URL = "/logout";
  const CALLBACK_URL = "/login/callback";

  const conf = {
    applicationUrl: config.externalUri,
    port: 3000
  };

  function getOAuthServerConfig() {
    return new Promise((resolve, reject) => {
      https.get('https://openshift.default.svc/.well-known/oauth-authorization-server', {
        rejectUnauthorized: false
      }, (res) => {
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
  if (config.authProvider === "openshift") {
    AuthStrategy = require('passport-oauth').OAuth2Strategy;
    // Fetch OpenShift auth server config
    let oauthServer = {};
    try {
      oauthServer = await getOAuthServerConfig();
    } catch (error) {
      console.log(error);
      oauthServer = {};
    }
    conf.authConfig = Object.assign(oauthServer, config.authConfig);
    conf.authConfig.secret = conf.authConfig.clientSecret;
  } else {
    // Auth provider defaults to App ID
    AuthStrategy = require("ibmcloud-appid").WebAppStrategy;
    conf.authConfig = config.authConfig;
  }

  const app = express();

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
  app.use(express.urlencoded({
    extended: false
  }));
  app.use(cookieParser());

  passport.use(config.authProvider, config.authProvider === "openshift" ?
    new AuthStrategy({
        authorizationURL: conf.authConfig.authorization_endpoint,
        tokenURL: conf.authConfig.token_endpoint,
        clientID: conf.authConfig.clientID,
        clientSecret: conf.authConfig.clientSecret,
        callbackURL: conf.applicationUrl + CALLBACK_URL
      },
      (accessToken, refreshToken, profile, done) => {
        https.get(`${conf.authConfig.api_endpoint}/apis/user.openshift.io/v1/users/~`, {
          rejectUnauthorized: false,
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }, (res) => {
          res.on('data', (d) => {
            const user = JSON.parse(d.toString());
            user.token = accessToken;
            done(undefined, user);
          });
        }).on('error', (e) => {
          done(e, undefined);
        });
      }) :
    new AuthStrategy({
      tenantId: conf.authConfig.tenantId,
      clientId: conf.authConfig.clientId,
      secret: conf.authConfig.secret,
      oauthServerUrl: conf.authConfig.oauthServerUrl,
      redirectUri: conf.applicationUrl + CALLBACK_URL
    })
  );

  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });
  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });
  const redirectAfterLogin = (req, res, next) => {
    if (req.session) console.log('test', req.session.redirectUrl);
    res.redirect(req.session?.redirectUrl ? req.session.redirectUrl : '/');
  }
  app.get(CALLBACK_URL, passport.authenticate(config.authProvider), redirectAfterLogin);
  app.get(LOGIN_URL, passport.authenticate(config.authProvider), redirectAfterLogin);
  app.get(LOGOUT_URL, function (req, res, next) {
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
      // Grant editor role by default
      let roles = ["default", "editor"];
      if (config.authProvider === "openshift") {
        if (req.user?.groups?.includes("ascent-admins")) {
          roles.push("admin");
        }
        res.json({
          name: "OpenShift User",
          email: req.user?.metadata?.name?.replace('IAM#', ''),
          given_name: "OpenShift",
          family_name: "User",
          roles: roles,
          role: roles[roles.length - 1],
          sessionExpire: req.session.cookie.expires
        });
      } else {
        if (AuthStrategy.hasScope(req, "super_edit")) {
          roles.push("admin");
        }
        res.json({
          name: req.user.name,
          email: req.user.email,
          given_name: req.user.given_name,
          family_name: req.user.family_name,
          roles: roles,
          role: roles[roles.length - 1],
          sessionExpire: req.session.cookie.expires,
          region: config.region
        });
      }
    } else {
      res.json({
        error: "Not authenticated"
      });
    }
  })

  app.use(express.static(path.join(__dirname, "../dist")));


  app.use('/api/token', (req, res, next) => {
    if (  req.isAuthenticated() &&
        ((config.authProvider === "appid" && AuthStrategy.hasScope(req, "super_edit"))
        || (config.authProvider === "openshift" && req.user.groups.includes("ascent-admins"))))
    {
      if (config.authProvider === "openshift") {
        res.json({token: Buffer.from(`${req.user.token}`).toString('base64')});
      } else {
        res.json({token: Buffer.from(req.session[AuthStrategy.AUTH_CONTEXT].refreshToken).toString('base64')});
      }
      return next();
    } else {
      res.status(401).json({
        error: {
          message: "You cannot perform this request."
        }
      });
    }
  });

  const protectedMethods = [];
  app.use('/api', (req, res, next) => {
    if ( req.isAuthenticated() && (!protectedMethods.includes(req.method)
        || (config.authProvider === "appid" && AuthStrategy.hasScope(req, "edit"))
        || (config.authProvider === "openshift" && (req.user.groups.includes("ascent-editors") || req.user.groups.includes("ascent-admins"))))
      ) {
      if (config.authProvider === "openshift") {
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

  require('./api')(app, config.apiHost);

  const loginEnpoints = ['/solutions*', '/bom*', '/services*', '/onboarding*', '/controls*', '/mapping*', '/nists*'];

  const ensureAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated() && req.session) {
      req.session.redirectUrl = req.originalUrl
      res.redirect(LOGIN_URL);
    } else return next();
  }
  for (const loginEndpoint of loginEnpoints) {
    app.get(loginEndpoint, ensureAuthenticated);
  }

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
