import pool from './db.js';
import fs from 'fs';

async function check() {
    try {
        const [rows] = await pool.query("SELECT id, title, new_slug, slug FROM admin_blogs WHERE new_slug IS NULL OR slug IS NULL OR new_slug = 'null' OR slug = 'null'");
        let output = 'Blogs with NULL or "null" slugs:\n' + JSON.stringify(rows, null, 2) + '\n';
        
        fs.writeFileSync('db_null_check.json', output);
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('db_null_check_error.txt', err.stack);
        process.exit(1);
    }
}

check();
