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

  
    app.use(
    '/chatra-script',
    createProxyMiddleware({
      target: 'https://call.chatra.io',
      changeOrigin: true,
      pathRewrite: { '^/chatra-script': '' },
    })
  );
  

  app.use(
    '/chatra-io',
    createProxyMiddleware({
      target: 'https://chat.chatra.io',
      changeOrigin: true,
      pathRewrite: { '^/chatra-io': '' },
    })
  );

  
};


