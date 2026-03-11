import pool from './db.js';
import fs from 'fs';

async function check() {
    try {
        // Mimic the exact query the API runs
        const page = 1;
        const limit = 12;
        const offset = (page - 1) * limit;
        const selectColumns = 'id, title, COALESCE(new_slug, slug) as slug, image, category, upcoming, status, gmp_date, gmp_ipo_price, gmp, created_at';
        
        const [rows] = await pool.query(
            `SELECT ${selectColumns} FROM admin_blogs ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        
        let output = 'Exact API response for page 1:\n' + JSON.stringify(rows, null, 2) + '\n';
        
        fs.writeFileSync('api_response_mimic.json', output);
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('api_response_mimic_error.txt', err.stack);
        process.exit(1);
    }
}

check();
