import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";

const StripeCheckoutForm = ({
  clientSecret,
  onSuccessfulPayment,
  price,
  requirements,
  setIsProcessingOuter,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsPaying(true);
    setIsProcessingOuter(true);
    setErrorMessage(null);

    if (!stripe || !elements) {
      toast.error(
        "Stripe.js has not loaded yet. Please refresh and try again."
      );
      setIsPaying(false);
      setIsProcessingOuter(false);
      return;
    }

    if (!requirements || !requirements.trim()) {
      toast.error("Please provide your requirements for the order.");
      setIsPaying(false);
      setIsProcessingOuter(false);
      return;
    }

    toast.loading("Processing payment...");

    const { error: submitError } = await elements.submit();
    if (submitError) {
      toast.dismiss();
      toast.error(submitError.message);
      setErrorMessage(submitError.message);
      setIsPaying(false);
      setIsProcessingOuter(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {},
      redirect: "if_required",
    });

    if (error) {
      toast.dismiss();
      toast.error(error.message || "Payment failed. Please try again.");
      setErrorMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.dismiss();
      toast.success("Payment successful!");
      await onSuccessfulPayment(paymentIntent);
    } else if (paymentIntent) {
      toast.dismiss();
      toast.warn(
        `Payment status: ${paymentIntent.status}. Please follow instructions or try another method.`
      );
      setErrorMessage(`Payment status: ${paymentIntent.status}.`);
    } else {
      toast.dismiss();
      toast.error("An unexpected error occurred during payment.");
      setErrorMessage("An unexpected error occurred.");
    }

    setIsPaying(false);
  };

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <Button
        type="submit"
        variant="primary"
        className="w-full text-lg py-3 mt-6"
        disabled={!stripe || !elements || isPaying}
      >
        {isPaying ? (
          <LoadingSpinner size="sm" />
        ) : (
          `Confirm & Pay $${price?.toFixed(2)}`
        )}
      </Button>
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2 text-center" role="alert">
          {errorMessage}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-4 text-center">
        By clicking "Confirm & Pay", you agree to our Terms of Service.
      </p>
    </form>
  );
};

export default StripeCheckoutForm;
