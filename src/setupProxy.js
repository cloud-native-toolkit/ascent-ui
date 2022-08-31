const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.API_HOST,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/'
      },
    })
  );

  // Setup Proxy for Local Development
  // editor for others
  // admin

  app.get(
    '/userDetails', (req, res) => {
      res.send({
          name: "NoeSamaille",
          email: "noe.samaille@ibm.com",
          given_name: "Noé",
          family_name: "Samaille",
          roles: ["ibm-cloud", "editor", "admin"],
          role: "admin",
          region: "eu-de",
          sessionExpire: new Date(Date.now()+3600*1000)
      });
  });
};
