import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all daily digests with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [rows] = await pool.query(
            'SELECT * FROM daily_digests ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );

        const [countResult] = await pool.query('SELECT COUNT(*) as total FROM daily_digests');
        const total = countResult[0].total;

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
        console.error("Error fetching daily digests:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Get a single daily digest
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM daily_digests WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: "Daily digest not found" });
        }
        
        res.json(rows[0]);
    } catch (err) {
        console.error("Error fetching daily digest:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Create daily digest
router.post('/', async (req, res) => {
    try {
        const { title, image, pdf } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO daily_digests (title, image, pdf, created_at, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
            [title, image, pdf]
        );

        res.status(201).json({ id: result.insertId, message: "Daily digest created successfully" });
    } catch (err) {
        console.error("Error creating daily digest:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Update daily digest
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, image, pdf } = req.body;

        // Build dynamic query
        let query = 'UPDATE daily_digests SET updated_at = CURRENT_TIMESTAMP';
        const params = [];

        if (title !== undefined) {
            query += ', title = ?';
            params.push(title);
        }
        if (image !== undefined) {
            query += ', image = ?';
            params.push(image);
        }
        if (pdf !== undefined) {
            query += ', pdf = ?';
            params.push(pdf);
        }

        query += ' WHERE id = ?';
        params.push(id);

        const [result] = await pool.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Daily digest not found" });
        }

        res.json({ message: "Daily digest updated successfully" });
    } catch (err) {
        console.error("Error updating daily digest:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete daily digest
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM daily_digests WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Daily digest not found" });
        }

        res.json({ message: "Daily digest deleted successfully" });
    } catch (err) {
        console.error("Error deleting daily digest:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
