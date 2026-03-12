import pool from './db.js';

async function checkTable() {
  try {
    const [rows] = await pool.execute("SHOW TABLES");
    console.log('All tables:', JSON.stringify(rows.map(r => Object.values(r)[0])));
    
    const [regTables] = await pool.execute("SHOW TABLES LIKE 'registrar%'");
    if (regTables.length === 0) {
        console.log('No registrar table found.');
        return;
    }
    
    for (const row of regTables) {
      const tableName = Object.values(row)[0];
      const [desc] = await pool.execute(`DESCRIBE ${tableName}`);
      console.log(`Schema for ${tableName}:`, JSON.stringify(desc, null, 2));
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

checkTable();
