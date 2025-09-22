import dotenv from "dotenv";
dotenv.config({ path: './.env' });
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import passport from "./config/passport.js";
import commentsRouter from "./routes/comments.router.js";
import authorRouter from "./author.router.js";
import blogPostRouter from "./routes/blogPosts.router.js";
import authRouter from "./routes/auth.router.js";
import authenticateToken from "./middlewares/auth.js";
import { v2 as cloudinary } from "cloudinary";
import uploadRouter from "./routes/upload.router.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { configureGoogleStrategy } from "./config/passport.js";
configureGoogleStrategy();

const app = express();

// Passport configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI || "mongodb+srv://M:ciao123@cluster0.uklt6qw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    app.listen(PORT, () => {
      // Server started 
    });
  })
  .catch((err) => {
    // MongoDB connection error
  });

// Cloudinary
cloudinary.config({
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
});

// Routes
app.use("/auth", authRouter);
app.use("/authors", authorRouter);
app.use("/blogPosts", blogPostRouter);
app.use("/", commentsRouter);
app.use("/upload", uploadRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "StriveBlog API Server",
    version: "1.0.0",
    status: "running",
    endpoints: {
      auth: "/auth",
      authors: "/authors",
      blogPosts: "/blogPosts",
      comments: "/",
      upload: "/upload"
    }
  });
});

export default app;
