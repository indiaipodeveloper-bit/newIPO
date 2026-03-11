import pool from './db.js';
import fs from 'fs';

async function check() {
    try {
        const [rows] = await pool.query("SELECT id, title, new_slug, slug FROM admin_blogs WHERE new_slug = ''");
        let output = 'Blogs with empty string new_slug:\n' + JSON.stringify(rows, null, 2) + '\n';
        
        fs.writeFileSync('db_empty_new_slug.json', output);
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('db_empty_new_slug_error.txt', err.stack);
        process.exit(1);
    }
}

check();
