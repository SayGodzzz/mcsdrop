const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../database/db');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
        res.json({ orders: result.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { items, total } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items in order' });
        }
        const result = await db.query('INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *', [req.user.id, total]);
        res.status(201).json({ order: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;