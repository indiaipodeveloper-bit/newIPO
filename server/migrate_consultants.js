import pool from './db.js';

async function migrate() {
  const conn = await pool.getConnection();
  try {
    console.log('Migrating consultants table...');
    
    // Add new columns if they don't exist
    const [cols] = await conn.execute("SHOW COLUMNS FROM consultants");
    const colNames = cols.map((c) => c.Field);

    if (!colNames.includes('experience_years')) {
      await conn.execute('ALTER TABLE consultants ADD COLUMN experience_years INT DEFAULT 0');
    }
    if (!colNames.includes('specialization')) {
      await conn.execute('ALTER TABLE consultants ADD COLUMN specialization VARCHAR(255)');
    }
    if (!colNames.includes('office_location')) {
      await conn.execute('ALTER TABLE consultants ADD COLUMN office_location VARCHAR(255)');
    }
    if (!colNames.includes('success_stories')) {
      await conn.execute('ALTER TABLE consultants ADD COLUMN success_stories TEXT');
    }
    if (!colNames.includes('tags')) {
      await conn.execute('ALTER TABLE consultants ADD COLUMN tags VARCHAR(500)');
    }

    console.log('✅ Migration successful!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

migrate();
