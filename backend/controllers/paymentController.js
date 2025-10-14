import Order from "../models/Order.js";
import Gig from "../models/Gig.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



// @desc    Get Stripe publishable key
// @route   GET /api/payments/stripe-key
// @access  Public
const getStripePublishableKey = (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
};

// @desc    Create a Stripe Payment Intent
// @route   POST /api/payments/create-payment-intent
// @access  Private (User must be logged in to create an intent for an order)
const createPaymentIntent = async (req, res) => {
  const { amount, currency = "usd", orderId, gigId, description } = req.body;

  let paymentAmount = amount;

  if (!paymentAmount && !gigId && !orderId) {
    return res
      .status(400)
      .json({ message: "Amount, gigId, or orderId is required." });
  }
  if (paymentAmount && paymentAmount < 50) {
    return res
      .status(400)
      .json({ message: "Amount must be at least 50 cents." });
  }

  try {
    if (!paymentAmount) {
      if (gigId) {
        const gig = await Gig.findById(gigId);
        if (!gig) {
          return res
            .status(404)
            .json({ message: "Gig not found to determine amount." });
        }
        paymentAmount = Math.round(gig.price * 100);
      } else if (orderId) {
        const order = await Order.findById(orderId);
        if (!order) {
          return res
            .status(404)
            .json({ message: "Order not found to determine amount." });
        }
        if (order.isPaid) {
          return res.status(400).json({ message: "Order is already paid." });
        }
        paymentAmount = Math.round(order.price * 100);
      }
    }

    if (!paymentAmount || paymentAmount < 50) {
      return res
        .status(400)
        .json({ message: "Invalid amount for payment intent." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentAmount,
      currency: currency,
      description:
        description ||
        `Payment for Order ${orderId || ""} / Gig ${gigId || ""}`,
      automatic_payment_methods: {
        enabled: true,
      },

      metadata: {
        orderId: orderId || "N/A",
        userId: req.user?._id?.toString() || "N/A",
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Stripe Payment Intent Error:", error);
    res.status(500).json({
      message: "Failed to create payment intent",
      error: error.message,
    });
  }
};

export { getStripePublishableKey, createPaymentIntent };
