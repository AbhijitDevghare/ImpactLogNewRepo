const { Router } = require('express');
const proxy = require('express-http-proxy');

const router = Router();

// Forward everything under /auth and /password to auth-service
router.use('/', proxy('http://localhost:3009'));   // change URL as needed

module.exports = router;
