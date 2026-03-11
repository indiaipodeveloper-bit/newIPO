import pool from './db.js';

async function check() {
    try {
        const [rows] = await pool.query('SELECT id, title, slug, new_slug FROM admin_blogs LIMIT 5');
        console.log('Sample data:');
        console.table(rows);
        
        const [schema] = await pool.query('DESCRIBE admin_blogs');
        console.log('Schema:');
        console.table(schema);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
