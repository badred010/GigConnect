import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { cloudinary } from "../config/cloudinaryConfig.js";

//  generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    country,
    profilePicture: profilePictureBase64,
  } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    let uploadedProfilePictureUrl = "";
    if (profilePictureBase64) {
      try {
        const uploadResult = await cloudinary.uploader.upload(
          profilePictureBase64,
          {
            folder: "fiverr-clone/user_profiles",
            quality: "auto:good",
            fetch_format: "auto",
          }
        );
        uploadedProfilePictureUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
      }
    }

    const user = await User.create({
      username,
      email,
      password,
      role: role || "buyer",
      country,
      profilePicture: uploadedProfilePictureUrl,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        country: user.country,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        country: user.country,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ message: "Server error fetching profile." });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.description = req.body.description ?? user.description;
      user.country = req.body.country || user.country;

      if (req.body.profilePicture) {
        const uploadResult = await cloudinary.uploader.upload(
          req.body.profilePicture,
          {
            folder: "fiverr-clone/user_profiles",
            quality: "auto:good",
            fetch_format: "auto",
          }
        );
        user.profilePicture = uploadResult.secure_url;
      }

      if (req.body.password) {
        if (req.body.password.length < 6) {
          return res
            .status(400)
            .json({ message: "Password must be at least 6 characters" });
        }

        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture,
        description: updatedUser.description,
        country: updatedUser.country,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error while updating profile." });
  }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile };
