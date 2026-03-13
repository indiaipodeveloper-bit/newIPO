import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all consultants
router.get('/', async (req, res) => {
    try {
        let query = 'SELECT * FROM consultants';
        const params = [];
        if (req.query.active === 'true') {
            query += ' WHERE is_active = 1';
        }
        query += ' ORDER BY sort_order ASC, created_at DESC';
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET consultant by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM consultants WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Consultant not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a consultant
router.post('/', async (req, res) => {
    try {
        const { 
            name, description = '', image_url = null, is_active = 1, sort_order = 0,
            experience_years = 0, specialization = '', office_location = '', 
            success_stories = '', tags = ''
        } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO consultants 
            (name, description, image_url, is_active, sort_order, experience_years, specialization, office_location, success_stories, tags) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, image_url, is_active, sort_order, experience_years, specialization, office_location, success_stories, tags]
        );
        const [rows] = await pool.execute('SELECT * FROM consultants WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update a consultant
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        // Define allowed fields to avoid unwanted updates
        const allowedFields = [
            'name', 'description', 'image_url', 'is_active', 'sort_order',
            'experience_years', 'specialization', 'office_location', 'success_stories', 'tags'
        ];

        const setClauses = [];
        const params = [];

        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                setClauses.push(`${key} = ?`);
                // Normalize undefined to null, but keep 0 and empty strings
                params.push(value === undefined ? null : value);
            }
        }

        if (setClauses.length === 0) {
            // If no valid fields to update, just return the current record
            const [rows] = await pool.execute('SELECT * FROM consultants WHERE id = ?', [id]);
            return res.json(rows[0] || { error: 'Not found' });
        }

        params.push(id);
        const query = `UPDATE consultants SET ${setClauses.join(', ')} WHERE id = ?`;
        
        await pool.execute(query, params);
        
        const [rows] = await pool.execute('SELECT * FROM consultants WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Consultant not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error('Update Error:', err);
        res.status(400).json({ error: err.message });
    }
});

// DELETE a consultant
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM consultants WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Consultant not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
