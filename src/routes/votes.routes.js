const router = require('express').Router()
const VotesController = require('../controllers/VotesController')
const Middleware = require('../middleware/authMiddleware');

router.get('/', Middleware.verifyToken, VotesController.listVotes);
router.get('/vote/:id', Middleware.verifyToken, VotesController.getVoteDetails);
router.post('/vote', VotesController.vote);
router.get('/most-voted', Middleware.verifyToken, VotesController.mostVotedCandidates);


module.exports = router;