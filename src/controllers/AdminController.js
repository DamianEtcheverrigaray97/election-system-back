const db = require('../config/db');
const bcrypt = require('bcrypt'); // Para comparar contraseñas
const jwt = require('jsonwebtoken');

module.exports = {
    
    login : async (req, res) => {
        const { email, password } = req.body;

        // Verificar que se recibieron los datos necesarios
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                error: 'Missing required data'
            });
        }
    
        try {
            // 1. Verificar si el admin existe en la base de datos
            const [adminResults] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);

            // Si el admin no se encuentra, no revelamos el error específico
            if (adminResults.length === 0) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Incorrect email or password'
                });
            }
    
            const admin = adminResults[0];
    
            // 2. Verificar la contraseña
            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Incorrect email or password'
                });
            }
    
            // 3. Crear un token JWT
            const token = jwt.sign(
                { adminId: admin.id, adminName: admin.name }, process.env.JWT_SECRET,{ expiresIn: '24h' }                          
            );
    
            // 4. Responder con el token y los detalles del admin
            return res.status(200).json({
                status: 'success',
                data: {
                    message: 'Login successful',
                    adminId: admin.id,
                    adminName: admin.name,
                    token: token
                }
            });
    
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                error: 'Server error'
            });
        }
    },

    changePassword: async (req, res) => {
        const { newPassword } = req.body;
    
        // Verificar que se recibió la nueva contraseña
        if (!newPassword) {
            return res.status(400).json({
                status: 'error',
                error: 'New password is required'
            });
        }
    
        try {
            // 1. Obtenemos id del admin.
            const adminId = req.admin.adminId;
    
            // 2. Recuperamos la contraseña actual del administrador de la base de datos
            const [adminResults] = await db.query(
                'SELECT password FROM admins WHERE id = ?',
                [adminId]
            );
    
            if (adminResults.length === 0) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Admin not found'
                });
            }
    
            const currentPasswordHash = adminResults[0].password;
    
            // 3. Verificamos que la nueva contraseña no sea igual a la actual
            const isSamePassword = await bcrypt.compare(newPassword, currentPasswordHash);
            if (isSamePassword) {
                return res.status(400).json({
                    status: 'error',
                    error: 'New password cannot be the same as the current password'
                });
            }
    
            // 4. Encriptamos la nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10);
    
            // 5. Actualizar la contraseña en la base de datos
            const [updateResults] = await db.query(
                'UPDATE admins SET password = ? WHERE id = ?',
                [hashedPassword, adminId]
            );
    
            if (updateResults.affectedRows === 0) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Admin not found'
                });
            }
    
            // 6. Respuesta exitosa
            return res.status(200).json({
                status: 'success',
                data: {
                    message: 'Password updated successfully'
                }
            });
    
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                error: 'Server error'
            });
        }
    }
    
}