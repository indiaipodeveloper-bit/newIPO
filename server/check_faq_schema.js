import pool from './db.js';
import fs from 'fs';

async function run() {
  try {
    const [rows] = await pool.execute("SHOW TABLES LIKE 'registrar_faq%'");
    if (rows.length > 0) {
        const tableName = Object.values(rows[0])[0];
        const [desc] = await pool.execute(`DESCRIBE ${tableName}`);
        fs.writeFileSync('registrar_faq_schema.json', JSON.stringify({tableName, schema: desc}, null, 2));
    } else {
        fs.writeFileSync('registrar_faq_schema.json', JSON.stringify({error: 'Table not found'}, null, 2));
    }
  } catch (err) {
    fs.writeFileSync('error_faq.log', err.message);
  } finally {
    process.exit();
  }
}

run();
