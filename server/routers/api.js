const { createProxyMiddleware } = require('http-proxy-middleware');

const apiHost = process.env.API_HOST || 'http://localhost:3001';

const options = {
  target: apiHost,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/',
  }
};

module.exports = function(app){
  app.use('/api', createProxyMiddleware('/api', options));
};
