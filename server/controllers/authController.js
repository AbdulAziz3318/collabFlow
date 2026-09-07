const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      role = "Member",
    } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "Full name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      full_name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "Registration Successful",
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1d",
  }
);

    return res.status(200).json({
      message: "Login Successful",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(
      user.toJSON()
    );
  } catch (error) {
    console.error("Profile error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must contain at least 6 characters",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const samePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (samePassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Failed to reset password",
    });
  }
};
module.exports = {
  register,
  login,
  me,
  resetPassword,
};