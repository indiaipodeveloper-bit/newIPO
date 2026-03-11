import pool from './db.js';
import fs from 'fs';

async function check() {
    try {
        const [rows] = await pool.query("SELECT id, title, new_slug, slug FROM admin_blogs WHERE COALESCE(new_slug, slug) IS NULL");
        let output = 'Blogs with NO slug (after COALESCE):\n' + JSON.stringify(rows, null, 2) + '\n';
        
        fs.writeFileSync('db_no_final_slug.json', output);
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('db_no_final_slug_error.txt', err.stack);
        process.exit(1);
    }
}

check();
