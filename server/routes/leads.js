import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all leads with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM leads');
        const total = countResult[0].total;

        const [rows] = await pool.query(
            `SELECT * FROM leads ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        res.json({
            data: rows,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a new lead
router.post('/', async (req, res) => {
    try {
        const { name, email, phone = '', company = '', message } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO leads (name, email, phone, company, message) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, company, message]
        );
        const [rows] = await pool.execute('SELECT * FROM leads WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update a lead (usually toggling is_read)
router.put('/:id', async (req, res) => {
    try {
        const fields = Object.keys(req.body).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(req.body), req.params.id];
        await pool.execute(`UPDATE leads SET ${fields} WHERE id = ?`, values);
        const [rows] = await pool.execute('SELECT * FROM leads WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Lead not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a lead
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM leads WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Lead not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
