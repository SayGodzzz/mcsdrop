const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../database/db');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM products ORDER BY created_at DESC');
        res.json({ products: result.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        if (!name || !price) {
            return res.status(400).json({ error: 'Name and price are required' });
        }
        const result = await db.query('INSERT INTO products (name, description, price, category) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, price, category]);
        res.status(201).json({ product: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category } = req.body;
        const result = await db.query('UPDATE products SET name=$1, description=$2, price=$3, category=$4 WHERE id=$5 RETURNING *', [name, description, price, category, id]);
        res.json({ product: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM products WHERE id=$1', [id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;