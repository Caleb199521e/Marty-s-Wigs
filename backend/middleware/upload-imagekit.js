const multer = require('multer');
const ImageKit = require('imagekit');

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Use memory storage for ImageKit
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Upload to ImageKit
async function uploadToImageKit(file) {
  const result = await imagekit.upload({
    file: file.buffer,
    fileName: file.originalname,
    folder: '/martys-wigs'
  });
  return result.url;
}

module.exports = { upload, uploadToImageKit };
