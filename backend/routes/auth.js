const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const user = await auth.register(username, email, password);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Missing email or password' });
        }
        const { user, token } = await auth.login(email, password);
        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

module.exports = router;