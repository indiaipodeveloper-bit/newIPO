import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all bankers (with optional category filter)
router.get('/', async (req, res) => {
    try {
        let query = 'SELECT * FROM merchant_bankers';
        const params = [];
        if (req.query.category) {
            query += ' WHERE category = ?';
            params.push(req.query.category);
        }
        query += ' ORDER BY sort_order ASC';
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a banker
router.post('/', async (req, res) => {
    try {
        const {
            name, category, location = '', sebi_registration = '', website = '',
            services = '', total_ipos = 0, established_year = null, description = '',
            logo_url = null, is_active = 1, sort_order = 0,
            total_raised = 0, avg_size = 0, avg_subscription = 0
        } = req.body;
        const [result] = await pool.execute(
            `INSERT INTO merchant_bankers 
            (name, category, location, sebi_registration, website, services, total_ipos, 
             established_year, description, logo_url, is_active, sort_order, total_raised, avg_size, avg_subscription)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, category, location, sebi_registration, website, services, total_ipos,
             established_year, description, logo_url, is_active, sort_order,
             total_raised, avg_size, avg_subscription]
        );
        const [rows] = await pool.execute('SELECT * FROM merchant_bankers WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update a banker
router.put('/:id', async (req, res) => {
    try {
        const fields = Object.keys(req.body).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(req.body), req.params.id];
        await pool.execute(`UPDATE merchant_bankers SET ${fields} WHERE id = ?`, values);
        const [rows] = await pool.execute('SELECT * FROM merchant_bankers WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Banker not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a banker
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM merchant_bankers WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Banker not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
