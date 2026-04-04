import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pehle server/.env padho (priority zyada), phir root .env
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const router = express.Router();

// Ensure upload directories exist
const uploadEnvPath = process.env.UPLOADS_PATH || './uploads';
const uploadDir = path.resolve(__dirname, '..', uploadEnvPath);

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
        
        // Use path.relative to get the full relative path from uploadDir
        const relativePathFromUploads = path.relative(uploadDir, req.file.path).replace(/\\/g, '/');
        const relativePath = `uploads/${relativePathFromUploads}`;
        
        res.json({ url: relativePath });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
