import pool from './db.js';

async function test() {
    try {
        const [rows] = await pool.query('SELECT title, slug, content, ipo_description, ipo_details, faqs FROM admin_blogs WHERE title LIKE "%Paramesu%" OR slug LIKE "%paramesu%" LIMIT 1');
        console.log(JSON.stringify(rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

test();
