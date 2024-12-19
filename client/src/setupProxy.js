const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://13.235.67.236:8000',
            changeOrigin: true,
            secure: false,
        })
    );
};