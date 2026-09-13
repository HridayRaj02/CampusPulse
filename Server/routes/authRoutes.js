const router = require('express').Router();
const auth = require('../controllers/authController');
const requireAuth = require('../middlewares/authMiddleware');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/demo', auth.demoLogin);
router.get('/me', requireAuth, auth.me);

module.exports = router;
