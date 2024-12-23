const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
 
  
  app.use(
    '/id/v1',
    createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true })
  );
  
  app.use(
    '/metrics/v1',
    createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true })
  );
  
  app.use(
    '/cryptocompare',
    createProxyMiddleware({
      target: 'https://min-api.cryptocompare.com',
      changeOrigin: true,
      pathRewrite: { '^/cryptocompare': '' },
    })
  );


  
  
};
