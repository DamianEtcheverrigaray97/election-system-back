const db = require('../config/db');

module.exports = {
    
    vote : async (req, res) => {
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
            const [voterResults] = await db.query('SELECT * FROM voters WHERE document = ?', [document]);
            if (voterResults.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Voter not found'
                });
            }
            
            const voter = voterResults[0];
    
            // 2. Verificar si el votante ya ha votado
            const [voteResults] = await db.query('SELECT * FROM votes WHERE candidate_voted_id = ?', [voter.id]);
            if (voteResults.length > 0) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Voter has already voted'
                });
            }
    
            // 3. Verificar que el candidato exista
            const [candidateResults] = await db.query('SELECT * FROM voters WHERE id = ? AND is_candidate = 1', [candidate_id]);
            if (candidateResults.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Candidate not found or not a valid candidate'
                });
            }
    
            // 4. Registrar el voto
            const [insertResults] = await db.query('INSERT INTO votes (candidate_id, candidate_voted_id, date) VALUES (?, ?, NOW())', [candidate_id, voter.id]);
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
    }
    
}