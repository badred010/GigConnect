import Order from "../models/Order.js";
import Gig from "../models/Gig.js";
import User from "../models/User.js";
import { cloudinary } from "../config/cloudinaryConfig.js";

// @desc    Raise a dispute for an order
// @route   PUT /api/orders/:id/dispute
// @access  Private
const raiseDispute = async (req, res) => {
  try {
    const { reason, evidence } = req.body;

    if (!reason) {
      return res
        .status(400)
        .json({ message: "A reason for the dispute is required." });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const currentUserId = req.user._id.toString();
    if (
      order.buyer.toString() !== currentUserId &&
      order.seller.toString() !== currentUserId
    ) {
      return res.status(403).json({
        message: "You are not authorized to raise a dispute for this order.",
      });
    }

    const uploadedEvidence = [];
    if (evidence && evidence.length > 0) {
      for (const file of evidence) {
        try {
          const result = await cloudinary.uploader.upload(file, {
            folder: `fiverr-clone/disputes/${order._id}`,
            resource_type: "auto",
          });
          uploadedEvidence.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        } catch (uploadError) {
          console.error(
            "Cloudinary upload error for dispute evidence:",
            uploadError
          );
        }
      }
    }

    order.orderStatus = "Disputed";
    order.disputeReason = reason;
    order.disputeEvidence = uploadedEvidence;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error raising dispute:", error);
    res.status(500).json({ message: "Server error while raising dispute." });
  }
};

const createOrder = async (req, res) => {
  const { gigId, requirements, price, deliveryTime } = req.body;
  const buyerId = req.user._id;
  try {
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    if (gig.seller.toString() === buyerId.toString()) {
      return res
        .status(400)
        .json({ message: "Sellers cannot order their own gigs" });
    }
    const order = await Order.create({
      gig: gigId,
      buyer: buyerId,
      seller: gig.seller,
      price,
      deliveryTime,
      requirements,
      orderStatus: "Pending",
    });
    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      message: "Server error while creating order",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("gig", "title images")
      .populate("buyer", "username email profilePicture")
      .populate("seller", "username email profilePicture");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (
      order.buyer._id.toString() !== req.user._id.toString() &&
      order.seller._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching order",
      error: error.message,
    });
  }
};

const updateOrderToPaid = async (req, res) => {
  const { paymentId, status, paymentMethod, paymentIntentId } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      if (
        order.buyer.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          message: "Not authorized to update this order's payment status.",
        });
      }
      if (order.isPaid) {
        return res.status(400).json({ message: "Order is already paid." });
      }
      order.isPaid = true;
      order.paidAt = Date.now();
      order.orderStatus = "InProgress";
      order.paymentDetails = {
        paymentId: paymentId || paymentIntentId,
        status: status || "succeeded",
        paymentMethod: paymentMethod || "stripe",
        stripePaymentIntentId: paymentIntentId,
      };
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error updating order to paid:", error);
    res.status(500).json({
      message: "Server error while updating order to paid",
      error: error.message,
    });
  }
};

const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      if (
        order.seller.toString() !== req.user._id.toString() &&
        order.buyer.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to mark this order as delivered" });
      }
      if (
        order.orderStatus === "Delivered" ||
        order.orderStatus === "Completed"
      ) {
        return res
          .status(400)
          .json({ message: "Order is already delivered or completed." });
      }
      if (!order.isPaid) {
        return res
          .status(400)
          .json({ message: "Order must be paid before it can be delivered." });
      }
      order.orderStatus = "Delivered";
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error while updating order to delivered",
      error: error.message,
    });
  }
};

// @desc    Update order status (e.g., to Completed, Cancelled, Disputed by Buyer/Seller/Admin)
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentUserId = req.user._id.toString();
    const buyerId = order.buyer.toString();
    const sellerId = order.seller.toString();
    const isAdmin = req.user.role === "admin";
    let authorized = false;

    if (status === "Delivered") {
      if (
        (currentUserId === sellerId || currentUserId === buyerId || isAdmin) &&
        order.orderStatus === "InProgress" &&
        order.isPaid
      ) {
        authorized = true;
        order.deliveredAt = Date.now();
      }
    } else if (status === "Completed") {
      if (
        (currentUserId === buyerId || isAdmin) &&
        order.orderStatus === "Delivered"
      ) {
        authorized = true;
      }
    } else if (status === "Cancelled") {
      if (
        ((currentUserId === buyerId || currentUserId === sellerId) &&
          (order.orderStatus === "Pending" ||
            order.orderStatus === "InProgress")) ||
        isAdmin
      ) {
        authorized = true;
      }
    }

    if (!authorized) {
      return res.status(403).json({
        message: `Not authorized to change order status to ${status}`,
      });
    }

    order.orderStatus = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: `Server error while updating order status to ${status}`,
      error: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("gig", "title images price")
      .populate("seller", "username")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching user orders",
      error: error.message,
    });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    if (req.user.role !== "seller" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to view seller orders" });
    }
    const orders = await Order.find({ seller: req.user._id })
      .populate("gig", "title images price")
      .populate("buyer", "username email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching seller orders",
      error: error.message,
    });
  }
};

export {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getMyOrders,
  getSellerOrders,
  raiseDispute,
};
