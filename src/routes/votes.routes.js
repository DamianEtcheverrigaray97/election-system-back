const router = require('express').Router()
const VotesController = require('../controllers/VotesController')
const Middleware = require('../middleware/authMiddleware');

router.post('/vote', VotesController.vote);

module.exports = router;