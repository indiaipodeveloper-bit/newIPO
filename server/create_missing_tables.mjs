import pool from './db.js';

async function setup() {
    try {
        console.log('--- Creating Missing Tables ---');
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notification_pdfs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                pdf_url VARCHAR(512),
                link VARCHAR(512) DEFAULT NULL,
                description TEXT,
                is_active TINYINT(1) DEFAULT 1,
                sort_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ notification_pdfs created or exists');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS knowledge_categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                description TEXT,
                icon VARCHAR(100),
                sort_order INT DEFAULT 0,
                is_active TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ knowledge_categories created or exists');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS knowledge_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                subtitle VARCHAR(255),
                col1 TEXT,
                col2 TEXT,
                col3 TEXT,
                col4 TEXT,
                col5 TEXT,
                col6 TEXT,
                link VARCHAR(512),
                location VARCHAR(255),
                sort_order INT DEFAULT 0,
                is_active TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ knowledge_items created or exists');

        process.exit(0);
    } catch (err) {
        console.error('Setup Error:', err);
        process.exit(1);
    }
}

setup();
