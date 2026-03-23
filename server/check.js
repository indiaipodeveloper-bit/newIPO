import pool from './db.js';
async function check() {
  const [rows] = await pool.query(
    'SELECT title, content, ipo_description, ipo_details, gmp_ipo_price, gmp FROM admin_blogs WHERE title LIKE "%Paramesu%" LIMIT 1'
  );
  console.log(JSON.stringify(rows[0], null, 2));
  process.exit(0);
}
check().catch(e => { console.error(e); process.exit(1); });
