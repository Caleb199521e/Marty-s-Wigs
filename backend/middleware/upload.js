const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const fs = require('fs');

// Configure Cloudinary - supports both URL format and individual variables
if (process.env.CLOUDINARY_URL) {
  // Use CLOUDINARY_URL if provided (simplest method)
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
  });
} else {
  // Fallback to individual environment variables
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  // Check if CLOUDINARY_URL is set
  if (process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.trim() !== '') {
    console.log('✅ Cloudinary configured successfully (using CLOUDINARY_URL)');
    return true;
  }
  
  // Check if individual variables are set
  const configured = !!(
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME.trim() !== '' &&
    process.env.CLOUDINARY_API_KEY.trim() !== '' &&
    process.env.CLOUDINARY_API_SECRET.trim() !== ''
  );
  
  if (configured) {
    console.log('✅ Cloudinary configured successfully');
    console.log('   Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('   API Key:', process.env.CLOUDINARY_API_KEY);
    console.log('   API Secret:', process.env.CLOUDINARY_API_SECRET.substring(0, 5) + '...');
  }
  
  return configured;
};

let storage;

if (isCloudinaryConfigured()) {
  console.log('✅ Cloudinary configured successfully');
  // Use Cloudinary storage if configured
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'martys-wigs',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    }
  });
} else {
  console.warn('⚠️  Cloudinary not configured. Using local storage. Add credentials to .env file.');
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Fallback to local storage if Cloudinary is not configured
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
}

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    console.log('File filter check:', file.originalname, file.mimetype);
    
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP)$/)) {
      return cb(new Error('Only image files are allowed (JPG, PNG, WEBP)'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;
