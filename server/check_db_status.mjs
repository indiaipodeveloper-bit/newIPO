import pool from './db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function check() {
    try {
        const [tables] = await pool.query('SHOW TABLES');
        console.log('--- ALL TABLES ---');
        for (let row of tables) {
            const tableName = Object.values(row)[0];
            const [count] = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
            console.log(`${tableName}: ${count[0].count} rows`);
        }
        
        console.log('\n--- Checking merchant_bankers schema ---');
        try {
            const [columns] = await pool.query('DESCRIBE merchant_bankers');
            console.log('merchant_bankers columns:', columns.map(c => c.Field));
        } catch(e) { console.log('merchant_bankers table error or not found'); }
        
        console.log('\n--- Checking bankers schema ---');
        try {
            const [columns] = await pool.query('DESCRIBE bankers');
            console.log('bankers columns:', columns.map(c => c.Field));
        } catch(e) { console.log('bankers table error or not found'); }

        process.exit(0);
    } catch (err) {
        console.error('Check Error:', err);
        process.exit(1);
    }
}

check();
