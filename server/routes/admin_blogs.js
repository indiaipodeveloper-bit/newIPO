import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all blogs (with pagination and basic fields to keep payload small)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        
        // Optional filtering
        const { category, upcoming, status } = req.query;
        let whereClauses = [];
        let params = [];

        if (category) {
            whereClauses.push('category = ?');
            params.push(category);
        }
        if (upcoming !== undefined) {
            whereClauses.push('upcoming = ?');
            params.push(upcoming);
        }
        if (status !== undefined) {
            whereClauses.push('status = ?');
            params.push(status);
        }

        const whereString = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

        const [countResult] = await pool.execute(`SELECT COUNT(*) as total FROM admin_blogs ${whereString}`, params);
        const total = countResult[0].total;

        // Note: keeping columns limited for fast list viewing unless full is requested
        let selectColumns = '*';
        if (req.query.summary) {
            selectColumns = 'id, title, COALESCE(new_slug, slug) as slug, image, category, upcoming, status, gmp_date, gmp_ipo_price, gmp, created_at';
        }

        // Add pagination params
        params.push(limit, offset);
        
        const [rows] = await pool.query(
            `SELECT ${selectColumns} FROM admin_blogs ${whereString} ORDER BY id DESC LIMIT ? OFFSET ?`,
            params
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

// Get a single blog by slug
router.get('/:slug', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT *, COALESCE(new_slug, slug) as slug FROM admin_blogs WHERE new_slug = ? OR slug = ? LIMIT 1', [req.params.slug, req.params.slug]);
        if (rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single blog by ID (for admin editing)
router.get('/id/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM admin_blogs WHERE id = ? LIMIT 1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new blog
router.post('/', async (req, res) => {
    try {
        const allowedFields = ['title', 'new_slug', 'slug', 'image', 'content', 'faqs', 'user_id', 'status', 'confidential', 'upcoming', 'category', 'new_highlight_text', 'gmp_date', 'gmp_ipo_price', 'gmp', 'gmp_last_updated', 'ipo_details', 'ipo_description', 'ipo_timeline_details', 'ipo_timeline_description', 'ipo_lots_application', 'ipo_lots', 'ipo_lots_share', 'ipo_lots_amount', 'promotor_hold_pre_issue', 'promotor_hold_post_issue', 'finantial_information_ended', 'finantial_information_assets', 'finantial_information_revenue', 'finantial_information_profit_tax', 'financial_info_reserves_surplus', 'finantial_information_networth', 'finantial_information_borrowing', 'key_kpi', 'key_value', 'key_pri_ipo_eps', 'key_pos_ipo_eps', 'key_pre_ipo_pe', 'key_post_ipo_pe', 'competative_strenght', 'meta_title', 'description', 'keyword', 'rhp', 'drhp', 'confidential_drhp'];
        
        let keys = [];
        let values = [];
        let placeholders = [];

        for (const [key, val] of Object.entries(req.body)) {
            if (allowedFields.includes(key)) {
                keys.push(key);
                values.push(val === '' ? null : val);
                placeholders.push('?');
            }
        }

        if (keys.length === 0) return res.status(400).json({ error: 'No valid fields provided' });

        const query = `INSERT INTO admin_blogs (${keys.join(', ')}) VALUES (${placeholders.join(', ')})`;
        const [result] = await pool.execute(query, values);
        
        const [rows] = await pool.execute('SELECT * FROM admin_blogs WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update an existing blog
router.put('/:id', async (req, res) => {
    try {
        const allowedFields = ['title', 'new_slug', 'slug', 'image', 'content', 'faqs', 'user_id', 'status', 'confidential', 'upcoming', 'category', 'new_highlight_text', 'gmp_date', 'gmp_ipo_price', 'gmp', 'gmp_last_updated', 'ipo_details', 'ipo_description', 'ipo_timeline_details', 'ipo_timeline_description', 'ipo_lots_application', 'ipo_lots', 'ipo_lots_share', 'ipo_lots_amount', 'promotor_hold_pre_issue', 'promotor_hold_post_issue', 'finantial_information_ended', 'finantial_information_assets', 'finantial_information_revenue', 'finantial_information_profit_tax', 'financial_info_reserves_surplus', 'finantial_information_networth', 'finantial_information_borrowing', 'key_kpi', 'key_value', 'key_pri_ipo_eps', 'key_pos_ipo_eps', 'key_pre_ipo_pe', 'key_post_ipo_pe', 'competative_strenght', 'meta_title', 'description', 'keyword', 'rhp', 'drhp', 'confidential_drhp'];
        
        let updates = [];
        let values = [];

        for (const [key, val] of Object.entries(req.body)) {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                values.push(val === '' ? null : val);
            }
        }

        if (updates.length === 0) return res.status(400).json({ error: 'No valid fields provided to update' });

        values.push(req.params.id);

        const query = `UPDATE admin_blogs SET ${updates.join(', ')} WHERE id = ?`;
        await pool.execute(query, values);

        const [rows] = await pool.execute('SELECT * FROM admin_blogs WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Blog not found after update' });
        
        res.json(rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a blog
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM admin_blogs WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Blog not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
