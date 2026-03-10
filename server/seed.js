import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import mysql from 'mysql2/promise';

dotenv.config();

// ─── Supabase (source) ──────────────────────────────────────────────────────
const SUPABASE_URL = 'https://dhasphqnbjytsgfykmtz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoYXNwaHFuYmp5dHNnZnlrbXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MzAyNjMsImV4cCI6MjA4ODIwNjI2M30.-2lwTM9EsUdu6TtkbMvd4v4MJt8vLVD-onO1FsoEiaU';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── MySQL (destination) ────────────────────────────────────────────────────
const db = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'Ipo@1234',
    database: process.env.MYSQL_DATABASE || 'newipo_db',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
});

console.log('✅ Connected to MySQL');

async function seedTable(label, fetchFn, insertFn) {
    const data = await fetchFn();
    if (!data || data.length === 0) {
        console.log(`⚠️  No data found for ${label}`);
        return;
    }
    console.log(`📦 Seeding ${data.length} ${label}...`);
    for (const row of data) {
        try {
            await insertFn(row);
        } catch (e) {
            console.error(`  ❌ Error inserting ${label} row:`, e.message, row);
        }
    }
    console.log(`  ✅ ${label} done`);
}

// ─── 1. Hero Banners ────────────────────────────────────────────────────────
await seedTable('hero_banners',
    async () => { const { data } = await supabase.from('hero_banners').select('*'); return data; },
    async (b) => db.execute(
        `INSERT IGNORE INTO hero_banners (title, subtitle, image_url, cta_text, cta_link, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [b.title, b.subtitle || '', b.image_url, b.cta_text || '', b.cta_link || '', b.sort_order || 0, b.is_active === false ? 0 : 1]
    )
);

// ─── 2. Videos ──────────────────────────────────────────────────────────────
await seedTable('videos',
    async () => { const { data } = await supabase.from('ipo_videos').select('*'); return data; },
    async (v) => db.execute(
        `INSERT IGNORE INTO videos (title, youtube_id, description, is_active, sort_order) VALUES (?, ?, ?, ?, ?)`,
        [v.title, v.youtube_id, v.description || '', v.is_active === false ? 0 : 1, v.sort_order || 0]
    )
);

// ─── 3. Notification PDFs ───────────────────────────────────────────────────
await seedTable('notification_pdfs',
    async () => { const { data } = await supabase.from('notification_pdfs').select('*'); return data; },
    async (n) => db.execute(
        `INSERT IGNORE INTO notification_pdfs (title, slug, pdf_url, description, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
        [n.title, n.slug, n.pdf_url || null, n.description || '', n.is_active === false ? 0 : 1, n.sort_order || 0]
    )
);

// ─── 4. Leads ───────────────────────────────────────────────────────────────
await seedTable('leads',
    async () => { const { data } = await supabase.from('leads').select('*'); return data; },
    async (l) => db.execute(
        `INSERT INTO leads (name, email, phone, company, message, is_read) VALUES (?, ?, ?, ?, ?, ?)`,
        [l.name, l.email, l.phone || '', l.company || '', l.message, l.is_read ? 1 : 0]
    )
);

// ─── 5. Merchant Bankers ────────────────────────────────────────────────────
await seedTable('merchant_bankers',
    async () => { const { data } = await supabase.from('merchant_bankers').select('*'); return data; },
    async (b) => db.execute(
        `INSERT IGNORE INTO merchant_bankers 
        (name, category, location, sebi_registration, website, services, total_ipos, established_year, description, logo_url, is_active, sort_order, total_raised, avg_size, avg_subscription)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            b.name, b.category || 'mainboard',
            b.location || b.address || '',
            b.sebi_registration || b.sebi_reg_no || '',
            b.website || '', b.services || b.past_issues || '',
            b.total_ipos || 0, b.established_year || null,
            b.description || '', b.logo_url || null,
            b.is_active === false ? 0 : 1, b.sort_order || 0,
            b.total_raised || 0, b.avg_size || 0, b.avg_subscription || 0
        ]
    )
);

// ─── 6. Report Categories + Items ───────────────────────────────────────────
const { data: reportCats } = await supabase.from('report_categories').select('*');
if (reportCats && reportCats.length > 0) {
    console.log(`📦 Seeding ${reportCats.length} report_categories + their items...`);
    for (const rc of reportCats) {
        try {
            const [result] = await db.execute(
                `INSERT IGNORE INTO report_categories (name, slug, description, icon, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
                [rc.name, rc.slug, rc.description || '', rc.icon || 'FileText', rc.is_active === false ? 0 : 1, rc.sort_order || 0]
            );
            const newCatId = result.insertId || null;
            if (!newCatId) { console.log(`  ⚠️  Skipped category (duplicate slug?): ${rc.slug}`); continue; }

            const { data: items } = await supabase.from('report_items').select('*').eq('category_id', rc.id);
            if (items && items.length > 0) {
                for (const ri of items) {
                    await db.execute(
                        `INSERT INTO report_items (category_id, title, logo_url, status, status_color, estimated_amount, exchange, sector, description, drhp_link, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [newCatId, ri.title, ri.logo_url || null, ri.status || 'Upcoming', ri.status_color || 'blue',
                         ri.estimated_amount || '', ri.exchange || '', ri.sector || '',
                         ri.description || '', ri.drhp_link || '', ri.is_active === false ? 0 : 1, ri.sort_order || 0]
                    );
                }
            }
        } catch (e) {
            console.error(`  ❌ Error for report category ${rc.slug}:`, e.message);
        }
    }
    console.log('  ✅ report_categories + report_items done');
}

// ─── 7. Knowledge Categories + Items ────────────────────────────────────────
const { data: knowCats } = await supabase.from('knowledge_categories').select('*');
if (knowCats && knowCats.length > 0) {
    console.log(`📦 Seeding ${knowCats.length} knowledge_categories + their items...`);
    for (const kc of knowCats) {
        try {
            const [result] = await db.execute(
                `INSERT IGNORE INTO knowledge_categories (name, slug, description, icon, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)`,
                [kc.name, kc.slug, kc.description || '', kc.icon || '', kc.sort_order || 0, kc.is_active === false ? 0 : 1]
            );
            const newCatId = result.insertId || null;
            if (!newCatId) { console.log(`  ⚠️  Skipped category (duplicate slug?): ${kc.slug}`); continue; }

            const { data: items } = await supabase.from('knowledge_items').select('*').eq('category_id', kc.id);
            if (items && items.length > 0) {
                for (const ki of items) {
                    await db.execute(
                        `INSERT INTO knowledge_items (category_id, title, subtitle, col1, col2, col3, col4, col5, col6, link, location, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [newCatId, ki.title, ki.subtitle || null, ki.col1 || null, ki.col2 || null,
                         ki.col3 || null, ki.col4 || null, ki.col5 || null, ki.col6 || null,
                         ki.link || null, ki.location || null, ki.sort_order || 0, ki.is_active === false ? 0 : 1]
                    );
                }
            }
        } catch (e) {
            console.error(`  ❌ Error for knowledge category ${kc.slug}:`, e.message);
        }
    }
    console.log('  ✅ knowledge_categories + knowledge_items done');
}

await db.end();
console.log('\n🎉 All data seeded into MySQL successfully!');
