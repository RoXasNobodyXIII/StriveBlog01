import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true, timestamps: false });

export default commentSchema;
