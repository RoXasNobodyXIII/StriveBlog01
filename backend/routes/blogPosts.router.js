import express from "express";
import {
  getAll,
  get,
  add,
  edit,
  remove,
  getByAuthor,
} from "../controllers/blogPosts.js";
import authenticateToken from "../middlewares/auth.js";

const blogPostsRouter = express.Router();


blogPostsRouter.get("/", getAll);
blogPostsRouter.get("/:id", get);
blogPostsRouter.get("/authors/:id/blogPosts", getByAuthor);


blogPostsRouter.post("/", authenticateToken, add);
blogPostsRouter.put("/:id", authenticateToken, edit);
blogPostsRouter.delete("/:id", authenticateToken, remove);

export default blogPostsRouter;
