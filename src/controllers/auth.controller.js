import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendRegistrationEmail } from "../services/email.service.js";

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
  });

  return token;
};

/**
 * @desc    Register user and send verification email
 * @route   POST /auth/register
 */
export async function registerController(req, res) {
  try {
    const { email, password, name } = req.body;

    const newUser = await userModel.create({
      email,
      name,
      password,
    });

    const token = generateTokenAndSetCookie(res, newUser._id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },  
      token,
    });

    await sendRegistrationEmail(newUser.email,newUser.name)
    
  } catch (error) {
    // Duplicate email error
    if (error.code === 11000) {
      return res.status(409).json({
        message: "User already exists. Please login.",
      });
    }

    res.status(500).json({
      message: "Server Error",
    });
  }
}

/**
 * @desc    Login user with email and password
 * @route   POST /auth/login
 * */
export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isValidPass = await user.comparePassword(password);

    if (!isValidPass) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      message: "User login successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
}
