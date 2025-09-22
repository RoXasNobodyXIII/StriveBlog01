import mongoose from "mongoose";
import BlogPost from "../models/BlogPost.js";

export async function getComments(request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "Invalid post ID" });
    }

    const blogPost = await BlogPost.findById(id).populate('comments.author', 'nome cognome email');
    if (!blogPost) {
      return response.status(404).json({ message: "Blog post not found" });
    }

    response.status(200).json({
      data: blogPost.comments,
      postId: id,
      total: blogPost.comments.length
    });
  } catch (error) {
    response.status(500).json({ message: "Error retrieving comments", error });
  }
}


export async function getComment(request, response) {
  try {
    const { id, commentId } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return response.status(404).json({ message: "Invalid ID" });
    }

    const blogPost = await BlogPost.findById(id).populate('comments.author', 'nome cognome email');
    if (!blogPost) {
      return response.status(404).json({ message: "Blog post not found" });
    }

    const comment = blogPost.comments.id(commentId);
    if (!comment) {
      return response.status(404).json({ message: "Comment not found" });
    }

    response.status(200).json(comment);
  } catch (error) {
    response.status(500).json({ message: "Error retrieving the comment", error });
  }
}


export async function addComment(request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "Invalid post ID" });
    }

    const { author, content } = request.body;

    if (!author || !content) {
      return response.status(400).json({
        message: "Missing required fields",
        requiredFields: ["author", "content"]
      });
    }


    const Author = (await import('../models/Author.js')).default;
    const foundAuthor = await Author.findById(author);
    if (!foundAuthor) {
      return response.status(400).json({
        message: "Author not found",
        details: `No author found with ID: ${author}`
      });
    }

    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return response.status(404).json({ message: "Blog post not found" });
    }


    blogPost.comments.push({ author, content });
    const savedBlogPost = await blogPost.save();


    await savedBlogPost.populate('comments.author', 'nome cognome email');

    const newComment = savedBlogPost.comments[savedBlogPost.comments.length - 1];

    response.status(201).json(newComment);
  } catch (error) {
    response.status(500).json({ message: "Error adding comment", error });
  }
}


export async function editComment(request, response) {
  try {
    const { id, commentId } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return response.status(404).json({ message: "Invalid ID" });
    }

    const { content } = request.body;
    if (!content) {
      return response.status(400).json({
        message: "Missing required field",
        requiredFields: ["content"]
      });
    }

    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return response.status(404).json({ message: "Blog post not found" });
    }

    const comment = blogPost.comments.id(commentId);
    if (!comment) {
      return response.status(404).json({ message: "Comment not found" });
    }

 
    comment.content = content;
    comment.updatedAt = new Date();

    const savedBlogPost = await blogPost.save();
    await savedBlogPost.populate('comments.author', 'nome cognome email');


    const updatedComment = savedBlogPost.comments.id(commentId);

    response.status(200).json(updatedComment);
  } catch (error) {
    response.status(500).json({ message: "Error updating comment", error });
  }
}


export async function removeComment(request, response) {
  try {
    const { id, commentId } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return response.status(404).json({ message: "Invalid ID" });
    }

    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return response.status(404).json({ message: "Blog post not found" });
    }

    const comment = blogPost.comments.id(commentId);
    if (!comment) {
      return response.status(404).json({ message: "Comment not found" });
    }


    blogPost.comments.pull(commentId);
    await blogPost.save();

    response.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    response.status(500).json({ message: "Error deleting comment", error });
  }
}
