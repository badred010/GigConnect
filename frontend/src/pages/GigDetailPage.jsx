import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { User, Star, ShoppingCart, Mail, Edit, UserCircle } from "lucide-react";
import apiService from "../services/apiService";
import useAuthStore from "../store/authStore";
import Button from "../components/Button";
import Input from "../components/Input";
import LoadingSpinner from "../components/LoadingSpinner";

const GigDetailPage = ({ navigate, gigId }) => {
  const [gig, setGig] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const { userInfo, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!gigId) {
      toast.error("No Gig ID provided.");
      navigate("gigs");
      return;
    }
    const fetchGigAndReviews = async () => {
      try {
        setLoading(true);
        const gigData = await apiService.getGigById(gigId);
        setGig(gigData);
        const reviewsData = await apiService.getGigReviews(gigId);
        setReviews(reviewsData);
      } catch (error) {
        toast.error(error.message || "Could not fetch gig details.");
      } finally {
        setLoading(false);
      }
    };
    fetchGigAndReviews();
  }, [gigId, navigate]);

  const handleCreateOrder = () => {
    if (!isAuthenticated) {
      toast.error("Please login to create an order.");
      navigate("login", { from: `gigDetail`, fromId: gigId });
      return;
    }
    if (userInfo?.role === "seller" && gig?.seller?._id === userInfo?._id) {
      toast.error("You cannot order your own gig.");
      return;
    }
    if (!gig) {
      toast.error("Gig details not loaded yet.");
      return;
    }
    navigate("checkout", {
      gigId: gig._id,
      price: gig.price,
      deliveryTime: gig.deliveryTime,
      gigTitle: gig.title,
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (
      !isAuthenticated ||
      (userInfo?.role !== "buyer" && userInfo?.role !== "admin")
    ) {
      toast.error("Only logged-in buyers or admins can submit reviews.");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please enter a comment for your review.");
      return;
    }
    setIsReviewSubmitting(true);
    try {
      const newReviewData = await apiService.createReview(
        gigId,
        { rating: reviewRating, comment: reviewComment },
        userInfo.token
      );
      const addedReview = newReviewData.review || newReviewData;
      setReviews((prevReviews) => [addedReview, ...prevReviews]);
      toast.success("Review submitted successfully!");
      setReviewComment("");
      setReviewRating(5);
    } catch (error) {
      toast.error(error.message || "Failed to submit review.");
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  const handleMessageSeller = () => {
    if (!isAuthenticated) {
      toast.error("Please login to message the seller.");
      navigate("login", { from: `gigDetail`, fromId: gigId });
      return;
    }
    if (!gig || !gig.seller || userInfo?._id === gig.seller._id) {
      toast.error(
        gig?.seller && userInfo?._id === gig.seller._id
          ? "You cannot message yourself."
          : "Seller information is not available."
      );
      return;
    }
    navigate("chat", {
      otherUserId: gig.seller._id,
      otherUserName: gig.seller.username,
      otherUserProfilePicture: gig.seller.profilePicture,
    });
  };

  if (loading)
    return <LoadingSpinner message="Loading gig details..." size="lg" />;
  if (!gig)
    return (
      <p className="text-center text-red-500 text-xl py-10">
        Gig not found or failed to load.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-10">
        <div className="mb-8">
          <img
            src={
              gig.images && gig.images.length > 0
                ? gig.images[0].url
                : `https://placehold.co/800x500/A020F0/FFFFFF?text=${
                    gig.title.split(" ")[0]
                  }`
            }
            alt={gig.title}
            className="w-full h-auto max-h-[400px] sm:max-h-[500px] object-cover rounded-lg shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/800x500/cccccc/333333?text=Image+Error`;
            }}
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-4">
          {gig.title}
        </h1>

        <div className="flex flex-wrap items-center mb-6 text-sm text-gray-600 gap-x-4 gap-y-2">
          <div className="flex items-center">
            {gig.seller?.profilePicture ? (
              <img
                src={gig.seller.profilePicture}
                alt={gig.seller.username}
                className="w-6 h-6 rounded-full mr-2 object-cover"
              />
            ) : (
              <User className="w-5 h-5 mr-2 text-purple-500" />
            )}
            <span>
              Sold by:{" "}
              <strong
                className="text-purple-600 hover:underline cursor-pointer"
                onClick={() => {}}
              >
                {gig.seller?.username || "N/A"}
              </strong>
            </span>
          </div>
          <div className="flex items-center">
            <Star className="w-5 h-5 mr-1 text-yellow-400" />
            <span>
              {gig.averageRating > 0 ? gig.averageRating.toFixed(1) : "New"} (
              {gig.numOfReviews || 0} reviews)
            </span>
          </div>
        </div>

        <div className="prose prose-purple max-w-none mb-8 text-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Description
          </h2>
          <p>{gig.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-purple-50 p-4 rounded-lg shadow">
            <p className="text-sm text-purple-800 font-medium">Category</p>
            <p className="text-lg text-purple-600 font-semibold">
              {gig.category}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow">
            <p className="text-sm text-purple-800 font-medium">Delivery Time</p>
            <p className="text-lg text-purple-600 font-semibold">
              {gig.deliveryTime} day(s)
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-4xl font-bold text-purple-600">
              ${gig.price.toFixed(2)}
            </p>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                onClick={handleCreateOrder}
                variant="secondary"
                className="w-full sm:w-auto text-lg py-3 px-6"
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> Order Now
              </Button>
              {isAuthenticated &&
                gig.seller &&
                userInfo?._id !== gig.seller._id && (
                  <Button
                    onClick={handleMessageSeller}
                    variant="outline"
                    className="w-full sm:w-auto text-lg py-3 px-6"
                  >
                    <Mail className="w-5 h-5 mr-2" /> Message Seller
                  </Button>
                )}
            </div>
          </div>
        </div>

        {isAuthenticated && userInfo?._id === gig.seller?._id && (
          <div className="mb-10 text-center sm:text-left">
            <Button
              variant="primary"
              onClick={() => navigate("createGig", { gigId: gig._id })}
              className="w-full sm:w-auto py-2 px-4 text-sm"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Your Gig
            </Button>
          </div>
        )}

        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Reviews ({reviews.length})
          </h2>
          {isAuthenticated &&
            (userInfo?.role === "buyer" || userInfo?.role === "admin") && (
              <form
                onSubmit={handleReviewSubmit}
                className="mb-8 p-6 bg-gray-50 rounded-lg shadow"
              >
                <h3 className="text-xl font-medium text-purple-700 mb-3">
                  Leave a Review
                </h3>
                <div className="mb-4">
                  <label
                    htmlFor="rating"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Rating
                  </label>
                  <select
                    id="rating"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md shadow-sm"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {" "}
                        {r} Star{r > 1 ? "s" : ""}{" "}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Comment"
                  type="textarea"
                  name="comment"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="!mb-4"
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isReviewSubmitting}
                >
                  {isReviewSubmitting ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </form>
            )}

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-5 bg-white rounded-lg shadow-md border border-gray-200"
                >
                  <div className="flex items-center mb-3">
                    {review.user?.profilePicture ? (
                      <img
                        src={review.user.profilePicture}
                        alt={review.user.username}
                        className="w-8 h-8 rounded-full mr-3 object-cover"
                      />
                    ) : (
                      <UserCircle className="w-8 h-8 mr-3 text-gray-400" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {review.user?.username || "Anonymous"}
                      </p>

                      <div className="flex items-center">
                        {(() => {
                          const starElements = [];
                          for (let i = 0; i < 5; i++) {
                            starElements.push(
                              <Star
                                key={`star-${review._id}-${i}`}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            );
                          }
                          return starElements;
                        })()}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet for this gig.</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default GigDetailPage;
