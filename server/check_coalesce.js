import pool from './db.js';
import fs from 'fs';

async function check() {
    try {
        const [rows] = await pool.query("SELECT id, title, new_slug, slug, COALESCE(new_slug, slug) as co_slug FROM admin_blogs WHERE COALESCE(new_slug, slug) IS NULL LIMIT 10");
        let output = 'Blogs with NULL COALESCE slug:\n' + JSON.stringify(rows, null, 2) + '\n';
        
        fs.writeFileSync('db_null_coalesce_v2.json', output);
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('db_null_coalesce_v2_error.txt', err.stack);
        process.exit(1);
    }
}

check();
