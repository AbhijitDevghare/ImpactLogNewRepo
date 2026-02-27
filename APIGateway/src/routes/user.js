const { Router } = require('express');
const proxy = require('express-http-proxy');

const router = Router();

// Forward everything under /users to user-service
router.use('/', proxy('http://localhost:3001'));   // change URL as needed

module.exports = router;
