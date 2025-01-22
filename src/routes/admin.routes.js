// Ruta de autenticación

const router = require('express').Router()
const AdminController = require('../controllers/AdminController')
const Middleware = require('../middleware/authMiddleware');

router.post('/login', AdminController.login);
router.put('/change-password', Middleware.verifyToken, AdminController.changePassword);

module.exports = router;