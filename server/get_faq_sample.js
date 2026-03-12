import pool from './db.js';
import fs from 'fs';

async function run() {
  try {
    const [rows] = await pool.execute("SELECT * FROM registrar_faq LIMIT 1");
    fs.writeFileSync('faq_sample.json', JSON.stringify(rows, null, 2));
  } catch (err) {
    fs.writeFileSync('error_faq_sample.log', err.message);
  } finally {
    process.exit();
  }
}

run();
