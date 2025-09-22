import express from 'express';
import passport from '../config/passport.js';
import { login, getMe } from '../controllers/auth.js';
import authenticateToken from '../middlewares/auth.js';

const authRouter = express.Router();
authRouter.post('/login', login);

// OAuth routes
authRouter.get('/google', (req, res, next) => {
  // Check Google OAuth credentials are available
  const hasGoogleCredentials = () => {
    return process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
  };

  if (!hasGoogleCredentials()) {
    return res.status(503).json({
      message: 'Google OAuth is not configured',
      error: 'Google OAuth credentials are missing. Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.'
    });
  }

  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

authRouter.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication generate JWT token
    const token = req.user.generateAuthToken();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/oauth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
      _id: req.user._id,
      nome: req.user.nome,
      cognome: req.user.cognome,
      email: req.user.email,
      avatar: req.user.avatar,

      isOAuthUser: req.user.isOAuthUser
    }))}`);
  }
);

// Logout
authRouter.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout error', error: err.message });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Get current user
authRouter.get('/me', authenticateToken, getMe);

export default authRouter;
