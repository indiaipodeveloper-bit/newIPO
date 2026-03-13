import pool from './db.js';

async function check() {
  try {
    const [rows] = await pool.execute('SELECT id, name, image_url FROM consultants');
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
