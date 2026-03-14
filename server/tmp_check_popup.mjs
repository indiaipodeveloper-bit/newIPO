import pool from './db.js';
try {
    const [rows] = await pool.query('SELECT * FROM site_popup');
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
} catch (err) {
    console.error(err);
    process.exit(1);
}
