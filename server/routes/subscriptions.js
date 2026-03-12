import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Add a new subscriber
// POST /api/subscriptions
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        // Check for existing subscription first
        const [existing] = await pool.query('SELECT * FROM newsletter_subscriptions WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email is already subscribed' });
        }

        const [result] = await pool.query(
            'INSERT INTO newsletter_subscriptions (email, is_active) VALUES (?, 1)',
            [email]
        );
        res.status(201).json({ id: result.insertId, email });
    } catch (err) {
        console.error('Error inserting subscription:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get all subscriptions
// GET /api/subscriptions
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM newsletter_subscriptions ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching subscriptions:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update subscription status
// PUT /api/subscriptions/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        await pool.query(
            'UPDATE newsletter_subscriptions SET is_active = ? WHERE id = ?',
            [is_active, id]
        );
        res.json({ message: 'Subscription updated successfully' });
    } catch (err) {
        console.error('Error updating subscription:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a subscription
// DELETE /api/subscriptions/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM newsletter_subscriptions WHERE id = ?', [id]);
        res.json({ message: 'Subscription deleted successfully' });
    } catch (err) {
        console.error('Error deleting subscription:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
