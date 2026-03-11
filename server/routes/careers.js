import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get applications for admin
router.get('/admin/enquiries', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM career ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error("Error fetching careers:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Submit application
router.post('/apply', async (req, res) => {
    try {
        const { name, last_name, email, phone, position_applied, experience, resume, coverletter } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and Email are required' });
        }

        const [result] = await pool.query(
            'INSERT INTO career (name, last_name, email, phone, position_applied, experience, resume, coverletter) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, last_name, email, phone, position_applied, experience, resume, coverletter]
        );

        res.status(201).json({ id: result.insertId, message: "Application submitted successfully" });
    } catch (err) {
        console.error("Error submitting application:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Delete application
router.delete('/admin/enquiries/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM career WHERE id = ?', [id]);
        res.json({ message: "Application deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
