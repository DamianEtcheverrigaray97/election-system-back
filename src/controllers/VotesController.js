const db = require('../config/db');

module.exports = {
    
    vote : async (req, res) => {
        const { document, candidateId } = req.body;

        // Verificar que se recibieron los datos necesarios
        if (!document || !candidateId) {
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
            const [candidateResults] = await db.query('SELECT * FROM voters WHERE id = ? AND is_candidate = 1', [candidateId]);
            if (candidateResults.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Candidate not found or not a valid candidate'
                });
            }
    
            // 4. Registrar el voto
            const [insertResults] = await db.query('INSERT INTO votes (candidate_id, candidate_voted_id, date) VALUES (?, ?, NOW())', [candidateId, voter.id]);
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
                    v.id AS voteId, 
                    v.date AS voteDate, 
                    v.candidate_id, 
                    c.name AS candidatename, 
                    c.lastName AS candidatelastName, 
                    vt.id AS voterId, 
                    vt.name AS voterName, 
                    vt.lastName AS voterLastName, 
                    vt.document AS voterDocument,
                    vt.dob AS voterDob 
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
                    v.id AS voteId, 
                    v.date AS voteDate, 
                    c.name AS candidateName, 
                    c.lastName AS candidateLastName, 
                    vt.name AS voterName, 
                    vt.lastName AS voterLastName 
                 FROM votes v
                 JOIN voters vt ON v.candidate_voted_id = vt.id
                 JOIN voters c ON v.candidate_id = c.id
                 ORDER BY v.date DESC`
            );

            return res.status(200).json({
                status: 'success',
                data: votes.map(vote => ({
                    voteId: vote.voteId,
                    voteDate: vote.voteDate,
                    candidate: {
                        name: vote.candidateName,
                        lastName: vote.candidateLastName
                    },
                    voter: {
                        name: vote.voterName,
                        lastName: vote.voterLastName
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
    },
    
    getAllVotableCandidates: async (req, res) => {
        try {
            const [results] = await db.query(
                `SELECT 
                    c.id AS candidate_id,
                    c.name AS candidate_name,
                    c.lastName AS candidate_lastName
                 FROM voters c
                 WHERE c.is_candidate = 1`
            );
    
            if (results.length === 0) {
                return res.status(204).json({
                    status: 'success',
                    message: 'No candidates available to vote for.'
                });
            }
    
            return res.status(200).json({
                status: 'success',
                data: results.map(candidate => ({
                    candidateId: candidate.candidate_id,
                    name: candidate.candidate_name,
                    lastName: candidate.candidate_lastName
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