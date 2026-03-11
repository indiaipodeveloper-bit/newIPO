import pool from './db.js';
import fs from 'fs';

async function check() {
    try {
        const slug = "theranautilus-1.2mn-seed-pi-ventures"; // One from my previous check
        const [rows] = await pool.query('SELECT *, COALESCE(new_slug, slug) as slug FROM admin_blogs WHERE new_slug = ? OR slug = ? LIMIT 1', [slug, slug]);
        
        let output = `Testing slug: ${slug}\n`;
        output += 'Result:\n' + JSON.stringify(rows[0] || "Not Found", null, 2) + '\n';
        
        fs.writeFileSync('db_slug_test.json', output);
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('db_slug_test_error.txt', err.stack);
        process.exit(1);
    }
}

check();
