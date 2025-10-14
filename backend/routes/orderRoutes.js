import express from "express";
const router = express.Router();
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getMyOrders,
  getSellerOrders,
  raiseDispute,
} from "../controllers/orderController.js";
import { protect, buyer, seller } from "../middleware/authMiddleware.js";

router.route("/myorders").get(protect, getMyOrders);
router.route("/sellerorders").get(protect, getSellerOrders);

router.route("/").post(protect, buyer, createOrder);

router.route("/:id").get(protect, getOrderById);

router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, updateOrderToDelivered);
router.route("/:id/status").put(protect, updateOrderStatus);

router.route("/:id/dispute").put(protect, raiseDispute);

export default router;
