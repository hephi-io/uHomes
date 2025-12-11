import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Label, Button } from '@uhomes/ui-kit';
import DatePicker from '@/shared/date-picker';
import { SVGs } from '@/assets/svgs/Index';
import { Checkbox } from '@/components/ui/checkbox';
import { createPayment } from '@/services/payment';
import { type Booking } from '@/services/booking';
import { type SavedProperty } from '@/services/property';
import { useAuth } from '@/contexts/auth-context';

function Text({ children }: { children: string }) {
  return <span className="text-sm leading-[120%] tracking-[0%] text-[#09090B]">{children}</span>;
}

// Helper function to format currency
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Calculate cost breakdown
function calculateBreakdown(amount: number) {
  const rent = amount * 0.9; // 90% rent
  const serviceCharge = amount * 0.05; // 5% service charge
  const cautionFee = amount * 0.03; // 3% caution fee
  const agreementFee = amount * 0.02; // 2% agreement fee

  return {
    rent,
    serviceCharge,
    cautionFee,
    agreementFee,
    total: amount,
  };
}

// Room type labels mapping
const ROOM_TYPE_LABELS: Record<string, string> = {
  single: 'Single Room',
  shared: 'Shared Room (2-person)',
  'self-contain': 'Self Contain',
};

import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToEscrow, setAgreedToEscrow] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const booking = (location.state as { booking?: Booking })?.booking;
  const property = (location.state as { property?: SavedProperty })?.property;

  useEffect(() => {
    // Redirect if no booking data
    if (!booking || !property) {
      navigate('/students/booking');
    }
  }, [booking, property, navigate]);

  useEffect(() => {
    // Handle error from payment callback
    const errorParam = new URLSearchParams(window.location.search).get('error');
    if (errorParam) {
      setError(
        errorParam === 'invalid_reference'
          ? 'Invalid payment reference'
          : errorParam === 'payment_failed'
            ? 'Payment was not successful'
            : errorParam === 'booking_not_found'
              ? 'Booking not found'
              : 'Payment verification failed'
      );
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  if (!booking || !property) {
    return null;
  }

  const propertyImage =
    property.images && property.images.length > 0
      ? property.images[0].url
      : '/placeholder-hostel.png';

  const agent =
    typeof booking.agent === 'object' ? booking.agent : { fullName: 'Agent', phoneNumber: '' };

  const summaries = [
    {
      id: 1,
      item: 'Room Type',
      value: ROOM_TYPE_LABELS[booking.propertyType] || 'Self Contain',
    },
    { id: 2, item: 'Move-in Date', value: formatDate(booking.moveInDate) },
    {
      id: 3,
      item: 'Move-out Date',
      value: booking.moveOutDate ? formatDate(booking.moveOutDate) : 'N/A',
    },
    { id: 4, item: 'Duration', value: booking.duration },
    { id: 5, item: 'Agent', value: agent.fullName },
  ];

  const breakdown = calculateBreakdown(booking.amount);
  const breakdowns = [
    { id: 1, item: 'Rent', value: formatCurrency(breakdown.rent) },
    { id: 2, item: 'Service charge', value: formatCurrency(breakdown.serviceCharge) },
    { id: 3, item: 'Caution fee', value: formatCurrency(breakdown.cautionFee) },
    { id: 4, item: 'Agreement fee (one-time)', value: formatCurrency(breakdown.agreementFee) },
  ];

  const handlePayment = async () => {
    if (!agreedToEscrow || !agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    if (!user?.email) {
      setError('User email is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const paymentData = {
        amount: booking.amount,
        email: user.email,
        description: `Booking payment for ${property.title}`,
        currency: 'NGN',
        paymentMethod: 'paystack',
        metadata: {
          bookingId: booking._id,
          propertyId: property._id,
        },
      };

      const response = await createPayment(paymentData);

      if (response.data.status === 'success' && response.data.data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = response.data.data.authorization_url;
      } else {
        setError('Failed to initialize payment');
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || 'Failed to process payment');
      } else {
        setError('An unexpected error occurred');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:flex lg:justify-between">
      <div className="lg:w-[52.08%]">
        <h1 className="font-semibold text-xl leading-[120%] tracking-[0%] text-[#09090B] md:text-sm lg:text-xl">
          Booking Summary
        </h1>
        {summaries.map((summary) => (
          <div
            key={summary.id}
            className={`flex justify-between items-center ${summary.id === 1 ? 'mt-9' : 'mt-4'}`}
          >
            <Text>{summary.item}</Text>
            <Text>{summary.value}</Text>
          </div>
        ))}
        <Label className="text-sm leading-[120%] tracking-[0%] align-middle text-[#09090B] mt-9 mb-4">
          Choose your inspection date/time
        </Label>
        <DatePicker />
        <div className="flex gap-x-2.5 items-center rounded-lg bg-[#EFF3FD] p-3 mt-9">
          <SVGs.Exclamation />
          <span className="text-sm leading-[120%] tracking-[0%] align-middle text-[#3E78FF]">
            Payment will be securely held in escrow until you confirm check-in.
          </span>
        </div>
        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <div className="flex gap-x-2.5 mt-9">
          <Checkbox
            checked={agreedToEscrow}
            onCheckedChange={(checked) => setAgreedToEscrow(checked === true)}
            className="size-4.5 border-[#09090B]"
          />
          <Label className="text-sm leading-[120%] tracking-[0%] text-[#09090B]">
            I understand that my payment will be held in escrow until check-in is confirmed.
          </Label>
        </div>
        <div className="flex gap-x-2.5 mt-4">
          <Checkbox
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            className="size-4.5 border-[#09090B]"
          />
          <Label className="block text-sm leading-[120%] tracking-[0%] text-[#09090B]">
            I have read and agreed to the{' '}
            <a className="underline text-[#3E78FF] hover:cursor-pointer">Terms & Conditions</a> and
            the <a className="underline text-[#3E78FF] hover:cursor-pointer">Privacy Policy</a> of
            Uhomes
          </Label>
        </div>
        <Button
          onClick={handlePayment}
          disabled={loading || !agreedToEscrow || !agreedToTerms}
          className="w-full h-[45px] gap-x-2 rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] px-4 py-2 mt-9"
        >
          <SVGs.PropertyAdd />
          <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
            {loading ? 'Processing...' : 'Proceed To Payment'}
          </span>
        </Button>
      </div>
      <div className="md:rounded-[10px] md:border-2 md:border-[#3E78FF0D] md:bg-white md:shadow-[0px_10px_20px_2px_#00000012] lg:w-[508px] md:px-6 md:py-10 lg:p-10 md:mt-4 lg:mt-0">
        <div className="md:flex md:gap-x-[13px] md:items-center">
          <div className="h-[132px] rounded overflow-hidden md:w-full lg:w-[123.45px] lg:h-19 lg:shrink-0 mt-16 md:mt-0">
            <img
              src={propertyImage}
              alt={property.title}
              className="size-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-hostel.png';
              }}
            />
          </div>
          <div className="md:w-full">
            <h2 className="font-semibold text-lg leading-[18.19px] tracking-[0%] align-middle text-[#09090B] md:font-bold md:text-sm lg:text-lg mt-[13px] md:mt-0">
              {property.title}
            </h2>
            <div className="flex gap-x-[6.5px] items-center mt-3">
              <SVGs.Location />
              <span className="text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B]">
                {property.location}
              </span>
            </div>
            {property.rating !== undefined && (
              <div className="flex gap-x-4 items-center mt-3">
                <div className="flex gap-x-2 items-center">
                  <SVGs.Bed />
                  <span className="text-xs leading-[15.59px] tracking-[0%] align-middle text-[#09090B]">
                    Reviews
                  </span>
                </div>
                <div className="flex gap-x-1 items-center">
                  <SVGs.Star />
                  <span className="text-sm leading-[15.59px] tracking-[0%] align-middle text-[#09090B] lg:text-xs">
                    {property.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-t-[#DCDCDC] mt-4"></div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm leading-7 tracking-[0%] align-middle text-[#09090B] lg:text-base">
            Rent price
          </span>
          <h1 className="font-semibold text-2xl leading-10.5 tracking-[0%] align-middle text-[#09090B] md:text-sm lg:text-2xl">
            {formatCurrency(booking.amount)}
          </h1>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm leading-7 tracking-[0%] align-middle text-[#09090B] lg:text-base">
            Duration
          </span>
          <span className="font-semibold text-sm leading-7 tracking-[0%] align-middle text-[#09090B] lg:text-base">
            {booking.duration}
          </span>
        </div>
        <div className="border-t border-t-[#DCDCDC] mt-4"></div>
        <h3 className="text-sm leading-6 tracking-[0%] text-center align-middle text-[#09090B] mt-4">
          Cost breakdown
        </h3>
        {breakdowns.map((breakdown) => (
          <div key={breakdown.id} className="flex justify-between items-center mt-4">
            <span className="text-sm leading-7 tracking-[0%] align-middle text-[#09090B]">
              {breakdown.item}
            </span>
            <span className="text-sm leading-7 tracking-[0%] text-right align-middle text-[#09090B]">
              {breakdown.value}
            </span>
          </div>
        ))}
        <div className="border-t border-t-[#DCDCDC] mt-4"></div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm leading-7 tracking-[0%] align-middle text-[#09090B]">Total</span>
          <h1 className="font-semibold text-2xl leading-10.5 tracking-[0%] align-middle text-[#09090B] md:text-sm lg:text-2xl">
            {formatCurrency(breakdown.total)}
          </h1>
        </div>
        <div className="flex gap-x-2 justify-center items-center md:hidden lg:flex mt-12 mb-3 lg:mb-0">
          <SVGs.AiLock />
          <span className="font-semibold text-sm leading-[120%] tracking-[0%] text-[#999999]">
            Payments are secured and encrypted
          </span>
        </div>
      </div>
    </div>
  );
}
