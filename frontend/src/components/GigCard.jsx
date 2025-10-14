import { Star } from "lucide-react";

const GigCard = ({ gig, navigate }) => {
  const sellerUsername = gig?.seller?.username || "Unknown Seller";
  const gigTitle = gig?.title || "Untitled Gig";
  const gigCategory = gig?.category || "Uncategorized";
  const gigPrice = typeof gig?.price === "number" ? gig.price : 0;
  const averageRating =
    typeof gig?.averageRating === "number" ? gig.averageRating : 0;
  const numOfReviews =
    typeof gig?.numOfReviews === "number" ? gig.numOfReviews : 0;

  return (
    <div
      onClick={() => gig?._id && navigate("gigDetail", { gigId: gig._id })}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1 flex flex-col h-full"
    >
      <img
        className="w-full h-48 object-cover"
        src={
          gig?.images && gig.images.length > 0
            ? gig.images[0].url
            : `https://placehold.co/600x400/A020F0/FFFFFF?text=${
                gigTitle.split(" ")[0]
              }`
        }
        alt={gigTitle}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://placehold.co/600x400/cccccc/333333?text=Image+Error`;
        }}
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3
          className="text-xl font-semibold text-purple-700 mb-2 truncate"
          title={gigTitle}
        >
          {gigTitle}
        </h3>
        <p className="text-gray-600 text-sm mb-1 truncate">
          Category: {gigCategory}
        </p>
        <p className="text-gray-500 text-xs mb-3 truncate">
          By: {sellerUsername}
        </p>
        <div className="flex items-center mb-3">
          <Star className="w-5 h-5 text-yellow-400 mr-1" />
          <span className="text-gray-700 font-medium">
            {averageRating > 0 ? averageRating.toFixed(1) : "New"} (
            {numOfReviews} reviews)
          </span>
        </div>
        <div className="mt-auto">
          <p className="text-2xl font-bold text-purple-600">
            ${gigPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};
export default GigCard;
