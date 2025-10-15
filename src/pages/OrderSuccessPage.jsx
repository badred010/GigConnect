import Button from "../components/Button";

const OrderSuccessPage = ({ navigate, orderId }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6">
      <div className="bg-white text-gray-800 p-8 md:p-12 rounded-xl shadow-2xl text-center max-w-lg">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
          <svg
            className="h-12 w-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Thank you for your purchase.
        </p>
        <p className="text-gray-600 mb-6">
          Your Order ID is:{" "}
          <strong className="text-purple-600">{orderId}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-8">
          You can track your order status in your "My Orders" section. The
          seller has been notified.
        </p>
        <div className="space-y-3 md:space-y-0 md:flex md:justify-center md:space-x-4">
          <Button onClick={() => navigate("myOrders")} variant="primary">
            View My Orders
          </Button>
          <Button onClick={() => navigate("home")} variant="outline">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};
export default OrderSuccessPage;
