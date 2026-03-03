import mongoose from "mongoose";

// Create a new schema for Account collection
const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Stores reference to User document ID
      ref: "user", // Refers to "user" collection
      required: [true, "Account must be associated with a user"], // User is mandatory
      index: true, // Creates index for faster queries by user
    },

    status: {
      type: String, // Account status stored as string
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"], // Only these values allowed
        message: "Status can be either ACTIVE FROZEN or CLOSED",
      },
      default: "ACTIVE", // Default status when account is created
    },

    currency: {
      type: String, // Currency type (e.g., INR, USD)
      required: [true, "Currency is required for creating an account"], // Mandatory field
      default: "INR", // Default currency
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

// Compound index for faster queries when filtering by user and status together
accountSchema.index({ user: 1, status: 1 });

// Create model from schema (collection name will be "accounts" in MongoDB)
const accountModel = mongoose.model("account", accountSchema);

// Export model to use in other files
export default accountModel;