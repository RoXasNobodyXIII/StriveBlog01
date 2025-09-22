import jwt from 'jsonwebtoken';
import Author from '../models/Author.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        message: 'Access token required',
        error: 'No token provided'
      });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const user = await Author.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        message: 'Invalid token',
        error: 'User not found'
      });
    }

 
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired',
        error: 'Please login again'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token',
        error: 'Token verification failed'
      });
    }

    return res.status(500).json({
      message: 'Authentication error',
      error: error.message
    });
  }
};

export default authenticateToken;
