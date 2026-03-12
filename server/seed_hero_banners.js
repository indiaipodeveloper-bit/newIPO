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
        const banners = [
            {
                title: "India's Leading IPO Consultancy Platform",
                subtitle: "Expert advisory for SME IPO, Mainline IPO, FPO, and Pre-IPO funding.",
                image_url: "/src/assets/hero-banner-1.jpg",
                badge_text: "SEBI Registered IPO Consultancy",
                cta_text: "Check IPO Feasibility",
                cta_link: "/ipo-feasibility",
                cta2_text: "Contact Us",
                cta2_link: "/contact",
                sort_order: 1,
                is_active: 1
            },
            {
                title: "SME IPO — Your Gateway to Growth",
                subtitle: "Get listed on BSE SME or NSE Emerge with our end-to-end IPO consultation services.",
                image_url: "/src/assets/hero-banner-2.jpg",
                badge_text: "Unlock Growth Potential",
                cta_text: "Explore Services",
                cta_link: "/services",
                cta2_text: "Contact Us",
                cta2_link: "/contact",
                sort_order: 2,
                is_active: 1
            },
            {
                title: "Trusted by 500+ Companies Nationwide",
                subtitle: "SEBI registered consultancy helping businesses raise capital through public markets.",
                image_url: "/src/assets/hero-banner-3.jpg",
                badge_text: "Proven Track Record",
                cta_text: "Contact Us",
                cta_link: "/contact",
                cta2_text: "Our Services",
                cta2_link: "/services",
                sort_order: 3,
                is_active: 1
            }
        ];

        for (const banner of banners) {
            await pool.execute(
                'INSERT INTO hero_banners (title, subtitle, image_url, cta_text, cta_link, badge_text, cta2_text, cta2_link, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [banner.title, banner.subtitle, banner.image_url, banner.cta_text, banner.cta_link, banner.badge_text, banner.cta2_text, banner.cta2_link, banner.sort_order, banner.is_active]
            );
        }
        
        console.log("Successfully seeded 3 default hero banners.");
    } catch (e) {
        console.error("Error seeding banners:", e);
    } finally {
        pool.end();
    }
}
run();
