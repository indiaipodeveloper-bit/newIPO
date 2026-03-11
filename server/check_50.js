import pool from './db.js';
import fs from 'fs';

async function check() {
    try {
        const selectColumns = "id, title, COALESCE(new_slug, slug) as slug, image, category, upcoming, status, gmp_date, gmp_ipo_price, gmp, created_at";
        const [rows] = await pool.query(`SELECT ${selectColumns} FROM admin_blogs ORDER BY id DESC LIMIT 50`);
        
        let output = 'First 50 blogs summary:\n';
        rows.forEach((r, i) => {
            output += `${i+1}. ID: ${r.id}, Slug: ${r.slug}, Title: ${r.title}\n`;
        });
        
        fs.writeFileSync('db_summary_check_50.txt', output);
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('db_summary_check_50_error.txt', err.stack);
        process.exit(1);
    }
}

check();
