import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all registrars with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [rows] = await pool.execute(
            'SELECT * FROM registrar ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [limit.toString(), offset.toString()]
        );

        const [totalRows] = await pool.execute('SELECT COUNT(*) as count FROM registrar');
        const total = totalRows[0].count;

        res.json({
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single registrar by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM registrar WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Registrar not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single registrar by SLUG
router.get('/slug/:slug', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM registrar WHERE slug = ?', [req.params.slug]);
        if (rows.length === 0) return res.status(404).json({ error: 'Registrar not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create registrar
router.post('/', async (req, res) => {
    try {
        const {
            name, image, meta_title, meta_desc, meta_keywords, slug,
            sme_ipo, mainboard_ipo, sme_ipo_parentage, mainboard_ipo_parentage,
            avgsubscription_sme, avgsubscription_mainboard, location, dic,
            registrar_year, latest_sme, latest_mainbord, faqs, status
        } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO registrar (
                name, image, meta_title, meta_desc, meta_keywords, slug,
                sme_ipo, mainboard_ipo, sme_ipo_parentage, mainboard_ipo_parentage,
                avgsubscription_sme, avgsubscription_mainboard, location, dic,
                registrar_year, latest_sme, latest_mainbord, faqs, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name, image, meta_title, meta_desc, meta_keywords, slug,
                sme_ipo, mainboard_ipo, sme_ipo_parentage, mainboard_ipo_parentage,
                avgsubscription_sme, avgsubscription_mainboard, location, dic,
                registrar_year, latest_sme, latest_mainbord, faqs, status || 'Active'
            ]
        );

        res.status(201).json({ id: result.insertId, message: 'Registrar created successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update registrar
router.put('/:id', async (req, res) => {
    try {
        const {
            name, image, meta_title, meta_desc, meta_keywords, slug,
            sme_ipo, mainboard_ipo, sme_ipo_parentage, mainboard_ipo_parentage,
            avgsubscription_sme, avgsubscription_mainboard, location, dic,
            registrar_year, latest_sme, latest_mainbord, faqs, status
        } = req.body;

        await pool.execute(
            `UPDATE registrar SET 
                name = ?, image = ?, meta_title = ?, meta_desc = ?, meta_keywords = ?, slug = ?,
                sme_ipo = ?, mainboard_ipo = ?, sme_ipo_parentage = ?, mainboard_ipo_parentage = ?,
                avgsubscription_sme = ?, avgsubscription_mainboard = ?, location = ?, dic = ?,
                registrar_year = ?, latest_sme = ?, latest_mainbord = ?, faqs = ?, status = ?,
                update_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
            [
                name, image, meta_title, meta_desc, meta_keywords, slug,
                sme_ipo, mainboard_ipo, sme_ipo_parentage, mainboard_ipo_parentage,
                avgsubscription_sme, avgsubscription_mainboard, location, dic,
                registrar_year, latest_sme, latest_mainbord, faqs, status,
                req.params.id
            ]
        );

        res.json({ message: 'Registrar updated successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE registrar
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM registrar WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Registrar not found' });
        res.json({ message: 'Registrar deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
