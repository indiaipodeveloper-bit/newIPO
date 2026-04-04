import pool from '../server/db.js';

async function listTables() {
    try {
        const [rows] = await pool.query('SHOW TABLES');
        const tables = rows.map(r => Object.values(r)[0]);
        console.log('ALL TABLES IN DB:');
        tables.forEach(t => console.log('- ' + t));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listTables();
