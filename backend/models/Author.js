import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authorSchema = new Schema({
  nome: { type: String, required: true, trim: true },
  cognome: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true, 
    minlength: 6,
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },

  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/dm9gnud6j/image/upload/v1757097390/noimg_tl6gzb.jpg",
  },
  isOAuthUser: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
});


authorSchema.pre('save', async function(next) {
  if (!this.password || !this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


authorSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


authorSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      nome: this.nome,
      cognome: this.cognome
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  return token;
};


authorSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};


const Author = mongoose.model("Author", authorSchema);

export default Author;
