const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pawshome/stories',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const uploadStory = multer({ storage: storage });

module.exports = uploadStory;
