const express = require('express')
const router = express.Router()
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const IsAuth = require('../middleware/auth');
const IsAdmin = require('../middleware/authtoken')
const multer = require('multer')

//sign-up route
router.post("/register", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is empty' });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (username.length < 6) {
      return res.status(400).json({ message: 'Username must be at least 6 characters' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    try {
      const existingEmail = await User.findOne({ email: email });
      const existingUsername = await User.findOne({ username: username });
      if (existingEmail || existingUsername) {
        return res.status(400).json({ message: "Username or Email Already Exists" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const NewUser = new User({ username, email, password: hashedPassword });
      await NewUser.save();
      return res.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    try {
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
      //compare the password
      const isValidPassword = await bcrypt.compare(password, existingUser.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      // generating the jwt token
      const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.TOKEN_SECRET, { expiresIn: "30d" })

      // Cookie settings for cross-site compatibility
      const cookieOptions = {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === "production", // Only HTTPS in production
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // 'none' for cross-site in production
        path: "/"
      };

      res.cookie("AniFlexToken", token, cookieOptions);

      return res.status(200).json({
        id: existingUser._id,
        username: existingUser.username,
        email: email,
        role: existingUser.role,
        message: "Logged In Succesfully"
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } catch (error) {
    return res.status(400).json(error)
  }
})
// logout
router.post('/logout', async (req, res) => {
  try {
    // Clear cookie with same settings as when it was set
    res.clearCookie("AniFlexToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
      path: "/"
    });
    return res.status(200).json({ message: "Logged Out Succesfully" })
  } catch (error) {
    return res.status(400).json(error)
  }
})
//check if cookie exists or not

router.get('/check-cookie', async (req, res) => {
  try {
    const token = req.cookies.AniFlexToken;
    if (token) {
      return res.status(200).json({ message: true })
    }
    return res.status(200).json({ message: false })
  } catch (error) {
    return res.status(400).json(error)
  }
})

//find all users
router.get('/users', async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    res.status(200).json({
      message: 'Users retrieved successfully',
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});
//user details
router.get('/user-details', IsAuth, async (req, res) => {
  try {
    const { email } = req.user;
    const existingUser = await User.findOne({ email: email }).select("-password");
    const role = req.user.role;
    return res.status(200).json({ user: existingUser });

  } catch (error) {
    return res.status(500).json({ error: error })
  }
})

//user delete

router.delete('/delete-user/:id', IsAuth, IsAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user to be deleted exists
    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    await User.findByIdAndDelete(id);

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error deleting user', details: error.message });
  }
});

module.exports = router;