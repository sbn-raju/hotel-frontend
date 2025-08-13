import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, Home, XCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BASE_URI } from "../../utils/BaseUrl.utils";

// Loader component
const PaymentLoader = ({ secondsRemaining }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90 text-center p-4">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-6"></div>
    <h2 className="text-xl font-semibold text-gray-800 mb-2">
      Processing Payment...
    </h2>
    <p className="text-gray-600 mb-1">
      Please do not refresh the page or press the back button.
    </p>
    <p className="text-gray-500 text-sm">
      Time remaining: <span className="font-semibold">{secondsRemaining}s</span>
    </p>
  </div>
);

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [transcationData, setTranscationData] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [paymentStatus, setPaymentStatus] = useState("processing"); // "success", "failed", "pending"
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const order_id = searchParams.get("order_id");

  //   const transactionData = {
  //     transactionId: "TXN123456789",
  //     amount: 999,
  //     date: new Date().toLocaleString(),
  //     paymentMode: "Credit Card",
  //   };

  useEffect(() => {
    let intervalId;
    let countdownId;
    let timeoutId;

    const pollPaymentStatus = async () => {
      try {
        const response = await fetch(
          `${BASE_URI}/payment/status/verify-payment?order_id=${order_id}`
        );
        const data = await response.json();
        console.log(data);

        if (data.data.status === "success") {
          setPaymentStatus("success");
          setTranscationData(data.data);
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          clearInterval(countdownId);
          setLoading(false);
          return;
        } else if (data.data.status === "failed") {
          setPaymentStatus("failed");
          setError(data.message || "We were unable to process your payment.");
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          clearInterval(countdownId);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Polling error:", error.message);
        // Optional: show a message if API call itself fails
        setError("Something went wrong while verifying payment.");
      }
    };

    // Start polling every 5 seconds
    intervalId = setInterval(pollPaymentStatus, 5000);

    // Countdown timer for user display
    countdownId = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(countdownId);
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          if (paymentStatus !== "success") {
            setPaymentStatus("pending");
          }
          setLoading(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Final fallback timeout (stop after 30s)
    timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      clearInterval(countdownId);
      if (paymentStatus !== "success") {
        setPaymentStatus("pending");
      }
      setLoading(false);
    }, 30000);

    return () => {
      clearInterval(intervalId);
      clearInterval(countdownId);
      clearTimeout(timeoutId);
    };
  }, [order_id]);

  const handleProceed = () => {
    navigate("/room/1");
  };

  const handleRetry = () => {
    navigate(`/subscription/plans`);
  };

  // ⏳ Still Loading
  if (loading) {
    return <PaymentLoader secondsRemaining={secondsRemaining} />;
  }

  // ⏳ Payment Pending
  if (paymentStatus === "pending") {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-yellow-700 mb-2">
            Payment is still being processed
          </h2>
          <p className="text-gray-700 mb-4">
            Your payment is taking a bit longer than expected. Please retry or
            check your email for updates.
          </p>
          <button
            // onClick={() => window.location.reload()}
            className="w-full bg-yellow-500 text-white py-2 rounded-xl hover:bg-yellow-600 transition"
          >
            Retry Checking Status
          </button>
        </div>
      </div>
    );
  }

  // ❌ Payment Failed
  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Failed
          </h2>
          <p className="text-gray-600 mb-4">
            {error ||
              "We were unable to process your payment. Please try again."}
          </p>
          <button
            onClick={handleRetry}
            className="w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
          >
            Retry Payment
          </button>
          <p className="text-xs text-gray-500 mt-4">
            No amount has been deducted. If the issue persists, please contact
            support.
          </p>
        </div>
      </div>
    );
  }

  // ✅ Payment Success
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful
        </h2>
        <p className="text-gray-600 mb-6">
          You can now proceed to setting up your dashboard.
        </p>
        <div className="text-left bg-gray-50 rounded-lg p-4 border text-sm text-gray-700 space-y-2 mb-6">
          <p>
            <strong>Transaction ID:</strong> {transcationData?.order_id}
          </p>
          <p>
            <strong>Amount Paid:</strong> ₹
            {transcationData?.order_response.amount_paid}
          </p>
          <p>
            <strong>Payment Date:</strong>{" "}
            {new Date(transcationData?.createdAt).toLocaleString()}
          </p>
          {/* <p><strong>Payment Mode:</strong> {transactionData.paymentMode}</p> */}
        </div>
        <p className="text-xs text-black m-1 bg-amber-100 p-1 rounded border-2 border-amber-500">
          An invoice for this purchase will be sent to your registered email.
        </p>
        <button
          onClick={handleProceed}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>
      </div>
    </div>
  );
}
