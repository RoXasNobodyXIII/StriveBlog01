import express from "express";
import {
  getComments,
  getComment,
  addComment,
  editComment,
  removeComment,
} from "../controllers/comments.js";
import authenticateToken from "../middlewares/auth.js";

const commentsRouter = express.Router();


commentsRouter.get("/blogPosts/:id/comments", getComments);
commentsRouter.get("/blogPosts/:id/comments/:commentId", getComment);


commentsRouter.post("/blogPosts/:id", authenticateToken, addComment);
commentsRouter.put("/blogPosts/:id/comments/:commentId", authenticateToken, editComment);
commentsRouter.delete("/blogPosts/:id/comment/:commentId", authenticateToken, removeComment);

export default commentsRouter;
