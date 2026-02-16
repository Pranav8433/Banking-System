import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
/**
 * @desc    Register user and send verification email
 * @route   POST /auth/register
 */
export async function registerController(req, res) {
  const { email, password, name } = req.body;
  const isUserExists = await userModel.findOne({ email: email });

  if (isUserExists) {
    return res.status(409).json({
      message: "User already exists please login",
    });
  }

  const newUser = await userModel.create({
    email,
    name,
    password,
  });

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token);

  res.status(201).json({
    message: "User Register Successfully",
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    },
    token: token,
  });
}

/**
 * @desc    Login user with email and password
 * @route   POST /auth/login
 * */
export async function loginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email: email }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Email not found",
    });
  }

  const isValidPass = await user.comparePassword(password);

  if (!isValidPass) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token);

  res.status(200).json({
    message: "User login successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: { token },
    },
  });
}
