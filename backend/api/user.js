const express = require ('express').Router
const User = require('../models/user')
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const IsAuth = require('../middleware/auth');

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
      logger.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const NewUser = new User({ username, email, password: hashedPassword });
      await NewUser.save();
      return res.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Login Route

router.post("/login", async(req, res)=>{
    try {
        const {email, password} = req.body
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
        return res.status(400).json({ message: "Invalid Credentials" });}
        
  // gnerating the jwt token
  const token = jwt.sign({id: existingUser._id, email: existingUser.email}, process.env.TOKEN_SECRET ,{expiresIn: "30d"})
  res.cookie("AniFlexToken", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'None',
      path:"/"
  })
  return res.status(200).json({
    id: existingUser._id,
    username: existingUser.username,
    email: email,
    message: "Logged In Succesfully"
   });
  
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    } catch (error) {
      return res.status(400).json(error)
    }
})
// logout Route
router.post('/logout', async(req,res)=>{
    try {
      res.clearCookie("AniflexToken", {
        httpOnly: true,
      });
      return res.status(200).json({message: "Logged Out Succesfully"})
    } catch (error) {
      return res.status(400).json(error)
    }
  })
