import pool from './db.js';
import fs from 'fs';

async function check() {
    try {
        const [rows] = await pool.query('SELECT id, title, slug, new_slug FROM admin_blogs WHERE new_slug IS NULL OR new_slug = "" OR slug IS NULL OR slug = ""');
        let output = 'Blogs with empty/null slugs:\n' + JSON.stringify(rows, null, 2) + '\n';
        
        fs.writeFileSync('db_slug_check.json', output);
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('db_slug_check_error.txt', err.stack);
        process.exit(1);
    }
}

check();
