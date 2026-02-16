import userModel from "../models/user.model.js";

/**
 * @desc    Register user and send verification email
 * @route   POST /auth/register
 */
export async function registerController(req, res) {
  const { email, password, name } = req.body;
  const isUserExists = await userModel.findOne({ email: email });

  if (isUserExists) {
    return res.status(422).json({
      message: "User already exists please login",
    });
  }
}
