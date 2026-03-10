import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure upload directories exist
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = req.body.folder || 'misc';
        const dynamicDir = path.join(uploadDir, folder);
        if (!fs.existsSync(dynamicDir)) {
            fs.mkdirSync(dynamicDir, { recursive: true });
        }
        cb(null, dynamicDir);
    },
    filename: function (req, file, cb) {
        // Unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const folder = req.body.folder || 'misc';
        // Generate the URL that the frontend will use to access this file
        // Assumes Express is serving the `public` folder statically
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${folder}/${req.file.filename}`;
        res.json({ url: fileUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
