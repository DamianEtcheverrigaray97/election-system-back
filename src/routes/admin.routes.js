// Ruta de autenticación

const router = require('express').Router()
const AdminController = require('../controllers/AdminController')
const Middleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticates an admin using email and password and returns a JWT token.
 *     operationId: loginAdmin
 *     tags:
 *       - Admin Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the admin.
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 description: The password of the admin.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful and JWT token generated
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
 *                       example: Login successful
 *                     adminId:
 *                       type: integer
 *                       description: ID of the logged-in admin.
 *                       example: 1
 *                     adminName:
 *                       type: string
 *                       description: Name of the logged-in admin.
 *                       example: Admin
 *                     token:
 *                       type: string
 *                       description: JWT token for authentication.
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbmlkIjo...
 *       400:
 *         description: Incorrect email or password
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
 *                   example: Incorrect email or password
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
router.post('/login', AdminController.login);

/**
 * @swagger
 * /admin/change-password:
 *   put:
 *     summary: Change admin password
 *     description: Allows an authenticated admin to change their password.
 *     operationId: changeAdminPassword
 *     tags:
 *       - Admin Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password for the admin account.
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password successfully updated
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
 *                       example: Password updated successfully
 *       400:
 *         description: New password cannot be the same as the current password or admin not found
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
 *                   example: New password cannot be the same as the current password
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
router.put('/change-password', Middleware.verifyToken, AdminController.changePassword);

module.exports = router;