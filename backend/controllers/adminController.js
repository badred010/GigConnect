import User from "../models/User.js";
import Gig from "../models/Gig.js";
import Order from "../models/Order.js";

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all gigs
// @route   GET /api/admin/gigs
// @access  Private/Admin
const getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({}).populate("seller", "username email");
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a gig by ID
// @route   DELETE /api/admin/gigs/:id
// @access  Private/Admin
const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (gig) {
      await gig.deleteOne();
      res.json({ message: "Gig removed" });
    } else {
      res.status(404).json({ message: "Gig not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all disputed orders
// @route   GET /api/admin/orders/disputed
// @access  Private/Admin
const getDisputedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: "Disputed" })
      .populate("buyer", "username email")
      .populate("seller", "username email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Resolve a disputed order
// @route   PUT /api/admin/orders/:id/resolve
// @access  Private/Admin
const resolveOrder = async (req, res) => {
  const { newStatus } = req.body; 
  if (newStatus !== "Completed" && newStatus !== "Cancelled") {
    return res.status(400).json({ message: "Invalid resolution status" });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.orderStatus = newStatus;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export {
  getAllUsers,
  deleteUser,
  getAllGigs,
  deleteGig,
  getDisputedOrders,
  resolveOrder,
};
