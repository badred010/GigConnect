import express from "express";
const router = express.Router();
import {
  getStripePublishableKey,
  createPaymentIntent,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

router.get("/stripe-key", getStripePublishableKey);

router.post("/create-payment-intent", protect, createPaymentIntent);

export default router;
