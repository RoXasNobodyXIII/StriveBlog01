import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const uploadRouter = express.Router();

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_URL &&
         process.env.CLOUDINARY_URL !== 'cloudinary://<637382711175267>:<y-IPn-lJNHPwD2UjXVAeddpyjA4>@dkbahjqa6';
};

let storage;
let parser;

if (isCloudinaryConfigured()) {
  try {
    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "striveblog",
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
      },
    });
    parser = multer({ storage: storage });
  } catch (error) {
    console.error('Cloudinary configuration error:', error.message);
  }
} else {
  const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
    }
  });
  parser = multer({ storage: localStorage });
}

uploadRouter.post("/", parser.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let fileUrl;
    if (isCloudinaryConfigured() && req.file.path) {
      // Cloudinary URL
      fileUrl = req.file.path;
    } else {
      // Local file URL
      fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    }

    res.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: "Upload failed",
      details: error.message,
      cloudinaryConfigured: isCloudinaryConfigured()
    });
  }
});

export default uploadRouter;
