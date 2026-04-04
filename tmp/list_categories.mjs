import pool from '../server/db.js';

async function listCategories() {
    try {
        const [rows] = await pool.query('SELECT * FROM knowledge_categories');
        console.log('Knowledge Categories:', rows);
        
        const [items] = await pool.query('SELECT * FROM knowledge_items LIMIT 5');
        console.log('Knowledge Items (Sample):', items);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listCategories();
