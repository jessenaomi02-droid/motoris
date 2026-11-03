const router = require('express').Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/roles');
const c = require('../controllers/vehicles.controller');

router.use(auth); // every vehicle route needs a logged-in user

router.get('/', c.getAll);
router.get('/:id', c.getOne);
router.post('/', authorize('admin'), c.create);
router.put('/:id', authorize('admin'), c.update);
router.delete('/:id', authorize('admin'), c.remove);

module.exports = router;
