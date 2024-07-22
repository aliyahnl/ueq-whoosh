const express = require('express');
const router = express.Router();
const connection = require('../models/response');

router.post('/responses', (req, res) => {
    const {
        name: nama, usia, gender,
        A1, P1, N1, 
        P2, S1, S2,
        S3, D1, E1, 
        N2, D2, A2,
        P3, A3, N3,
        A4, D3, S4,
        D4, E2, P4,
        E3, E4, A5,
        A6, N4
    } = req.body;

    const query = `
        INSERT INTO responses (
            nama, usia, gender,
            A1, P1, N1, 
            P2, S1, S2,
            S3, D1, E1, 
            N2, D2, A2,
            P3, A3, N3,
            A4, D3, S4,
            D4, E2, P4,
            E3, E4, A5,
            A6, N4
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(query, [
        nama, usia, gender,
        A1, P1, N1, 
        P2, S1, S2,
        S3, D1, E1, 
        N2, D2, A2,
        P3, A3, N3,
        A4, D3, S4,
        D4, E2, P4,
        E3, E4, A5,
        A6, N4
    ], (err, results) => {
        if (err) {
            return res.status(400).send(err);
        }
        res.status(201).send(results);
    });
});

router.get('/responses', (req, res) => {
    const query = 'SELECT * FROM responses';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching responses:', err);
            res.status(500).json({ error: 'Failed to fetch responses' });
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
