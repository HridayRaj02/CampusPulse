const router = require('express').Router();
const controller = require('../controllers/eventController');
const requireAuth = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/adminMiddleware');

router.get('/', controller.getEvents);
router.post('/', requireAuth, requireAdmin, controller.createEvent);

module.exports = router;
