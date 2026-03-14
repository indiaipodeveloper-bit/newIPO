import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

// Route imports
import videoRoutes from './routes/videos.js';
import notificationRoutes from './routes/notifications.js';
import reportRoutes from './routes/reports.js';
import bankerRoutes from './routes/bankers.js';
import leadRoutes from './routes/leads.js';
import uploadRoutes from './routes/upload.js';
import knowledgeRoutes from './routes/knowledge.js';
import bannerRoutes from './routes/banners.js';
import blogRoutes from './routes/blogs.js';
import newsRoutes from './routes/news.js';
import investorRoutes from './routes/investor.js';
import socialMediaRoutes from './routes/social_media.js';
import ipoFeasibilityRoutes from './routes/ipo_feasibility.js';
import csrRoutes from './routes/csr.js';
import mainboardBankerRoutes from './routes/mainboard_bankers.js';
import careerRoutes from './routes/careers.js';
import adminBlogsRoutes from './routes/admin_blogs.js';
import popupRoutes from './routes/popup.js';
import registrarRoutes from './routes/registrars.js';
import registrarFaqRoutes from './routes/registrarFaqs.js';
import dailyDigestRoutes from './routes/daily_digests.js';
import ipoListRoutes from './routes/ipo_lists.js';
import sectorRoutes from './routes/sectors.js';
import subscriptionRoutes from './routes/subscriptions.js';
import consultantRoutes from './routes/consultants.js';
import consultantEnquiryRoutes from './routes/consultant_enquiries.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Serve static files from the public directory (for uploaded images/PDFs)
// app.use(express.static(path.join(__dirname, '../public')));

// Explicitly serve uploads folder to ensure PDF access
app.use(
    "/uploads",
    express.static("/home/u521845907/domains/padmanutri.com/public_html/ipo/uploads")
);

// Initialize MySQL tables
async function initDB() {
    try {
        const conn = await pool.getConnection();
        console.log('✅ Connected to MySQL successfully');

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS hero_banners (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                subtitle TEXT,
                image_url VARCHAR(512) NOT NULL,
                cta_text VARCHAR(255),
                cta_link VARCHAR(512),
                sort_order INT DEFAULT 0,
                is_active TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS videos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                youtube_id VARCHAR(100) NOT NULL,
                description TEXT,
                is_active TINYINT(1) DEFAULT 1,
                sort_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await conn.execute(`
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

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS merchant_bankers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                location VARCHAR(255) DEFAULT '',
                sebi_registration VARCHAR(255) DEFAULT '',
                website VARCHAR(512) DEFAULT '',
                services TEXT,
                total_ipos INT DEFAULT 0,
                established_year INT DEFAULT NULL,
                description TEXT,
                logo_url VARCHAR(512) DEFAULT NULL,
                is_active TINYINT(1) DEFAULT 1,
                sort_order INT DEFAULT 0,
                total_raised DECIMAL(15,2) DEFAULT 0,
                avg_size DECIMAL(15,2) DEFAULT 0,
                avg_subscription DECIMAL(15,2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS leads (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20) DEFAULT '',
                company VARCHAR(255) DEFAULT '',
                message TEXT NOT NULL,
                is_read TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS report_categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                description TEXT,
                icon VARCHAR(100) DEFAULT 'FileText',
                is_active TINYINT(1) DEFAULT 1,
                sort_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS report_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                logo_url VARCHAR(512) DEFAULT NULL,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(100) DEFAULT 'Upcoming',
                status_color VARCHAR(50) DEFAULT 'blue',
                estimated_amount VARCHAR(255) DEFAULT '',
                exchange VARCHAR(100) DEFAULT '',
                sector VARCHAR(255) DEFAULT '',
                description TEXT,
                drhp_link VARCHAR(512) DEFAULT '',
                is_active TINYINT(1) DEFAULT 1,
                sort_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES report_categories(id) ON DELETE CASCADE
            )
        `);

        await conn.execute(`
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

        await conn.execute(`
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
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES knowledge_categories(id) ON DELETE CASCADE
            )
        `);

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS blogs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                excerpt TEXT,
                content LONGTEXT,
                category VARCHAR(100) DEFAULT '',
                status VARCHAR(50) DEFAULT 'draft',
                image_url VARCHAR(512) DEFAULT NULL,
                author VARCHAR(255) DEFAULT 'Admin',
                tags VARCHAR(500) DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS site_popup (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) DEFAULT '',
                description TEXT,
                image_url VARCHAR(512),
                button_text VARCHAR(100) DEFAULT 'Read More',
                button_link VARCHAR(512) DEFAULT '#',
                is_active TINYINT(1) DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                is_active TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS consultants (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                image_url VARCHAR(512),
                experience_years INT DEFAULT 0,
                specialization VARCHAR(255),
                office_location VARCHAR(255),
                success_stories TEXT,
                tags VARCHAR(500),
                is_active TINYINT(1) DEFAULT 1,
                sort_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS consultant_enquiries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                consultant_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20) DEFAULT '',
                organisation VARCHAR(255) DEFAULT '',
                message TEXT NOT NULL,
                is_read TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (consultant_id) REFERENCES consultants(id) ON DELETE CASCADE
            )
        `);

        // Check if a record exists, if not insert a default one
        const [popupRows] = await conn.execute('SELECT COUNT(*) as count FROM site_popup');
        if (popupRows[0].count === 0) {
            await conn.execute('INSERT INTO site_popup (title, description, image_url, button_text, button_link, is_active) VALUES (?, ?, ?, ?, ?, ?)',
                ['New Release', 'Check out our latest news!', null, 'Learn More', '#', 0]);
        }

        conn.release();
        console.log('✅ All MySQL tables initialized (including blogs)');
    } catch (err) {
        console.error('❌ MySQL initialization error:', err);
        process.exit(1);
    }
}

// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running with MySQL' });
});

// API Routes
app.use('/api/videos', videoRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/bankers', bankerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/investor', investorRoutes);
app.use('/api/social_media', socialMediaRoutes);
app.use('/api/ipo_feasibility', ipoFeasibilityRoutes);
app.use('/api/csr', csrRoutes);
app.use('/api/mainboard-bankers', mainboardBankerRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/admin-blogs', adminBlogsRoutes);
app.use('/api/popup', popupRoutes);
app.use('/api/registrars', registrarRoutes);
app.use('/api/registrar-faqs', registrarFaqRoutes);
app.use('/api/daily-digests', dailyDigestRoutes);
app.use('/api/ipo-lists', ipoListRoutes);
app.use('/api/sectors', sectorRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/consultants', consultantRoutes);
app.use('/api/consultant-enquiries', consultantEnquiryRoutes);


// Start server after DB init
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
});
