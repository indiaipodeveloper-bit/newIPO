import pool from './db.js';
import fs from 'fs';

async function run() {
  try {
    const [rows] = await pool.execute('SHOW TABLES');
    fs.writeFileSync('tables.json', JSON.stringify(rows, null, 2));
    
    // Check for registrar table specifically
    const [regRows] = await pool.execute("SHOW TABLES LIKE 'registrar%'");
    if (regRows.length > 0) {
        const tableName = Object.values(regRows[0])[0];
        const [desc] = await pool.execute(`DESCRIBE ${tableName}`);
        fs.writeFileSync('registrar_schema.json', JSON.stringify({tableName, schema: desc}, null, 2));
    }
  } catch (err) {
    fs.writeFileSync('error.log', err.message);
  } finally {
    process.exit();
  }
}

run();
