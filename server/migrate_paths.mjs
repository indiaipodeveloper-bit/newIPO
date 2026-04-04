import pool from './db.js';

async function migrate() {
    try {
        console.log('--- Starting Migration ---');

        // Fix daily_digests
        console.log('Fixing daily_digests table...');
        
        // Fix images: uploads/image/ -> uploads/dailydigest/image/
        const [imgRes] = await pool.query(`
            UPDATE daily_digests 
            SET image = REPLACE(image, 'uploads/image/', 'uploads/dailydigest/image/')
            WHERE image LIKE 'uploads/image/%'
        `);
        console.log(`Updated ${imgRes.affectedRows} images in daily_digests`);

        // Fix PDFs: uploads/pdf/ -> uploads/dailydigest/pdf/
        const [pdfRes] = await pool.query(`
            UPDATE daily_digests 
            SET pdf = REPLACE(pdf, 'uploads/pdf/', 'uploads/dailydigest/pdf/')
            WHERE pdf LIKE 'uploads/pdf/%'
        `);
        console.log(`Updated ${pdfRes.affectedRows} PDFs in daily_digests`);

        // Fix magzine table
        console.log('Fixing magzine table...');
        
        // Fix images: uploads/images/ -> uploads/magzine/images/
        const [magImgRes] = await pool.query(`
            UPDATE magzine 
            SET report_images = REPLACE(report_images, 'uploads/images/', 'uploads/magzine/images/')
            WHERE report_images LIKE 'uploads/images/%'
        `);
        console.log(`Updated ${magImgRes.affectedRows} images in magzine`);

        // Fix PDFs: uploads/pdf/ -> uploads/magzine/pdf/
        const [magPdfRes] = await pool.query(`
            UPDATE magzine 
            SET pdf = REPLACE(pdf, 'uploads/pdf/', 'uploads/magzine/pdf/')
            WHERE pdf LIKE 'uploads/pdf/%'
        `);
        console.log(`Updated ${magPdfRes.affectedRows} PDFs in magzine`);

        console.log('--- Migration Finished ---');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
