const proxy = require("express-http-proxy");
const bodyParser = require("body-parser");

module.exports = function(app, apiHost){

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
