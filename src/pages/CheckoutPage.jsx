import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { CreditCard } from "lucide-react";
import apiService from "../services/apiService";
import useAuthStore from "../store/authStore";
import Input from "../components/Input";
import LoadingSpinner from "../components/LoadingSpinner";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "../components/StripeCheckoutForm";



const CheckoutPage = ({ navigate, gigId, price, deliveryTime, gigTitle }) => {
  const { userInfo, isAuthenticated } = useAuthStore();
  const [requirements, setRequirements] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed to checkout.");
      navigate("login", {
        from: `checkout`,
        gigId,
        price,
        deliveryTime,
        gigTitle,
      });
      return;
    }
    if (
      !gigId ||
      typeof price === "undefined" ||
      typeof deliveryTime === "undefined"
    ) {
      toast.error("Missing gig information for checkout.");
      navigate("home");
      return;
    }

    const initializeStripe = async () => {
      setIsProcessing(true);
      toast.loading("Initializing Checkout...");
      try {
        const keyData = await apiService.getStripePublishableKey();
        if (!keyData || !keyData.publishableKey)
          throw new Error("Failed to load Stripe configuration.");
        setStripePromise(loadStripe(keyData.publishableKey));

        const intentData = {
          gigId,
          currency: "usd",
          description: `Order for: ${gigTitle || "Gig"}`,
        };
        const intentResponse = await apiService.createPaymentIntent(
          intentData,
          userInfo.token
        );
        if (!intentResponse || !intentResponse.clientSecret)
          throw new Error("Failed to create payment intent.");
        setClientSecret(intentResponse.clientSecret);

        toast.dismiss();
        toast.success("Checkout ready.");
      } catch (error) {
        console.error("Stripe Initialization Error:", error);
        toast.dismiss();
        toast.error(
          error.message || "Could not initialize payment. Please try again."
        );
        navigate(-1);
      } finally {
        setIsProcessing(false);
      }
    };

    initializeStripe();
  }, [
    isAuthenticated,
    gigId,
    price,
    deliveryTime,
    navigate,
    gigTitle,
    userInfo?.token,
  ]);

  const handleSuccessfulPayment = async (stripePaymentIntent) => {
    setIsProcessing(true);
    try {
      toast.loading("Finalizing your order...");
      const orderData = { gigId, requirements, price, deliveryTime };
      const newOrder = await apiService.createOrder(orderData, userInfo.token);
      toast.success("Order created successfully!");

      const paymentDetails = {
        paymentIntentId: stripePaymentIntent.id,
        status: stripePaymentIntent.status,
        paymentMethod: stripePaymentIntent.payment_method_types
          ? stripePaymentIntent.payment_method_types[0]
          : "stripe",
      };
      await apiService.updateOrderToPaid(
        newOrder._id,
        paymentDetails,
        userInfo.token
      );

      toast.dismiss();
      toast.success("Order confirmed and payment updated!");
      navigate("orderSuccess", { orderId: newOrder._id });
    } catch (error) {
      console.error("Order Finalization Error:", error);
      toast.dismiss();
      toast.error(
        error.message ||
          `Order finalization failed. Payment ID: ${stripePaymentIntent.id}. Contact support.`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated)
    return <LoadingSpinner message="Redirecting to login..." />;
  if (isProcessing && !clientSecret)
    return <LoadingSpinner message="Initializing Secure Checkout..." />;
  if (!gigId || (typeof price === "undefined" && !isProcessing)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 p-4 bg-red-100 rounded-md">
          Missing critical gig information.
        </p>
      </div>
    );
  }

  const stripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#6d28d9",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
        spacingUnit: "4px",
        borderRadius: "4px",
      },
      rules: {
        ".Input": {
          borderColor: "#d1d5db",
          boxShadow: "none",
        },
        ".Input:focus": {
          borderColor: "#8b5cf6",
          boxShadow: `0 0 0 1px #8b5cf6`,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-10">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-6 sm:mb-8 text-center">
          Secure Checkout
        </h1>
        <div className="mb-6 p-4 border border-purple-200 rounded-lg bg-purple-50">
          <h2 className="text-xl font-semibold text-purple-600 mb-2">
            {gigTitle || "Selected Gig"}
          </h2>
          <p className="text-sm text-gray-700">
            Price:{" "}
            <span className="font-bold text-gray-900">
              ${price?.toFixed(2)}
            </span>
          </p>
          <p className="text-sm text-gray-700">
            Delivery:{" "}
            <span className="font-bold text-gray-900">
              {deliveryTime} day(s)
            </span>
          </p>
        </div>
        <div className="mb-6">
          <Input
            label="Your Requirements"
            type="textarea"
            name="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Describe your needs for this order (e.g., specific instructions, files can be attached after order placement)."
            rows={5}
            required
            className="h-32"
            disabled={isProcessing && clientSecret != null}
          />
        </div>
        {stripePromise && clientSecret ? (
          <Elements stripe={stripePromise} options={stripeElementsOptions}>
            <StripeCheckoutForm
              clientSecret={clientSecret}
              onSuccessfulPayment={handleSuccessfulPayment}
              price={price}
              requirements={requirements}
              setIsProcessingOuter={setIsProcessing}
            />
          </Elements>
        ) : (
          <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />{" "}
            <p className="text-gray-500">
              {isProcessing
                ? "Loading Payment Gateway..."
                : "Initializing Payment Details..."}
            </p>
            {isProcessing && <LoadingSpinner size="sm" />}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
