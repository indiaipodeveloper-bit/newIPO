import mysql from 'mysql2/promise';

async function run() {
  const db = await mysql.createConnection({host:'localhost',user:'root',password:'Ipo@1234',database:'newipo_db',port:3306});
  
  try {
    const [result] = await db.query(`
      UPDATE blog_slug b
      JOIN admin_blogs a ON b.new_slug = a.new_slug
      SET 
        b.content = COALESCE(a.content, b.content),
        b.image_url = COALESCE(a.image, b.image_url),
        b.title = COALESCE(a.title, b.title),
        b.excerpt = SUBSTRING(REGEXP_REPLACE(a.content, '<[^>]+>', ''), 1, 150)
    `);
    console.log('Migrated content from admin_blogs to blog_slug. Rows matched:', result.affectedRows);
  } catch (e) {
    console.log('Error migrating data:', e.message);
  }

  await db.end();
}

run();
