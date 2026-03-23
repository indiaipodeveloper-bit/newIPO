import pool from './db.js';

async function searchEverywhere() {
    try {
        const [tables] = await pool.execute('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);
        
        console.log(`Searching in ${tableNames.length} tables...`);
        
        for (const table of tableNames) {
            try {
                // Get columns first to see if it has 'content' or 'title'
                const [cols] = await pool.execute(`DESCRIBE ${table}`);
                const colNames = cols.map(c => c.Field);
                
                if (colNames.includes('title')) {
                    const [rows] = await pool.execute(`SELECT * FROM ${table} WHERE title LIKE '%Suryo Foods%'`);
                    if (rows.length > 0) {
                        console.log(`\nFound in table: ${table}`);
                        rows.forEach(r => {
                            console.log(`- ID: ${r.id || 'N/A'}`);
                            console.log(`- Title: ${r.title}`);
                            if (r.content) {
                                console.log(`- Content Length: ${r.content.length}`);
                                console.log(`- Content Snippet: ${r.content.substring(0, 100)}...`);
                            } else if (r.description) {
                                console.log(`- Description Length: ${r.description.length}`);
                            }
                        });
                    }
                }
            } catch (innerErr) {
                // Skip tables that don't fit the schema
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

searchEverywhere();
