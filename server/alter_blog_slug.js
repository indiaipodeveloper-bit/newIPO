import mysql from 'mysql2/promise';

async function run() {
  const db = await mysql.createConnection({host:'localhost',user:'root',password:'Ipo@1234',database:'newipo_db',port:3306});
  
  try {
    await db.query(`
      ALTER TABLE blog_slug 
      ADD COLUMN title VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      ADD COLUMN content LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
      ADD COLUMN excerpt TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
      ADD COLUMN image_url VARCHAR(500) DEFAULT NULL,
      ADD COLUMN category VARCHAR(100) DEFAULT '',
      ADD COLUMN status VARCHAR(50) DEFAULT 'published',
      ADD COLUMN author VARCHAR(255) DEFAULT 'Admin',
      ADD COLUMN tags VARCHAR(500) DEFAULT ''
    `);
    console.log('Columns added to blog_slug successfully.');
  } catch (e) {
    console.log('Error adding columns (maybe they already exist):', e.message);
  }

  try {
    await db.query(`UPDATE blog_slug SET title = meta_title WHERE title IS NULL OR title = ''`);
    console.log('Successfully set titles from meta_title');
  } catch (e) {
    console.log('Error updating titles:', e.message);
  }

  await db.end();
}

run();
