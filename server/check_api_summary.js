import pool from './db.js';
import fs from 'fs';

async function check() {
    try {
        const selectColumns = "id, title, COALESCE(new_slug, slug) as slug, image, category, upcoming, status, gmp_date, gmp_ipo_price, gmp, created_at";
        const [rows] = await pool.query(`SELECT ${selectColumns} FROM admin_blogs ORDER BY id DESC LIMIT 10`);
        let output = 'Summary API results (latest 10):\n' + JSON.stringify(rows, null, 2) + '\n';
        
        fs.writeFileSync('api_summary_check.json', output);
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('api_summary_check_error.txt', err.stack);
        process.exit(1);
    }
}

check();
