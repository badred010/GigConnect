import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import apiService from "../services/apiService";
import useAuthStore from "../store/authStore";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";

const SellerOrdersPage = ({ navigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (
      !isAuthenticated ||
      (userInfo?.role !== "seller" && userInfo?.role !== "admin")
    ) {
      toast.error("Please login as a seller or admin to view sales.");
      navigate("login");
      return;
    }
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await apiService.getSellerOrders(userInfo.token);
        setOrders(data);
      } catch (error) {
        toast.error(error.message || "Could not fetch your sales.");
      } finally {
        setLoading(false);
      }
    };
    if (userInfo?.token) {
      fetchOrders();
    } else if (isAuthenticated) {
      toast.error("Authentication error. Please log in again.");
      navigate("login");
    }
  }, [isAuthenticated, userInfo, navigate]);

  const handleViewOrder = (orderId) => {
    navigate("orderDetail", { orderId });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-8 text-center">
          My Sales
        </h1>
        {loading ? (
          <LoadingSpinner />
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <h2
                      className="text-xl font-semibold text-purple-600 truncate max-w-xs sm:max-w-md"
                      title={order.gig?.title}
                    >
                      {order.gig?.title || "Gig Title Unavailable"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Order ID: {order._id}
                    </p>
                    <p className="text-sm text-gray-500">
                      Buyer: {order.buyer?.username || "N/A"}
                    </p>
                  </div>
                  <span
                    className={`mt-2 sm:mt-0 px-3 py-1 text-xs font-semibold rounded-full
                                        ${
                                          order.orderStatus === "Completed"
                                            ? "bg-green-100 text-green-700"
                                            : order.orderStatus === "Pending" ||
                                              order.orderStatus === "InProgress"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : order.orderStatus === "Delivered"
                                            ? "bg-blue-100 text-blue-700"
                                            : order.orderStatus === "Cancelled"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-gray-100 text-gray-700"
                                        }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <p className="text-gray-700">
                      Earnings:{" "}
                      <span className="font-bold">
                        ${order.price.toFixed(2)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Ordered on:{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleViewOrder(order._id)}
                    variant="outline"
                    className="mt-4 sm:mt-0 text-sm !py-2 !px-4"
                  >
                    Manage Order
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-xl py-10">
            You have no sales yet.
          </p>
        )}
      </div>
    </div>
  );
};
export default SellerOrdersPage;
