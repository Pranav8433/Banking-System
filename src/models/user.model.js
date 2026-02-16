import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: [true, "Email is already exists"],
      required: [true, "Email is required for creating a user"],
      trim: true,
      lowercase: true,
      match: [emailRegex, "Please enter a valid email address"],
    },
    name: {
      type: String,
      required: [true, "Name is required for creating an account"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required for creating an account"],
      minlength: [6, "Password should contain at least 6 characters"],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  return next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);

export default userModel;
