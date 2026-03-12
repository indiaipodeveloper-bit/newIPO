import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all banners sorted by sort_order
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM hero_banners ORDER BY sort_order ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a banner
router.post('/', async (req, res) => {
    try {
        const { title, subtitle = '', image_url, cta_text = '', cta_link = '', badge_text = '', cta2_text = '', cta2_link = '', sort_order = 0, is_active = 1 } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO hero_banners (title, subtitle, image_url, cta_text, cta_link, badge_text, cta2_text, cta2_link, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, subtitle, image_url, cta_text, cta_link, badge_text, cta2_text, cta2_link, sort_order, is_active]
        );
        const [rows] = await pool.execute('SELECT * FROM hero_banners WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update a banner
router.put('/:id', async (req, res) => {
    try {
        const fields = Object.keys(req.body).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(req.body), req.params.id];
        await pool.execute(`UPDATE hero_banners SET ${fields} WHERE id = ?`, values);
        const [rows] = await pool.execute('SELECT * FROM hero_banners WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Banner not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a banner
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM hero_banners WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Banner not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
