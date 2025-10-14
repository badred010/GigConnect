import express from "express";
import {
  getAllUsers,
  deleteUser,
  getAllGigs,
  deleteGig,
  getDisputedOrders,
  resolveOrder,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, admin);

router.route("/users").get(getAllUsers);
router.route("/users/:id").delete(deleteUser);

router.route("/gigs").get(getAllGigs);
router.route("/gigs/:id").delete(deleteGig);

router.route("/orders/disputed").get(getDisputedOrders);
router.route("/orders/:id/resolve").put(resolveOrder);

export default router;
