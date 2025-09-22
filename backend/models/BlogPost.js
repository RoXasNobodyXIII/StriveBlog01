import mongoose, { Schema } from "mongoose";
import commentSchema from "./Comment.js";

const readTimeSchema = new Schema({
  value: { type: Number, required: true },
  unit: { type: String, required: true },
}, { _id: false });

const blogPostSchema = new Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  cover: { type: String, required: false },
  readTime: { type: readTimeSchema, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  content: { type: String, required: true },
  comments: [commentSchema]
}, { timestamps: true });

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

export default BlogPost;
