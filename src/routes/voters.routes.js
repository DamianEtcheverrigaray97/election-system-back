const router = require('express').Router()
const VotersController = require('../controllers/VotersController');
const Middleware = require('../middleware/authMiddleware');

router.post('/addVoter',Middleware.verifyToken, VotersController.addVoter);

module.exports = router;