const { Router } = require('express');
const proxy = require('express-http-proxy');

const router = Router();
router.use('/', proxy('http://localhost:3004'));
module.exports = router;
