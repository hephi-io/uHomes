import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: (error: unknown, isValid?: boolean) => void
) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'));
};

export const upload = multer({ storage, fileFilter });

// File filter for NIN documents (supports PDF, JPG, JPEG, PNG)
const ninDocumentFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: (error: unknown, isValid?: boolean) => void
) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG are allowed.'));
};

// Multer config for NIN documents with 5MB file size limit
export const uploadNINDocument = multer({
  storage,
  fileFilter: ninDocumentFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB in bytes
  },
});
