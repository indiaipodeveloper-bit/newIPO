import pool from './db.js';
import fs from 'fs';

async function check() {
    try {
        const [rows] = await pool.query("SELECT id, title, new_slug, slug, COALESCE(new_slug, slug) as final_slug FROM admin_blogs ORDER BY id DESC LIMIT 10");
        let output = 'Latest 10 blogs:\n' + JSON.stringify(rows, null, 2) + '\n';
        
        fs.writeFileSync('db_latest_blogs.json', output);
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('db_latest_blogs_error.txt', err.stack);
        process.exit(1);
    }
}

check();
