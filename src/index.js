const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Verificar conexión
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

// Middleware
app.use(bodyParser.json());


// Realizar votación
app.post('/vote', async (req, res) => {
    const { document, candidate_id } = req.body;

    // Verificar que se recibieron los datos necesarios
    if (!document || !candidate_id) {
        return res.status(400).json({
            status: 'error',
            error: 'Missing required data'
        });
    }

    try {
        // 1. Verificar si el votante existe en la base de datos
        const [voterResults] = await db.promise().query('SELECT * FROM voters WHERE document = ?', [document]);
        if (voterResults.length === 0) {
            return res.status(404).json({
                status: 'error',
                error: 'Voter not found'
            });
        }
        
        const voter = voterResults[0];

        // 2. Verificar si el votante ya ha votado
        const [voteResults] = await db.promise().query('SELECT * FROM votes WHERE candidate_voted_id = ?', [voter.id]);
        if (voteResults.length > 0) {
            return res.status(400).json({
                status: 'error',
                error: 'Voter has already voted'
            });
        }

        // 3. Verificar que el candidato exista
        const [candidateResults] = await db.promise().query('SELECT * FROM voters WHERE id = ? AND is_candidate = 1', [candidate_id]);
        if (candidateResults.length === 0) {
            return res.status(404).json({
                status: 'error',
                error: 'Candidate not found or not a valid candidate'
            });
        }

        // 4. Registrar el voto
        const [insertResults] = await db.promise().query('INSERT INTO votes (candidate_id, candidate_voted_id, date) VALUES (?, ?, NOW())', [candidate_id, voter.id]);
        return res.status(201).json({
            status: 'success',
            data: {
                message: 'Vote successfully registered',
                voteId: insertResults.insertId
            }
        });

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            error: 'Server error'
        });
    }
});

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

// Iniciar sesión
app.post('/login', async (req, res) => {
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
        const [adminResults] = await db.promise().query('SELECT * FROM admins WHERE email = ?', [email]);

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
});

// Verificar token
function verifyToken(req, res, next) {
    // Obtenemos token del header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Verificamos en caso que el token no está presente
    if (!token) {
        return res.status(401).json({
            status: 'error',
            error: 'Access denied. No token provided.'
        });
    }

    // Verificar y decodificar el token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; 
        next();
    } catch (err) {
        return res.status(400).json({
            status: 'error',
            error: 'Invalid token'
        });
    }
}

// Modificar contraseña
app.put('/admin/change-password', verifyToken, async (req, res) => {
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

        // 2. Encriptamos la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 3. Actualizar la contraseña en la base de datos
        const [updateResults] = await db.promise().query(
            'UPDATE admins SET password = ? WHERE id = ?', [hashedPassword, adminId]
        );

        if (updateResults.affectedRows === 0) {
            return res.status(400).json({
                status: 'error',
                error: 'Admin not found'
            });
        }

        // 4. Respuesta exiotsa
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
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Corriendo en http://localhost:${port}`);
});
