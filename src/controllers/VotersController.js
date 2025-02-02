const db = require('../config/db');

module.exports = {

    addVoter: async (req, res) => {
        const { document, name, lastName, dob, isCandidate } = req.body;
    
        // validamos que se recibieron los datos necesarios
        if (!document || !name || !lastName || !dob || typeof isCandidate === 'undefined') {
            return res.status(400).json({
                status: 'error',
                error: 'Missing required data'
            });
        }
    
        try {
            // Verificar si el documento ya existe
            const [existingVoter] = await db.query('SELECT * FROM voters WHERE document = ?', [document]);
            if (existingVoter.length > 0) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Voter already exists'
                });
            }
    
            // Insertamos el nuevo votante
            const [insertResult] = await db.query(
                'INSERT INTO voters (document, name, lastName, dob, is_candidate) VALUES (?, ?, ?, ?, ?)',
                [document, name, lastName, dob, isCandidate]
            );
    
            return res.status(201).json({
                status: 'success',
                data: {
                    voterId: insertResult.insertId,
                    message: 'Voter successfully added'
                }
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: 'error',
                error: 'Server error'
            });
        }
    }
    
};