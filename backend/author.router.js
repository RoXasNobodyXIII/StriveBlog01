import express from "express";
import { getAll, get, add, edit, remove, addAvatar, upload } from "./controllers/authors.js";
import { getByAuthor } from "./controllers/blogPosts.js";
import authenticateToken from "./middlewares/auth.js";

const router = express.Router();

// Public routes no authentication required
router.get("/", getAll);
router.get("/:id", get);
router.get("/:id/blogPosts", getByAuthor);
router.post("/", add);
router.put("/:id", authenticateToken, edit);
router.delete("/:id", remove); // No authentication required for deletion
router.patch("/:id/avatar", authenticateToken, upload.single("avatar"), addAvatar);

export default router;
