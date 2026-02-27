const { Router } = require('express');
const proxy = require('express-http-proxy');

const router = Router();

// WebSocket upgrade path for Socket.io
router.use('/socket.io', proxy('http://localhost:3003/socket.io', {
  proxyReqPathResolver: req => "/socket.io" + req.url
}));

router.use('/', proxy('http://localhost:3003'));

module.exports = router;
