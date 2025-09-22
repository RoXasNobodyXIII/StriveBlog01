import mongoose from "mongoose";
import Author from "../models/Author.js";
import BlogPost from "../models/BlogPost.js";
import upload from "../middlewares/uploadCloudinary.js";
import authenticateToken from "../middlewares/auth.js";

export { upload };

// Tutti gli autori 
export async function getAll(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { nome, cognome, showAll } = request.query;

 
    if (showAll === 'true') {
      const query = {};
      if (nome) {
        query.$or = query.$or || [];
        query.$or.push({ nome: new RegExp(nome, 'i') });
      }
      if (cognome) {
        query.$or = query.$or || [];
        query.$or.push({ cognome: new RegExp(cognome, 'i') });
      }

      const authors = await Author.find(query).skip(skip).limit(limit);
      const total = await Author.countDocuments(query);

      return response.status(200).json({
        authors,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAuthors: total,
      });
    }

    const pipeline = [
      {
        $lookup: {
          from: 'blogposts',
          localField: '_id',
          foreignField: 'author',
          as: 'posts'
        }
      },
      {
        $match: {
          'posts.0': { $exists: true } // Solo autori che hanno almeno un post
        }
      }
    ];

    if (nome || cognome) {
      const matchStage = { 'posts.0': { $exists: true } };
      if (nome) {
        matchStage.nome = new RegExp(nome, 'i');
      }
      if (cognome) {
        matchStage.cognome = new RegExp(cognome, 'i');
      }
      pipeline.push({ $match: matchStage });
    }

    // Aggiungi paginazione
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const authors = await Author.aggregate(pipeline);
    const totalPipeline = [
      {
        $lookup: {
          from: 'blogposts',
          localField: '_id',
          foreignField: 'author',
          as: 'posts'
        }
      },
      {
        $match: {
          'posts.0': { $exists: true }
        }
      }
    ];

    if (nome || cognome) {
      const matchStage = { 'posts.0': { $exists: true } };
      if (nome) {
        matchStage.nome = new RegExp(nome, 'i');
      }
      if (cognome) {
        matchStage.cognome = new RegExp(cognome, 'i');
      }
      totalPipeline.push({ $match: matchStage });
    }

    const totalResult = await Author.aggregate(totalPipeline);
    const total = totalResult.length;

    response.status(200).json({
      authors,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAuthors: total,
    });
  } catch (error) {
    response.status(500).json({ message: "Error retrieving authors", error });
  }
}

// Singolo autore tramite ID
export async function get(request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "Invalid ID" });
    }
    const author = await Author.findById(id);
    if (!author) {
      return response.status(404).json({ message: "Author not found" });
    }
    if (author.avatar === "") {
      author.avatar =
        "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";
    }
    response.status(200).json(author);
  } catch (error) {
    response.status(500).json({ message: "Error retrieving the author", error });
  }
}

// Add Autore
export async function add(request, response) {
  try {
    const { nome, cognome, email, avatar, password } = request.body;
    if (!nome || !cognome || !email || !password) {
      return response.status(400).json({
        message: "Missing required fields",
        requiredFields: ["nome", "cognome", "email", "password"]
      });
    }

    const authorData = {
      nome,
      cognome,
      email,
      avatar,
      password,
    };

    const newAuthor = new Author(authorData);

    // Salva
    const savedAuthor = await newAuthor.save();
    response.status(201).json({
      message: "User created successfully",
      user: savedAuthor
    });
  } catch (error) {
    if (error.code === 11000) {
      return response.status(400).json({ message: "Email already exists", error });
    }
    response.status(500).json({ message: "Error creating the author", error });
  }
}

// Add Avatar
export async function addAvatar(request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "Invalid ID" });
    }

    if (!request.file || !request.file.path) {
      return response.status(400).json({ message: "No file uploaded" });
    }

    const imgPath = request.file.path;

    const author = await Author.findByIdAndUpdate(
      id,
      { avatar: imgPath },
      { new: true }
    );
    if (!author) {
      return response.status(400).json({ message: "User not found" });
    }
    response.status(200).json(author);
  } catch (err) {
    response.status(500).json({ message: "Error modifying the author's image", err });
  }
}

// Edit Autore
export async function edit(request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "Invalid ID" });
    }

    const { nome, cognome, email, avatar } = request.body;
    if (!nome || !cognome || !email) {
      return response.status(400).json({ message: "Missing required field" });
    }

    const updateData = { nome, cognome, email, avatar };



    const updatedAuthor = await Author.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedAuthor) {
      return response.status(400).json({ message: "User not found" });
    }
    response.status(200).json(updatedAuthor);
  } catch (error) {
    response.status(500).json({ message: "Error modifying the author", error });
  }
}

// Delete Autore
export async function remove(request, response) {
  try {
    const { id } = request.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(404).json({ message: "Invalid ID" });
    }
    const toRemove = await Author.findByIdAndDelete(id);
    if (!toRemove) {
      return response.status(404).json({ message: "Author not found" });
    }
    response.status(200).json(toRemove);
  } catch (error) {
    response.status(500).json({ message: "Error deleting the author", error });
  }
}
