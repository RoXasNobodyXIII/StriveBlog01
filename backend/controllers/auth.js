import Author from '../models/Author.js';

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
        requiredFields: ['email', 'password']
      });
    }

    // Errors
    const user = await Author.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
        error: 'User not found'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials',
        error: 'Incorrect password'
      });
    }

    // Generate token
    const token = user.generateAuthToken();

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        avatar: user.avatar,

      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Login error',
      error: error.message
    });
  }
};


export const getMe = async (req, res) => {
  try {
   
    res.status(200).json({
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving user data',
      error: error.message
    });
  }
};

export default { login, getMe };
