import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all notifications
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM notification_pdfs ORDER BY sort_order ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a notification
router.post('/', async (req, res) => {
    try {
        const { title, slug, pdf_url = null, link = null, description = '', is_active = 1, sort_order = 0 } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO notification_pdfs (title, slug, pdf_url, link, description, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, slug, pdf_url, link, description, is_active, sort_order]
        );
        const [rows] = await pool.execute('SELECT * FROM notification_pdfs WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update a notification
router.put('/:id', async (req, res) => {
    try {
        const fields = Object.keys(req.body).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(req.body), req.params.id];
        await pool.execute(`UPDATE notification_pdfs SET ${fields} WHERE id = ?`, values);
        const [rows] = await pool.execute('SELECT * FROM notification_pdfs WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Notification not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a notification
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM notification_pdfs WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Notification not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
