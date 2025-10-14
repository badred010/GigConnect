import Review from "../models/Review.js";
import Gig from "../models/Gig.js";

// @desc    Create a new review
// @route   POST /api/gigs/:id/reviews
// @access  Private/Buyer
const createGigReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { id: gigId } = req.params;

  if (req.user.role !== "buyer" && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only buyers or admins can leave reviews" });
  }

  if (!rating || !comment) {
    return res
      .status(400)
      .json({ message: "Please provide both rating and comment" });
  }

  try {
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    const alreadyReviewed = await Review.findOne({
      gig: gigId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this gig" });
    }

    const review = await Review.create({
      gig: gigId,
      user: req.user._id,
      rating,
      comment,
    });

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({
      message: "Server error while creating review",
      error: error.message,
    });
  }
};

// @desc    Get all reviews for a specific gig
// @route   GET /api/gigs/:id/reviews
// @access  Public
const getGigReviews = async (req, res) => {
  const { id: gigId } = req.params;

  try {
    const reviews = await Review.find({ gig: gigId }).populate(
      "user",
      "username profilePicture"
    );

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching reviews",
      error: error.message,
    });
  }
};

// @desc    Delete a review (Optional - for admin or reviewer)
// @route   DELETE /api/reviews/:id
// @access  Private/Buyer (who made the review) / Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    await Review.deleteOne({ _id: review._id });
    res.json({ message: "Review removed" });
  } catch (error) {
    res.status(500).json({
      message: "Server error while deleting review",
      error: error.message,
    });
  }
};

export { createGigReview, getGigReviews, deleteReview };
