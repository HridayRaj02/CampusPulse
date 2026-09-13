const router = require('express').Router();
const controller = require('../controllers/campusController');

router.get('/health', (_req, res) => res.json({ status: 'online' }));
router.get('/profile', controller.getProfile);
router.get('/students', controller.getStudents);
router.route('/activities').get(controller.getActivities).post(controller.createActivity);
router.route('/privacy').get(controller.getPrivacy).put(controller.updatePrivacy);

module.exports = router;
