import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up storage engine
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'uploads/');
   },
   filename: function (req, file, cb) {
      cb(
         null,
         `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      );
   },
});

// Check file type
function checkFileType(file, cb) {
   // Allowed extensions
   const filetypes = /jpeg|jpg|png|gif/;
   // Check extension
   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
   // Check mime type
   const mimetype = filetypes.test(file.mimetype);

   if (mimetype && extname) {
      return cb(null, true);
   } else {
      cb('Error: Images Only!');
   }
}

// Initialize upload
const upload = multer({
   storage: storage,
   limits: { fileSize: 1000000 }, // 1MB
   fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
   },
});

export default upload;