require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const mongoose = require("mongoose");

const Video = require("./models/Video.js").default || require("./models/Video.js");
const Notification = require("./models/Notification.js").default || require("./models/Notification.js");
const ReportCategory = require("./models/ReportCategory.js").default || require("./models/ReportCategory.js");
const ReportItem = require("./models/ReportItem.js").default || require("./models/ReportItem.js");
const MerchantBanker = require("./models/MerchantBanker.js").default || require("./models/MerchantBanker.js");
const Lead = require("./models/Lead.js").default || require("./models/Lead.js");
const KnowledgeCategory = require("./models/KnowledgeCategory.js").default || require("./models/KnowledgeCategory.js");
const KnowledgeItem = require("./models/KnowledgeItem.js").default || require("./models/KnowledgeItem.js");
const HeroBanner = require("./models/HeroBanner.js").default || require("./models/HeroBanner.js");

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const MONGO_URI = process.env.MONGO_URI;

if (!SUPABASE_URL || !SUPABASE_KEY || !MONGO_URI) {
    console.error("Missing environment variables!");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrate() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB Atlas!");

        // 1. Migrate Videos
        console.log("Migrating Videos...");
        const { data: videos } = await supabase.from("ipo_videos").select("*");
        if (videos && videos.length > 0) {
            await Video.deleteMany({});
            await Video.insertMany(videos.map(v => ({
                _id: v.id, // Keep Supabase IDs temporarily or generate new
                title: v.title,
                youtube_id: v.youtube_id,
                description: v.description,
                is_active: v.is_active,
                sort_order: v.sort_order,
                createdAt: v.created_at
            })));
            console.log(`Migrated ${videos.length} videos`);
        }

        // 2. Notifications
        console.log("Migrating Notifications...");
        const { data: notifications } = await supabase.from("notification_pdfs").select("*");
        if (notifications && notifications.length > 0) {
            await Notification.deleteMany({});
            await Notification.insertMany(notifications.map(n => ({
                title: n.title,
                slug: n.slug,
                pdf_url: n.pdf_url,
                description: n.description,
                is_active: n.is_active,
                sort_order: n.sort_order,
                createdAt: n.created_at
            })));
            console.log(`Migrated ${notifications.length} notifications`);
        }

        // 3. Hero Banners
        console.log("Migrating Banners...");
        const { data: banners } = await supabase.from("hero_banners").select("*");
        if (banners && banners.length > 0) {
            await HeroBanner.deleteMany({});
            await HeroBanner.insertMany(banners.map(b => ({
                title: b.title,
                subtitle: b.subtitle,
                image_url: b.image_url,
                cta_text: b.cta_text,
                cta_link: b.cta_link,
                is_active: b.is_active,
                sort_order: b.sort_order,
                createdAt: b.created_at
            })));
            console.log(`Migrated ${banners.length} banners`);
        }

        // 4. Leads
        console.log("Migrating Leads...");
        const { data: leads } = await supabase.from("leads").select("*");
        if (leads && leads.length > 0) {
            await Lead.deleteMany({});
            await Lead.insertMany(leads.map(l => ({
                name: l.name,
                email: l.email,
                phone: l.phone,
                company: l.company,
                message: l.message,
                is_read: l.is_read,
                createdAt: l.created_at
            })));
            console.log(`Migrated ${leads.length} leads`);
        }

        // 5. Merchant Bankers
        console.log("Migrating Merchant Bankers...");
        const { data: bankers } = await supabase.from("merchant_bankers").select("*");
        if (bankers && bankers.length > 0) {
            await MerchantBanker.deleteMany({});
            await MerchantBanker.insertMany(bankers.map(b => ({
                name: b.name,
                slug: b.slug,
                contact_person: b.contact_person,
                email: b.email,
                phone: b.phone,
                website: b.website,
                address: b.address,
                sebi_reg_no: b.sebi_reg_no,
                past_issues: b.past_issues,
                category: b.category,
                pdf_url: b.pdf_url,
                is_active: b.is_active,
                sort_order: b.sort_order,
                createdAt: b.created_at
            })));
            console.log(`Migrated ${bankers.length} bankers`);
        }

        // 6. Report Categories & Items
        console.log("Migrating Report Categories & Items...");
        const { data: reportCats } = await supabase.from("report_categories").select("*");
        if (reportCats && reportCats.length > 0) {
            await ReportCategory.deleteMany({});
            await ReportItem.deleteMany({});
            for (const rc of reportCats) {
                const newCat = new ReportCategory({
                    name: rc.name,
                    slug: rc.slug,
                    description: rc.description,
                    icon: rc.icon,
                    sort_order: rc.sort_order,
                    createdAt: rc.created_at
                });
                await newCat.save();

                const { data: reportItems } = await supabase.from("report_items").select("*").eq("category_id", rc.id);
                if (reportItems && reportItems.length > 0) {
                    await ReportItem.insertMany(reportItems.map(ri => ({
                        category_id: newCat._id,
                        title: ri.title,
                        logo_url: ri.logo_url,
                        last_updated: ri.last_updated,
                        status: ri.status,
                        status_color: ri.status_color,
                        estimated_amount: ri.estimated_amount,
                        exchange: ri.exchange,
                        sector: ri.sector,
                        description: ri.description,
                        drhp_link: ri.drhp_link,
                        is_active: ri.is_active,
                        sort_order: ri.sort_order,
                        createdAt: ri.created_at
                    })));
                }
            }
            console.log(`Migrated ${reportCats.length} report categories`);
        }

        // 7. Knowledge Categories & Items
        console.log("Migrating Knowledge Categories & Items...");
        const { data: knowCats } = await supabase.from("knowledge_categories").select("*");
        if (knowCats && knowCats.length > 0) {
            await KnowledgeCategory.deleteMany({});
            await KnowledgeItem.deleteMany({});
            for (const kc of knowCats) {
                const newCat = new KnowledgeCategory({
                    name: kc.name,
                    slug: kc.slug,
                    description: kc.description,
                    icon: kc.icon,
                    sort_order: kc.sort_order,
                    createdAt: kc.created_at
                });
                await newCat.save();

                const { data: knowItems } = await supabase.from("knowledge_items").select("*").eq("category_id", kc.id);
                if (knowItems && knowItems.length > 0) {
                    await KnowledgeItem.insertMany(knowItems.map(ki => ({
                        category_id: newCat._id,
                        title: ki.title,
                        subtitle: ki.subtitle,
                        col1: ki.col1,
                        col2: ki.col2,
                        col3: ki.col3,
                        col4: ki.col4,
                        col5: ki.col5,
                        col6: ki.col6,
                        link: ki.link,
                        location: ki.location,
                        sort_order: ki.sort_order,
                        is_active: ki.is_active,
                        createdAt: ki.created_at
                    })));
                }
            }
            console.log(`Migrated ${knowCats.length} knowledge categories`);
        }

        console.log("Migration completed successfully!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
}

migrate();
