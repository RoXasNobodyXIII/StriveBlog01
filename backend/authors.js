import express from "express";
import {
  getAll,
  add,
  get,
  edit,
  remove,
  addAvatar,
  upload,
} from "./controllers/authors.js";

const authorsRouter = express.Router();

authorsRouter.get("/", getAll);
authorsRouter.post("/", add);
authorsRouter.get("/:id", get);
authorsRouter.put("/:id", edit);
authorsRouter.patch("/:id/avatar", upload.single('avatar'), addAvatar);
authorsRouter.delete("/:id", remove);

export default authorsRouter;
