import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Button } from '@uhomes/ui-kit';
import { verifyPaymentByReference } from '@/services/payment';
import { type Booking } from '@/services/booking';

export default function PaymentCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  const reference = searchParams.get('reference');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setError('Payment reference is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await verifyPaymentByReference(reference);

        if (response.data.status === 'success') {
          const { booking: verifiedBooking } = response.data.data;
          setBooking(verifiedBooking);
          setSuccess(true);

          // Brief delay to show success message before redirecting
          setTimeout(() => {
            navigate('/students/booking/checkout-success', {
              state: { booking: verifiedBooking },
            });
          }, 2000);
        } else {
          setError('Payment verification failed');
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.error || 'Failed to verify payment');
        } else {
          setError('An unexpected error occurred');
        }
        console.error('Payment verification error:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference, navigate]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleReturnToCheckout = () => {
    navigate('/students/booking/checkout');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="md:w-[443px] md:rounded-[10px] md:border-2 md:border-[#3E78FF0D] md:bg-white md:shadow-[0px_10px_20px_2px_#00000012] md:p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3E78FF]"></div>
          </div>
          <h2 className="font-semibold text-xl leading-[130%] tracking-[0%] text-[#09090B] mb-2">
            Verifying Payment
          </h2>
          <p className="text-sm leading-5 tracking-[0%] text-[#61646B]">
            Please wait while we verify your payment...
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (success && booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="md:w-[443px] md:rounded-[10px] md:border-2 md:border-[#3E78FF0D] md:bg-white md:shadow-[0px_10px_20px_2px_#00000012] md:p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-[#11A75C]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="font-semibold text-xl leading-[130%] tracking-[0%] text-[#09090B] mb-2">
            Payment Verified Successfully!
          </h2>
          <p className="text-sm leading-5 tracking-[0%] text-[#61646B]">
            Your booking has been confirmed. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="md:w-[443px] md:rounded-[10px] md:border-2 md:border-[#3E78FF0D] md:bg-white md:shadow-[0px_10px_20px_2px_#00000012] md:p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-[#EF4444]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="font-semibold text-xl leading-[130%] tracking-[0%] text-[#09090B] mb-2">
          Payment Verification Failed
        </h2>
        <p className="text-sm leading-5 tracking-[0%] text-[#61646B] mb-6">
          {error || 'We were unable to verify your payment. Please try again.'}
        </p>
        <div className="flex gap-x-3 justify-center">
          <Button
            onClick={handleRetry}
            className="h-10.5 rounded-[5px] border border-[#E4E4E4EE] bg-white text-[#09090B] px-6"
          >
            <span className="font-medium text-sm leading-[150%] tracking-[0%]">Retry</span>
          </Button>
          <Button
            onClick={handleReturnToCheckout}
            className="h-10.5 rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] px-6"
          >
            <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
              Return to Checkout
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
