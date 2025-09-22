import mongoose from "mongoose";
import BlogPost from "../models/BlogPost.js";


export async function getAll(request, response) {
  try {
    const { page = 1, limit = 10, title, author, category } = request.query;
    const query = {};
    if (title) {
      query.$or = query.$or || [];
      query.$or.push({ title: { $regex: title, $options: "i" } });
    }
    if (category) {
      query.$or = query.$or || [];
      query.$or.push({ category: { $regex: category, $options: "i" } });
    }
    if (author) {
      if (typeof author === 'string' && author.includes('@')) {
        const Author = (await import('../models/Author.js')).default;
        const foundAuthor = await Author.findOne({ email: author });
        if (foundAuthor) {
          query.author = foundAuthor._id;
        } else {
          query.author = null;
        }
      } else {
        query.author = author;
      }
    }

    const blogPosts = await BlogPost.find(query)
      .populate('author', 'nome cognome email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();

    const processedPosts = blogPosts.map(post => {
      const postObj = post.toObject();
      if (postObj.author && typeof postObj.author === 'object' && postObj.author._id && !postObj.author.nome) {
        postObj.author = null;
      } else if (!postObj.author) {
        postObj.author = null;
      }
      return postObj;
    });

    const total = await BlogPost.countDocuments(query);

    response.status(200).json({
      data: blogPosts,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    response.status(500).json({ message: "Error retrieving blog posts", error });
  }
}

// Singolo post tramite ID
export async function get(request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "Invalid ID" });
    }
    const blogPost = await BlogPost.findById(id).populate('author', 'nome cognome email');
    if (!blogPost) {
      return response.status(404).json({ message: "Blog post not found" });
    }

    // fail o autore mancante
    const postObj = blogPost.toObject();
    if (postObj.author && typeof postObj.author === 'object' && postObj.author._id && !postObj.author.nome) {
      postObj.author = null;
    } else if (!postObj.author) {
      postObj.author = null;
    }

    response.status(200).json(postObj);
  } catch (error) {
    response.status(500).json({ message: "Error retrieving the blog post", error });
  }
}

// Create Post
export async function add(request, response) {
  try {
    console.log('Received request body:', request.body);
    let { category, title, cover, readTime, author, content, unit } = request.body;
    console.log('Destructured fields:', { category, title, cover, readTime, author, content, unit });

    const missingFields = [];
    if (!category) missingFields.push('category');
    if (!title) missingFields.push('title');
    if (!readTime) missingFields.push('readTime');
    if (!author) missingFields.push('author');
    if (!content) missingFields.push('content');

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return response.status(400).json({ message: "Missing required field(s)", missingFields });
    }

    if (typeof readTime === 'string' || typeof readTime === 'number') {
      readTime = { value: Number(readTime), unit: unit || 'minuti' };
    }

    let authorId = author;
    if (typeof author === 'string') {
      if (author.includes('@')) {
        const Author = (await import('../models/Author.js')).default;

        const foundAuthor = await Author.findOne({ email: author });
        if (!foundAuthor) {
          return response.status(400).json({
            message: "Author not found",
            details: `No author found with email: ${author}`
          });
        }
        authorId = foundAuthor._id;
      } else {
        if (!mongoose.Types.ObjectId.isValid(author)) {
          return response.status(400).json({
            message: "Invalid author ID",
            details: `Invalid ObjectId: ${author}`
          });
        }
        authorId = new mongoose.Types.ObjectId(author);
      }
    }

    const newBlogPost = new BlogPost({
      category,
      title,
      cover,
      readTime,
      author: authorId,
      content,
    });

    const savedBlogPost = await newBlogPost.save();

    const populatedPost = await BlogPost.findById(savedBlogPost._id).populate('author', 'nome cognome email');

    response.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    response.status(500).json({ message: "Error creating the blog post", error: error.message });
  }
}

// Edit Post
export async function edit(request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "Invalid ID" });
    }
    const { category, title, cover, readTime, author, content } = request.body;
    if (!category || !title || !cover || !readTime || !author || !content) {
      return response.status(400).json({ message: "Missing required field(s)" });
    }
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      id,
      { category, title, cover, readTime, author, content },
      { new: true }
    );
    if (!updatedBlogPost) {
      return response.status(404).json({ message: "Blog post not found" });
    }
    response.status(200).json(updatedBlogPost);
  } catch (error) {
    response.status(500).json({ message: "Error updating the blog post", error });
  }
}

// Remove Post
export async function remove(request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "Invalid ID" });
    }
    const deletedBlogPost = await BlogPost.findByIdAndDelete(id);
    if (!deletedBlogPost) {
      return response.status(404).json({ message: "Blog post not found" });
    }
    response.status(200).json(deletedBlogPost);
  } catch (error) {
    response.status(500).json({ message: "Error deleting the blog post", error });
  }
}

// Post per Autore
export async function getByAuthor(request, response) {
  try {
    const { id } = request.params;

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "Invalid author ID" });
    }

    // Find autore ID
    const Author = (await import('../models/Author.js')).default;
    const author = await Author.findById(id);
    if (!author) {
      return response.status(404).json({ message: "Author not found" });
    }

    // Post tramite Autore ID
    const blogPosts = await BlogPost.find({ author: id })
      .populate('author', 'nome cognome email')
      .sort({ createdAt: -1 });


    const processedPosts = blogPosts.map(post => {
      const postObj = post.toObject();
      if (postObj.author && typeof postObj.author === 'object' && postObj.author._id && !postObj.author.nome) {
        postObj.author = null;
      } else if (!postObj.author) {
        postObj.author = null;
      }
      return postObj;
    });

    return response.status(200).json(processedPosts);
  } catch (error) {
    response.status(500).json({ message: "Error retrieving blog posts by author", error });
  }
}
