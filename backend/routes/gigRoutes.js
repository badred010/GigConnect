import express from "express";
const router = express.Router();
import {
  createGig,
  getGigs,
  getGigById,
  updateGig,
  deleteGig,
  getMyGigs,
} from "../controllers/gigController.js";
import { protect, seller, admin } from "../middleware/authMiddleware.js";

router.route("/mygigs").get(protect, seller, getMyGigs);

router.route("/").post(protect, seller, createGig).get(getGigs);

router
  .route("/:id")
  .get(getGigById)
  .put(protect, seller, updateGig)
  .delete(protect, seller, deleteGig);

export default router;
