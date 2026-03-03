import mongoose from "mongoose";

// Define schema for Ledger collection
const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Account document
        ref: "account", // Links ledger to an account
        required: [true, "Ledger must be associated with an account"],
        index: true, // Improves lookup performance by account
        immutable: true // Prevents changes after creation
    },

    amount: {
        type: Number, // Transaction amount
        required: [true, "Amount is required for creating a ledger entry"],
        immutable: true // Amount cannot be changed once saved
    },

    transaction: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Transaction document
        ref: "transaction", // Links ledger to a transaction
        required: [true, "Ledger must be associated with a transaction"],
        index: true, // Improves query performance
        immutable: true // Cannot be modified later
    },

    type: {
        type: String, // Indicates debit or credit
        enum: {
            values: ["DEBIT", "CREDIT"], // Allowed ledger types
            message: "Ledger type can be either DEBIT or CREDIT"
        },
        required: [true, "Ledger type is required for creating a ledger entry"],
        immutable: true // Ledger type is fixed
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Middleware function to block updates or deletions
function preventLedgerModification() {
    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
}

// Prevent any update or delete operations on ledger documents
const blockedOperations = [
    "updateOne",
    "updateMany",
    "findOneAndUpdate",
    "deleteOne",
    "deleteMany",
    "findOneAndDelete",
    "findOneAndReplace",
    "findOneAndRemove",
    "findByIdAndDelete",
    "findByIdAndRemove",
    "remove"
];

blockedOperations.forEach((operation) => {
    ledgerSchema.pre(operation, preventLedgerModification);
});


// Create Ledger model (collection name will be "ledgers")
const ledgerModel = mongoose.model("ledger", ledgerSchema);

// Export model for use across the application
export default ledgerModel;