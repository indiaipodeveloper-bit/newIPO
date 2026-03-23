import pool from './db.js';

async function advancedClean() {
    try {
        console.log('🚀 Starting revised advanced database cleanup...');
        
        const [rows] = await pool.query('SELECT id, title, content, ipo_description, ipo_details, faqs FROM admin_blogs');
        
        for (const row of rows) {
            let updates = [];
            let values = [];

            // Helper to clean JSON stringified arrays
            const cleanJsonArray = (val) => {
                if (!val) return null;
                const s = String(val).trim();
                let arr = [];
                if (s.startsWith('[') && s.endsWith(']')) {
                    try {
                        const parsed = JSON.parse(s);
                        if (Array.isArray(parsed)) {
                            arr = parsed.filter(item => item !== null && item !== undefined && String(item).toLowerCase() !== 'null');
                        } else {
                            arr = [parsed];
                        }
                    } catch (e) {
                         arr = [s];
                    }
                } else {
                    arr = [s];
                }
                
                // Clean unicode and return valid JSON string
                const cleaned = arr.map(item => String(item).replace(/\\u20b9/g, '₹').replace(/\\u20b5/g, '₹').trim()).filter(i => i !== "");
                return cleaned.length > 0 ? JSON.stringify(cleaned) : JSON.stringify([]);
            };

            // 1. Clean ipo_description (must be JSON)
            const newDescJson = cleanJsonArray(row.ipo_description);
            if (newDescJson !== row.ipo_description) {
                updates.push('ipo_description = ?');
                values.push(newDescJson);
            }

            // 2. Clean ipo_details (must be JSON)
            const newDetailsJson = cleanJsonArray(row.ipo_details);
            if (newDetailsJson !== row.ipo_details) {
                updates.push('ipo_details = ?');
                values.push(newDetailsJson);
            }

            // 3. Fix content (NO JSON constraint)
            // If content is too short/empty, but we have data in description
            const descItems = JSON.parse(newDescJson || '[]');
            if ((!row.content || row.content.trim() === `<h1>${row.title}</h1>` || row.content.length < 50) && descItems.length > 0) {
                console.log(`  📝 Enhancing content for: ${row.title}`);
                const joinedDesc = descItems.join(' ');
                const suggestedContent = `<h1>${row.title}</h1>\n<p>${joinedDesc}</p>`;
                updates.push('content = ?');
                values.push(suggestedContent);
            }

            if (updates.length > 0) {
                values.push(row.id);
                try {
                    await pool.execute(`UPDATE admin_blogs SET ${updates.join(', ')} WHERE id = ?`, values);
                    console.log(`  ✅ Updated ID ${row.id}: ${row.title}`);
                } catch (err) {
                    console.error(`  ❌ Failed to update ID ${row.id}:`, err.message);
                }
            }
        }

        console.log('🎉 Advanced cleanup completed!');
    } catch (err) {
        console.error('❌ Error during script execution:', err);
    } finally {
        process.exit();
    }
}

advancedClean();
