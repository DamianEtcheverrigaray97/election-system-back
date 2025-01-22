const router = require('express').Router()
const VotesController = require('../controllers/VotesController')
const Middleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /votes/list:
 *   get:
 *     summary: List all votes
 *     description: Retrieves a list of all votes including the candidate and voter details.
 *     operationId: listVotes
 *     tags:
 *       - Votes
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of votes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       voteId:
 *                         type: integer
 *                         description: ID of the vote.
 *                         example: 1
 *                       voteDate:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time when the vote was cast.
 *                         example: '2025-01-20T15:30:00Z'
 *                       candidate:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: Name of the candidate.
 *                             example: 'NameX'
 *                           lastName:
 *                             type: string
 *                             description: Last name of the candidate.
 *                             example: 'LastNameX'
 *                       voter:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: Name of the voter.
 *                             example: 'Yamandú'
 *                           lastName:
 *                             type: string
 *                             description: LastName of the voter.
 *                             example: 'Orsi'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: Server error
 */
router.get('/', Middleware.verifyToken, VotesController.listVotes);

/**
 * @swagger
 * /votes/{id}:
 *   get:
 *     summary: Get vote details
 *     description: Retrieves detailed information about a specific vote by its ID, including the candidate and voter details.
 *     operationId: getVoteDetails
 *     tags:
 *       - Votes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the vote to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the vote details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     voteId:
 *                       type: integer
 *                       description: ID of the vote.
 *                       example: 1
 *                     voteDate:
 *                       type: string
 *                       format: date-time
 *                       description: Date and time when the vote was cast.
 *                       example: '2025-01-20T15:30:00Z'
 *                     candidateId:
 *                       type: integer
 *                       description: ID of the candidate voted for.
 *                       example: 2
 *                     candidateName:
 *                       type: string
 *                       description: Name of the candidate.
 *                       example: 'Damián'
 *                     candidateLastName:
 *                       type: string
 *                       description: Last name of the candidate.
 *                       example: 'López'
 *                     voterId:
 *                       type: integer
 *                       description: ID of the voter who cast the vote.
 *                       example: 3
 *                     voterName:
 *                       type: string
 *                       description: Name of the voter.
 *                       example: 'Damián'
 *                     voterLastName:
 *                       type: string
 *                       description: Last name of the voter.
 *                       example: 'Etcheverrigaray'
 *                     voterDocument:
 *                       type: string
 *                       description: Document ID of the voter.
 *                       example: '52686400'
 *                     voterDob:
 *                       type: string
 *                       format: date
 *                       description: Date of birth of the voter.
 *                       example: '1997-04-30'
 *       400:
 *         description: Vote ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: Vote ID is required
 *       404:
 *         description: Vote not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: Vote not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: Server error
 */
router.get('/vote/:id', Middleware.verifyToken, VotesController.getVoteDetails);

/**
 * @swagger
 * /votes:
 *   post:
 *     summary: Vote
 *     description: Allows a voter to cast a vote for a specific candidate. Verifies if the voter exists, if the voter has already voted, and if the candidate is valid.
 *     operationId: vote
 *     tags:
 *       - Votes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *               - candidate_id
 *             properties:
 *               document:
 *                 type: string
 *                 description: The document ID of the voter.
 *                 example: '12345678'
 *               candidate_id:
 *                 type: integer
 *                 description: The ID of the candidate to vote for.
 *                 example: 2
 *     responses:
 *       201:
 *         description: Vote successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: 'Vote successfully registered'
 *                     voteId:
 *                       type: integer
 *                       description: ID of the registered vote.
 *                       example: 1
 *       400:
 *         description: Missing required data or voter has already voted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: 'Missing required data'
 *       404:
 *         description: Voter or candidate not found or not valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: 'Voter not found'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: 'Server error'
 */
router.post('/vote', VotesController.vote);

/**
 * @swagger
 * /votes/most-voted-candidates:
 *   get:
 *     summary: Get most voted candidates
 *     description: Retrieves the list of candidates with the most votes, ordered by the total votes received.
 *     operationId: mostVotedCandidates
 *     tags:
 *       - Votes
 *     responses:
 *       200:
 *         description: Successfully retrieved the most voted candidates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       candidateId:
 *                         type: integer
 *                         description: ID of the candidate.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: Name of the candidate.
 *                         example: 'Álvaro'
 *                       lastName:
 *                         type: string
 *                         description: Last name of the candidate.
 *                         example: 'Delgado'
 *                       totalVotes:
 *                         type: integer
 *                         description: Total number of votes received by the candidate.
 *                         example: 1119537
 *       404:
 *         description: No candidates found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: 'No candidates found'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: 'Server error'
 */
router.get('/most-voted', Middleware.verifyToken, VotesController.mostVotedCandidates);


module.exports = router;