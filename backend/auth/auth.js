const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function register(username, email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email', [username, email, hashedPassword]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Registration failed: ' + error.message);
    }
}

async function login(email, password) {
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        return { user: { id: user.id, username: user.username, email: user.email }, token };
    } catch (error) {
        throw new Error('Login failed: ' + error.message);
    }
}

function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Token verification failed: ' + error.message);
    }
}

module.exports = { register, login, verifyToken };