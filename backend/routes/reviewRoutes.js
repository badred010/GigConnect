import express from "express";
const router = express.Router();
import {
  createGigReview,
  getGigReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, buyer, admin } from "../middleware/authMiddleware.js";

router
  .route("/:id/reviews")
  .post(protect, buyer, createGigReview)
  .get(getGigReviews);

router.route("/reviews/:id").delete(protect, deleteReview);

export default router;
