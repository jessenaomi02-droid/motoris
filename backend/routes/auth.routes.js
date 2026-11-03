const router = require('express').Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/roles');
const c = require('../controllers/auth.controller');

router.post('/login', c.login);
router.get('/me', auth, c.me);
router.post('/register', auth, authorize('admin'), c.register);

module.exports = router;
