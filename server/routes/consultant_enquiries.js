import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all enquiries (Admin only)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT ce.*, c.name as consultant_name 
            FROM consultant_enquiries ce
            JOIN consultants c ON ce.consultant_id = c.id
            ORDER BY ce.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST submit an enquiry
router.post('/', async (req, res) => {
    try {
        const { consultant_id, name, email, phone = '', organisation = '', message } = req.body;

        if (!consultant_id || !name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const [result] = await pool.execute(
            'INSERT INTO consultant_enquiries (consultant_id, name, email, phone, organisation, message) VALUES (?, ?, ?, ?, ?, ?)',
            [consultant_id, name, email, phone, organisation, message]
        );
        
        res.status(201).json({ id: result.insertId, message: 'Enquiry submitted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH mark as read
router.patch('/:id/read', async (req, res) => {
    try {
        const [result] = await pool.execute('UPDATE consultant_enquiries SET is_read = 1 WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Enquiry not found' });
        res.json({ message: 'Marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE an enquiry
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM consultant_enquiries WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Enquiry not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
