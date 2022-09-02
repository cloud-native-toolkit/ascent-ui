const proxy = require("express-http-proxy");
const bodyParser = require("body-parser");

const apiHost = process.env.API_HOST ?? 'http://localhost:3001';

module.exports = function(app){

  const isMultipartRequest = function (req) {
    let contentTypeHeader = req.headers['content-type'];
    return contentTypeHeader && contentTypeHeader.indexOf('multipart') > -1;
  };

  const bodyParserJsonMiddleware = function () {
    return function (req, res, next) {
      if (isMultipartRequest(req)) {
        return next();
      }
      return bodyParser.json()(req, res, next);
    };
  };

  app.use(bodyParserJsonMiddleware());

  /**
   * This proxy middleware is required to dinamically catch formdata 
   * requests (for file upload) and forward file content.
   */
  const proxyMiddleware = function () {
    return function (req, res, next) {
      let reqAsBuffer = false;
      let reqBodyEncoding = true;
      let parseReqBody = true;
      let contentTypeHeader = req.headers['content-type'];
      if (isMultipartRequest(req)) {
        reqAsBuffer = true;
        reqBodyEncoding = null;
        parseReqBody = false;
      }
      return proxy(apiHost, {
        reqAsBuffer,
        reqBodyEncoding,
        parseReqBody
      })(req, res, next);
    };
  };

  app.use('/api', proxyMiddleware());
};
