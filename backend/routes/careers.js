// MBK: Careers application routes
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/careers');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Veuillez uploader un PDF ou un document Word.'));
    }
  }
});

// POST /api/careers/apply - Submit job application
router.post('/apply', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, linkedin, salary, location, frenchFluent, englishFluent } = req.body;
    const resumeFile = req.file;

    // Validation
    if (!name || !email || !resumeFile) {
      return res.status(400).json({
        success: false,
        message: 'Les champs nom, email et CV sont obligatoires'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
    }

    // TODO: Save to database (Prisma)
    // TODO: Send email notification to admin
    // TODO: Send confirmation email to candidate

    // For now, just log the application
    console.log('📧 New job application received:');
    console.log('  Name:', name);
    console.log('  Email:', email);
    console.log('  LinkedIn:', linkedin || 'N/A');
    console.log('  Salary:', salary || 'N/A');
    console.log('  Location:', location || 'N/A');
    console.log('  French Fluent:', frenchFluent || 'N/A');
    console.log('  English Fluent:', englishFluent || 'N/A');
    console.log('  Resume:', resumeFile.filename);

    res.json({
      success: true,
      message: 'Candidature reçue avec succès',
      data: {
        name,
        email,
        linkedin,
        salary,
        location,
        frenchFluent,
        englishFluent,
        resume: resumeFile.filename
      }
    });
  } catch (error) {
    console.error('❌ Error processing application:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors du traitement de la candidature'
    });
  }
});

export default router;
