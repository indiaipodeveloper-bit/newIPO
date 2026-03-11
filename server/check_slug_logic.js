import pool from './db.js';
import fs from 'fs';

async function check() {
    try {
        const [rows] = await pool.query("SELECT id, title, new_slug, slug, COALESCE(new_slug, slug) as co_slug, COALESCE(NULLIF(new_slug, ''), slug) as fix_slug FROM admin_blogs");
        let output = 'Slug comparison:\n' + JSON.stringify(rows.slice(0, 50), null, 2) + '\n';
        
        // Find any where co_slug or fix_slug is null
        const nulls = rows.filter(r => r.co_slug === null || r.fix_slug === null || r.co_slug === '' || r.fix_slug === '');
        output += '\nRows with issues (null or empty result):\n' + JSON.stringify(nulls, null, 2) + '\n';

        fs.writeFileSync('db_slug_comparison.json', output);
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('db_slug_comparison_error.txt', err.stack);
        process.exit(1);
    }
}

check();
