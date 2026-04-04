import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Initialize table
const initTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS investor (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                mobile VARCHAR(50) NOT NULL,
                company VARCHAR(255),
                investment_amount VARCHAR(100),
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `;
        await pool.query(query);
        console.log("✅ 'investor' table read/created in MySQL");
    } catch (err) {
        console.error("❌ Error creating investor table:", err);
    }
};

initTable();

// Get all investor enquiries with pagination and search
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';

        let whereClause = '';
        let params = [];

        if (search) {
            whereClause = 'WHERE name LIKE ? OR email LIKE ? OR mobile LIKE ?';
            const searchPattern = `%${search}%`;
            params = [searchPattern, searchPattern, searchPattern];
        }

        const [countResult] = await pool.query(`SELECT COUNT(*) as total FROM investor ${whereClause}`, params);
        const total = countResult[0].total;

        // Add limit and offset to params
        const queryParams = [...params, limit, offset];
        const [rows] = await pool.query(
            `SELECT * FROM investor ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            queryParams
        );

        res.json({
            data: rows,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error("Error fetching investors:", err);
        res.status(500).json({ error: err.message });
    }
});

// Create a new investor enquiry
router.post('/', async (req, res) => {
    try {
        const { name, mobile, email, ticket_size, industry, roi, tenure, inv_type, buss_type, vintage, query } = req.body;
        
        if (!name || !email || !mobile) {
            return res.status(400).json({ error: "Name, email, and mobile are required" });
        }

        const [result] = await pool.query(
            'INSERT INTO investor (name, mobile, email, ticket_size, industry, roi, tenure, inv_type, buss_type, vintage, query) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, mobile, email, ticket_size, industry, roi, tenure, inv_type, buss_type, vintage, query]
        );

        res.status(201).json({ id: result.insertId, message: "Enquiry submitted successfully" });
    } catch (err) {
        console.error("Error creating investor enquiry:", err);
        res.status(500).json({ error: err.message });
    }
});

// Delete an enquiry
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM investor WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Enquiry not found" });
        }
        res.json({ message: "Enquiry deleted successfully" });
    } catch (err) {
        console.error("Error deleting enquiry:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
