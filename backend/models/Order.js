import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Gig",
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    price: {
      type: Number,
      required: true,
    },
    paymentDetails: {
      paymentId: { type: String },
      status: { type: String },
      paymentMethod: { type: String },
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "InProgress",
        "Delivered",
        "Completed",
        "Cancelled",
        "Disputed",
      ],
      default: "Pending",
    },
    deliveryTime: {
      type: Number,
      required: true,
    },
    deliveredAt: {
      type: Date,
    },
    requirements: {
      type: String,
      maxlength: 2000,
    },
    disputeReason: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    disputeEvidence: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
