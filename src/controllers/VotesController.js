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
    },
    
    getVoteDetails: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                error: 'Vote ID is required'
            });
        }

        try {
            const [voteDetails] = await db.query(
                `SELECT 
                    v.id AS vote_id, 
                    v.date AS vote_date, 
                    v.candidate_id, 
                    c.name AS candidate_name, 
                    c.lastName AS candidate_lastName, 
                    vt.id AS voter_id, 
                    vt.name AS voter_name, 
                    vt.lastName AS voter_lastName, 
                    vt.document AS voter_document,
                    vt.dob AS voter_dob 
                FROM votes v
                JOIN voters vt ON v.candidate_voted_id = vt.id
                JOIN voters c ON v.candidate_id = c.id
                WHERE v.id = ?`,
                [id]
            );

            if (voteDetails.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Vote not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: voteDetails[0]
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: 'error',
                error: 'Server error'
            });
        }
    },

    listVotes: async (req, res) => {
        try {
            const [votes] = await db.query(
                `SELECT 
                    v.id AS vote_id, 
                    v.date AS vote_date, 
                    c.name AS candidate_name, 
                    c.lastName AS candidate_lastName, 
                    vt.name AS voter_name, 
                    vt.lastName AS voter_lastName 
                 FROM votes v
                 JOIN voters vt ON v.candidate_voted_id = vt.id
                 JOIN voters c ON v.candidate_id = c.id
                 ORDER BY v.date DESC`
            );

            return res.status(200).json({
                status: 'success',
                data: votes.map(vote => ({
                    voteId: vote.vote_id,
                    voteDate: vote.vote_date,
                    candidate: {
                        name: vote.candidate_name,
                        lastName: vote.candidate_lastName
                    },
                    voter: {
                        name: vote.voter_name,
                        lastName: vote.voter_lastName
                    }
                }))
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: 'error',
                error: 'Server error'
            });
        }
    },

    mostVotedCandidates: async (req, res) => {
        try {
            const [results] = await db.query(
                `SELECT 
                    c.id AS candidate_id,
                    c.name AS candidate_name,
                    c.lastName AS candidate_lastName,
                    COUNT(v.id) AS total_votes
                 FROM votes v
                 JOIN voters c ON v.candidate_id = c.id
                 WHERE c.is_candidate = 1
                 GROUP BY c.id, c.name, c.lastName
                 ORDER BY total_votes DESC`
            );
    
            if (results.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    error: 'No candidates found'
                });
            }
    
            return res.status(200).json({
                status: 'success',
                data: results.map(candidate => ({
                    candidateId: candidate.candidate_id,
                    name: candidate.candidate_name,
                    lastName: candidate.candidate_lastName,
                    totalVotes: candidate.total_votes
                }))
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: 'error',
                error: 'Server error'
            });
        }
    }
    
}