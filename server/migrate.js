import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";
import mongoose from "mongoose";

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

        const db = mongoose.connection.db;

        // 1. Migrate Videos
        console.log("Migrating Videos...");
        const { data: videos } = await supabase.from("ipo_videos").select("*");
        if (videos && videos.length > 0) {
            await db.collection("videos").deleteMany({});
            await db.collection("videos").insertMany(videos.map(v => ({
                title: v.title,
                youtube_id: v.youtube_id,
                description: v.description,
                is_active: v.is_active,
                sort_order: v.sort_order,
                createdAt: v.created_at ? new Date(v.created_at) : new Date(),
                updatedAt: v.created_at ? new Date(v.created_at) : new Date()
            })));
            console.log(`Migrated ${videos.length} videos`);
        }

        // 2. Notifications
        console.log("Migrating Notifications...");
        const { data: notifications } = await supabase.from("notification_pdfs").select("*");
        if (notifications && notifications.length > 0) {
            await db.collection("notificationpdfs").deleteMany({}); // Note Mongoose standardizes model NotificationPdf to notificationpdfs
            await db.collection("notificationpdfs").insertMany(notifications.map(n => ({
                title: n.title,
                slug: n.slug,
                pdf_url: n.pdf_url,
                description: n.description,
                is_active: n.is_active,
                sort_order: n.sort_order,
                createdAt: n.created_at ? new Date(n.created_at) : new Date(),
                updatedAt: n.created_at ? new Date(n.created_at) : new Date()
            })));
            console.log(`Migrated ${notifications.length} notifications`);
        }

        // 3. Hero Banners
        console.log("Migrating Banners...");
        const { data: banners } = await supabase.from("hero_banners").select("*");
        if (banners && banners.length > 0) {
            await db.collection("herobanners").deleteMany({});
            await db.collection("herobanners").insertMany(banners.map(b => ({
                title: b.title,
                subtitle: b.subtitle,
                image_url: b.image_url,
                cta_text: b.cta_text,
                cta_link: b.cta_link,
                is_active: b.is_active,
                sort_order: b.sort_order,
                createdAt: b.created_at ? new Date(b.created_at) : new Date(),
                updatedAt: b.created_at ? new Date(b.created_at) : new Date()
            })));
            console.log(`Migrated ${banners.length} banners`);
        }

        // 4. Leads
        console.log("Migrating Leads...");
        const { data: leads } = await supabase.from("leads").select("*");
        if (leads && leads.length > 0) {
            await db.collection("leads").deleteMany({});
            await db.collection("leads").insertMany(leads.map(l => ({
                name: l.name,
                email: l.email,
                phone: l.phone,
                company: l.company,
                message: l.message,
                is_read: l.is_read,
                createdAt: l.created_at ? new Date(l.created_at) : new Date(),
                updatedAt: l.created_at ? new Date(l.created_at) : new Date()
            })));
            console.log(`Migrated ${leads.length} leads`);
        }

        // 5. Merchant Bankers
        console.log("Migrating Merchant Bankers...");
        const { data: bankers } = await supabase.from("merchant_bankers").select("*");
        if (bankers && bankers.length > 0) {
            await db.collection("merchantbankers").deleteMany({});
            await db.collection("merchantbankers").insertMany(bankers.map(b => ({
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
                createdAt: b.created_at ? new Date(b.created_at) : new Date(),
                updatedAt: b.created_at ? new Date(b.created_at) : new Date()
            })));
            console.log(`Migrated ${bankers.length} bankers`);
        }

        // 6. Report Categories & Items
        console.log("Migrating Report Categories & Items...");
        const { data: reportCats } = await supabase.from("report_categories").select("*");
        if (reportCats && reportCats.length > 0) {
            await db.collection("reportcategories").deleteMany({});
            await db.collection("reportitems").deleteMany({});
            for (const rc of reportCats) {
                const result = await db.collection("reportcategories").insertOne({
                    name: rc.name,
                    slug: rc.slug,
                    description: rc.description,
                    icon: rc.icon,
                    sort_order: rc.sort_order,
                    createdAt: rc.created_at ? new Date(rc.created_at) : new Date(),
                    updatedAt: rc.created_at ? new Date(rc.created_at) : new Date()
                });

                const { data: reportItems } = await supabase.from("report_items").select("*").eq("category_id", rc.id);
                if (reportItems && reportItems.length > 0) {
                    await db.collection("reportitems").insertMany(reportItems.map(ri => ({
                        category_id: result.insertedId,
                        title: ri.title,
                        logo_url: ri.logo_url,
                        last_updated: ri.last_updated ? new Date(ri.last_updated) : new Date(),
                        status: ri.status,
                        status_color: ri.status_color,
                        estimated_amount: ri.estimated_amount,
                        exchange: ri.exchange,
                        sector: ri.sector,
                        description: ri.description,
                        drhp_link: ri.drhp_link,
                        is_active: ri.is_active,
                        sort_order: ri.sort_order,
                        createdAt: ri.created_at ? new Date(ri.created_at) : new Date(),
                        updatedAt: ri.created_at ? new Date(ri.created_at) : new Date()
                    })));
                }
            }
            console.log(`Migrated ${reportCats.length} report categories`);
        }

        // 7. Knowledge Categories & Items
        console.log("Migrating Knowledge Categories & Items...");
        const { data: knowCats } = await supabase.from("knowledge_categories").select("*");
        if (knowCats && knowCats.length > 0) {
            await db.collection("knowledgecategories").deleteMany({});
            await db.collection("knowledgeitems").deleteMany({});
            for (const kc of knowCats) {
                const result = await db.collection("knowledgecategories").insertOne({
                    name: kc.name,
                    slug: kc.slug,
                    description: kc.description,
                    icon: kc.icon,
                    sort_order: kc.sort_order,
                    createdAt: kc.created_at ? new Date(kc.created_at) : new Date(),
                    updatedAt: kc.created_at ? new Date(kc.created_at) : new Date()
                });

                const { data: knowItems } = await supabase.from("knowledge_items").select("*").eq("category_id", kc.id);
                if (knowItems && knowItems.length > 0) {
                    await db.collection("knowledgeitems").insertMany(knowItems.map(ki => ({
                        category_id: result.insertedId,
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
                        createdAt: ki.created_at ? new Date(ki.created_at) : new Date(),
                        updatedAt: ki.created_at ? new Date(ki.created_at) : new Date()
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
