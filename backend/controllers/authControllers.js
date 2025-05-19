const User = require('../models/User'); // Import User model
const generateToken = require('../utils/generateToken'); // Import the token generation function
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Check if the user already exists by email or phone
const checkUser = async (req, res) => {
    const { email, phone } = req.body;
    
    try {
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  
      if (existingUser) {
        return res.status(200).json({ exists: true });
      } else {
        return res.status(200).json({ exists: false });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  
  // Register a new user
  const registerUser = async (req, res) => {
      const { name, email, password } = req.body;
      
      try {
          // Check if the user already exists
          const existingUser = await User.findOne({ email });
          if (existingUser) {
              return res.status(400).json({ message: 'User already exists' });
            }
            
            // Hash the password before saving it
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            // Create a new user with the hashed password
            const user = new User({
                name,
                email,
                password: hashedPassword,
            });
            
            // Save the new user to the database
            await user.save();
            
            // Send back a response with the user's info and a token
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id), // Generate JWT token for the user
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };
    
    // Login a user
    const loginUser = async (req, res) => {
        const { email, password } = req.body;
        
        try {
            const user = await User.findOne({ email });
            
            // Check if the user exists and if the password matches
            if (user && (await user.matchPassword(password))) {
                res.status(200).json({
                    _id: user._id,
                    email: user.email,
                    token: generateToken(user._id), // Generate JWT token for the user
                });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };
    
    // module.exports = {
    //     registerUser,
    //     loginUser,
    // };
    
    module.exports = {
      loginUser,
      registerUser,
      checkUser,
    };