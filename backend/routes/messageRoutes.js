import express from "express";
const router = express.Router();
import {
  sendMessage,
  getMessages,
  getConversations,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").post(protect, sendMessage);

router.route("/conversations").get(protect, getConversations);

router.route("/:otherUserId").get(protect, getMessages);

export default router;
