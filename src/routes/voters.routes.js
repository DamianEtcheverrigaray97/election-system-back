const router = require('express').Router()
const VotersController = require('../controllers/VotersController');
const Middleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /voters/add:
 *   post:
 *     summary: Add a new voter
 *     description: Adds a new voter to the system with the provided details.
 *     operationId: addVoter
 *     tags:
 *       - Voters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *               - name
 *               - lastName
 *               - dob
 *               - is_candidate
 *             properties:
 *               document:
 *                 type: string
 *                 description: The document number of the voter.
 *                 example: '52686400'
 *               name:
 *                 type: string
 *                 description: The first name of the voter.
 *                 example: 'Damián'
 *               lastName:
 *                 type: string
 *                 description: The last name of the voter.
 *                 example: 'Etcheverrigaray'
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: The date of birth of the voter.
 *                 example: '1997-04-30'
 *               is_candidate:
 *                 type: boolean
 *                 description: Indicates whether the voter is a candidate.
 *                 example: false
 *     responses:
 *       201:
 *         description: Voter successfully added
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
 *                     voterId:
 *                       type: integer
 *                       description: ID of the newly created voter.
 *                       example: 1
 *                     message:
 *                       type: string
 *                       example: Voter successfully added
 *       400:
 *         description: Missing required data or voter already exists
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
 *                   example: Missing required data or Voter already exists
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
router.post('/addVoter',Middleware.verifyToken, VotersController.addVoter);

module.exports = router;