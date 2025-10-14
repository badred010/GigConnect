import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ gig: 1, user: 1 }, { unique: true });

reviewSchema.statics.getAverageRating = async function (gigId) {
  const obj = await this.aggregate([
    {
      $match: { gig: gigId },
    },
    {
      $group: {
        _id: "$gig",
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Gig").findByIdAndUpdate(gigId, {
      averageRating: obj[0] ? obj[0].averageRating : 0,
      numOfReviews: obj[0] ? obj[0].numOfReviews : 0,
    });
  } catch (err) {
    console.error(err);
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.getAverageRating(this.gig);
});

reviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.constructor.getAverageRating(this.gig);
  }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
