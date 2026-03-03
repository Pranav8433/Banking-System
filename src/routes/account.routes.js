import express from "express";
import createAccountController from "../controllers/account.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

/**
 *  @route - POST/api/account
 */
router.post("/", authMiddleware, createAccountController);

export default router;
