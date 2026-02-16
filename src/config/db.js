import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
}
