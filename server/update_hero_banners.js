import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'newipo_db',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function run() {
    try {
        await pool.execute('ALTER TABLE hero_banners ADD COLUMN badge_text VARCHAR(255)');
        await pool.execute('ALTER TABLE hero_banners ADD COLUMN cta2_text VARCHAR(255)');
        await pool.execute('ALTER TABLE hero_banners ADD COLUMN cta2_link VARCHAR(255)');
        console.log("Successfully added badge_text, cta2_text, and cta2_link to hero_banners.");
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log("Columns already exist.");
        } else {
            console.error(e);
        }
    } finally {
        pool.end();
    }
}
run();
