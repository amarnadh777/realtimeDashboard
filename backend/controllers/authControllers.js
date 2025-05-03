const transporter = require("../config/mailer")
const User = require("../model/userModel")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const mailOptions =
    {
        from:process.env.MAIL_USER,
        to:email,
        subject:"OTP VERIFICATION",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hello 👋,</h2>
          <p>Your OTP code is:</p>
          <h1 style="background: #8fc63a; color: #fff; padding: 10px; display: inline-block;">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    const newUser = await User.create({
      email,
      password: hashedPassword,
      otp
    });

    return res
      .status(201)
      .json({ message: "User registered successfully!", user: {
        id:newUser._id,
        email:newUser.email,
        
        
      } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res
        .status(404)
        .json({ message: "User not found. Please sign up first." });
    }
  if (!userExist.otpVerified) {
      return res.status(403).json({ message: "Please verify your email via OTP before logging in." });
    }

    const isMatch = await bcrypt.compare(password, userExist.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: userExist._id }, "secert", {
        expiresIn: "7d",
      });
  

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: userExist._id,
        email: userExist.email,
      },
    });
  } catch (error) {}
};

const verifyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;
    console.log(email,otp)

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      if (user.otp != otp) {
        return res.status(400).json({ message: "Invalid OTP." });
      }

      user.otpVerified= true;
      user.otp = null;
      await user.save();
      const token = jwt.sign({
        id:user._id,email:user.email
      },'secret',{expiresIn:"7d"})



      res.status(200).json({
        message: "OTP verified successfully.",
        token,
        user: {
          id: user._id,
          email: user.email,
        }
      });
   
      
  } catch (error) {

    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error." })
  }
};

const fetchProfile = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = { signUp, login, verifyOtp, fetchProfile };
