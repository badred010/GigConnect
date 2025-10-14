import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import apiService from "../services/apiService";
import useAuthStore from "../store/authStore";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { Send, Check, X, FileWarning } from "lucide-react";

const OrderDetailPage = ({ navigate, orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userInfo, isAuthenticated } = useAuthStore();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view order details.");
      navigate("login");
      return;
    }
    if (!orderId) {
      toast.error("No order ID provided.");
      navigate("home");
      return;
    }
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await apiService.getOrderById(orderId, userInfo.token);
        setOrder(data);
      } catch (error) {
        toast.error(error.message || "Could not fetch order details.");
        navigate(userInfo?.role === "seller" ? "sellerOrders" : "myOrders");
      } finally {
        setLoading(false);
      }
    };
    if (userInfo?.token) {
      fetchOrder();
    }
  }, [isAuthenticated, userInfo, orderId, navigate]);

  const handleUpdateStatus = async (newStatus) => {
    if (!order || isUpdatingStatus) return;

    if (newStatus === "Disputed") {
      navigate("disputeOrder", { orderId: order._id });
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const updatedOrder = await apiService.updateOrderStatus(
        order._id,
        newStatus,
        userInfo.token
      );
      setOrder(updatedOrder);
      toast.success(`Order status updated to ${newStatus}.`);
    } catch (error) {
      toast.error(error.message || `Failed to update order status.`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!order)
    return (
      <p className="text-center text-red-500 text-xl py-10">
        Order details not found.
      </p>
    );

  const isBuyer = userInfo?._id === order.buyer?._id;
  const isSeller = userInfo?._id === order.seller?._id;
  const isAdmin = userInfo?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h1 className="text-2xl md:text-3xl font-extrabold text-purple-700">
            Order Details
          </h1>
          <span
            className={`px-3 py-1.5 text-sm font-semibold rounded-full ${
              order.orderStatus === "Completed"
                ? "bg-green-100 text-green-700"
                : order.orderStatus === "InProgress"
                ? "bg-yellow-100 text-yellow-700"
                : order.orderStatus === "Delivered"
                ? "bg-blue-100 text-blue-700"
                : order.orderStatus === "Cancelled" ||
                  order.orderStatus === "Disputed"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {order.orderStatus}
          </span>
        </div>

        <div className="mb-6 space-y-3">
          <p className="text-gray-700">
            <strong className="font-medium text-gray-800">Order ID:</strong>{" "}
            {order._id}
          </p>
          <p className="text-gray-700">
            <strong className="font-medium text-gray-800">Gig Title:</strong>{" "}
            {order.gig?.title || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong className="font-medium text-gray-800">Date Ordered:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <p className="text-gray-700">
            <strong className="font-medium text-gray-800">Price:</strong>{" "}
            <span className="text-purple-600 font-bold">
              ${order.price.toFixed(2)}
            </span>
          </p>
          {isBuyer && (
            <p className="text-gray-700">
              <strong className="font-medium text-gray-800">Seller:</strong>{" "}
              {order.seller?.username || "N/A"} ({order.seller?.email})
            </p>
          )}
          {isSeller && (
            <p className="text-gray-700">
              <strong className="font-medium text-gray-800">Buyer:</strong>{" "}
              {order.buyer?.username || "N/A"} ({order.buyer?.email})
            </p>
          )}
        </div>

        {order.requirements && (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">
              Buyer's Requirements:
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {order.requirements}
            </p>
          </div>
        )}

        {order.orderStatus === "Disputed" && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Dispute Details
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              <strong>Reason:</strong>{" "}
              {order.disputeReason || "No reason provided."}
            </p>
            {order.disputeEvidence && order.disputeEvidence.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-800">
                  Evidence Files:
                </p>
                <ul className="list-disc list-inside mt-2">
                  {order.disputeEvidence.map((file) => (
                    <li key={file.public_id}>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        View File
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Actions:</h3>
          <div className="flex flex-wrap gap-3">
            {(isSeller || isBuyer || isAdmin) &&
              order.orderStatus === "InProgress" &&
              order.isPaid && (
                <Button
                  onClick={() => handleUpdateStatus("Delivered")}
                  variant="primary"
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Mark as Delivered
                    </>
                  )}
                </Button>
              )}

            {(isBuyer || isAdmin) && order.orderStatus === "Delivered" && (
              <Button
                onClick={() => handleUpdateStatus("Completed")}
                variant="primary"
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Accept Delivery & Complete
                  </>
                )}
              </Button>
            )}

            {(isBuyer || isSeller || isAdmin) &&
              (order.orderStatus === "Pending" ||
                order.orderStatus === "InProgress") && (
                <Button
                  onClick={() => handleUpdateStatus("Cancelled")}
                  variant="danger"
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Cancel Order
                    </>
                  )}
                </Button>
              )}

            {(isBuyer || isSeller || isAdmin) &&
              (order.orderStatus === "InProgress" ||
                order.orderStatus === "Delivered") &&
              order.isPaid && (
                <Button
                  onClick={() =>
                    navigate("disputeOrder", { orderId: order._id })
                  }
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  disabled={isUpdatingStatus}
                >
                  <FileWarning className="mr-2 h-4 w-4" /> Raise a Dispute
                </Button>
              )}

            <Button
              onClick={() =>
                navigate(
                  isBuyer ? "myOrders" : isSeller ? "sellerOrders" : "home"
                )
              }
              variant="outline"
            >
              Back to Orders
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderDetailPage;
