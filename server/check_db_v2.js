import pool from './db.js';
import fs from 'fs';

async function check() {
    try {
        const [rows] = await pool.query('SELECT id, title, slug, new_slug FROM admin_blogs LIMIT 5');
        let output = 'Sample data:\n' + JSON.stringify(rows, null, 2) + '\n\n';
        
        const [schema] = await pool.query('DESCRIBE admin_blogs');
        output += 'Schema:\n' + JSON.stringify(schema, null, 2) + '\n';
        
        fs.writeFileSync('db_check_results.json', output);
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('db_check_error.txt', err.stack);
        process.exit(1);
    }
}

check();
