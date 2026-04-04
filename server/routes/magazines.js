import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all magazines sorted by created_at DESC
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM magzine ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching magazines:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET single magazine by id
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM magzine WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Magazine not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a magazine
router.post('/', async (req, res) => {
    try {
        const { title, pdf, language = 'english', pdf_lock = 1, report_images = '' } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO magzine (title, pdf, language, pdf_lock, report_images) VALUES (?, ?, ?, ?, ?)',
            [title, pdf, language, pdf_lock, report_images]
        );
        const [rows] = await pool.execute('SELECT * FROM magzine WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('Error creating magazine:', err);
        res.status(400).json({ error: err.message });
    }
});

// PUT update a magazine
router.put('/:id', async (req, res) => {
    try {
        const allowedFields = ['title', 'pdf', 'language', 'pdf_lock', 'report_images'];
        const keys = Object.keys(req.body).filter(key => allowedFields.includes(key));
        
        if (keys.length === 0) return res.status(400).json({ error: 'No valid fields provided' });

        const updates = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => req.body[key]);
        values.push(req.params.id);

        await pool.execute(`UPDATE magzine SET ${updates} WHERE id = ?`, values);
        const [rows] = await pool.execute('SELECT * FROM magzine WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Magazine not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error('Error updating magazine:', err);
        res.status(400).json({ error: err.message });
    }
});

// DELETE a magazine
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM magzine WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Magazine not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
