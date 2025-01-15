const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
      '/auth', // 프록시가 적용될 경로
      createProxyMiddleware({
        target: 'http://localhost:5000/auth', // 백엔드 서버 주소
        changeOrigin: true,
      })
    );
    app.use(
      '/posts', // 프록시가 적용될 경로
      createProxyMiddleware({
        target: 'http://localhost:5000/posts', // 백엔드 서버 주소
        changeOrigin: true,
      })
    );
    app.use(
      '/profile', // 프록시가 적용될 경로
      createProxyMiddleware({
        target: 'http://localhost:5000/profile', // 백엔드 서버 주소
        changeOrigin: true,
      })
    );
    app.use(
      '/users', // 프록시가 적용될 경로
      createProxyMiddleware({
        target: 'http://localhost:5000/users', // 백엔드 서버 주소
        changeOrigin: true,
      })
    );
    app.use(
      '/api', // 프록시가 적용될 경로
      createProxyMiddleware({
        target: 'http://localhost:5000/api', // 백엔드 서버 주소
        changeOrigin: true,
      })
    );
};
