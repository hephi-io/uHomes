import { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { SVGs } from '@/assets/svgs/Index';
import { Button } from '@uhomes/ui-kit';
import { type Booking } from '@/services/booking';
import { type SavedProperty } from '@/services/property';

// Helper function to format currency
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Calculate cost breakdown
function calculateBreakdown(amount: number) {
  const rent = amount * 0.9; // 90% rent
  const serviceCharge = amount * 0.05; // 5% service charge
  const cautionFee = amount * 0.03; // 3% caution fee
  const agreementFee = amount * 0.02; // 2% agreement fee

  return [
    { id: 1, name: 'Rent', value: formatCurrency(rent) },
    { id: 2, name: 'Service charge', value: formatCurrency(serviceCharge) },
    { id: 3, name: 'Caution fee', value: formatCurrency(cautionFee) },
    { id: 4, name: 'Agreement fee (one-time)', value: formatCurrency(agreementFee) },
  ];
}

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Try to get booking from URL params first (from callback), then from state
  const bookingParam = searchParams.get('booking');
  const bookingFromState = (location.state as { booking?: Booking })?.booking;
  const propertyFromState = (location.state as { property?: SavedProperty })?.property;

  const booking = bookingParam
    ? (JSON.parse(decodeURIComponent(bookingParam)) as Booking)
    : bookingFromState;
  const property = propertyFromState;

  useEffect(() => {
    // Redirect if no booking data
    if (!booking) {
      navigate('/students/booking');
    }
  }, [booking, navigate]);

  if (!booking) {
    return null;
  }

  const agent = typeof booking.agent === 'object' ? booking.agent : null;
  const propertyData = typeof booking.property === 'object' ? booking.property : property;

  const breakdowns = calculateBreakdown(booking.amount);

  const handleDownloadReceipt = () => {
    // TODO: Implement receipt download functionality
    console.log('Download receipt for booking:', booking._id);
  };

  const handleCallAgent = () => {
    if (agent?.phoneNumber) {
      window.location.href = `tel:${agent.phoneNumber}`;
    }
  };

  const handleReturnToBookings = () => {
    navigate('/students/dashboard');
  };

  return (
    <div className="md:h-[678px] md:flex md:justify-center md:items-center">
      <div className="md:w-[443px] md:rounded-[10px] md:border-2 md:border-[#3E78FF0D] md:bg-white md:shadow-[0px_10px_20px_2px_#00000012] md:p-6">
        <div className="w-[78.53%] h-[229px] md:w-[57.79%] mx-auto">
          <iframe
            src="https://lottie.host/embed/3bf9aba4-99cc-46e7-ad75-d85ad835c705/6M52xDtGMr.lottie"
            className="size-full"
            title="Success animation"
          ></iframe>
        </div>
        <h1 className="font-semibold text-2xl leading-10.5 tracking-[0%] text-center align-middle text-[#09090B] mt-9">
          Booking Completed
        </h1>
        <p className="text-sm leading-5 tracking-[0%] text-center align-middle text-[#61646B] mt-2">
          Your payment has been received and your booking has been completed
        </p>

        {/* Booking Details */}
        <div className="mt-6 p-4 bg-[#F9FBFF] rounded-lg">
          <div className="space-y-3">
            <div>
              <span className="text-xs text-[#727272]">Property:</span>
              <p className="text-sm font-medium text-[#09090B]">
                {propertyData?.title || 'Property'}
              </p>
            </div>
            <div>
              <span className="text-xs text-[#727272]">Amount:</span>
              <p className="text-sm font-medium text-[#09090B]">{formatCurrency(booking.amount)}</p>
            </div>
            <div>
              <span className="text-xs text-[#727272]">Duration:</span>
              <p className="text-sm font-medium text-[#09090B]">{booking.duration}</p>
            </div>
            <div>
              <span className="text-xs text-[#727272]">Move-in Date:</span>
              <p className="text-sm font-medium text-[#09090B]">
                {new Date(booking.moveInDate).toLocaleDateString('en-GB')}
              </p>
            </div>
            {booking.moveOutDate && (
              <div>
                <span className="text-xs text-[#727272]">Move-out Date:</span>
                <p className="text-sm font-medium text-[#09090B]">
                  {new Date(booking.moveOutDate).toLocaleDateString('en-GB')}
                </p>
              </div>
            )}
            <div>
              <span className="text-xs text-[#727272]">Payment Status:</span>
              <p className="text-sm font-medium text-[#11A75C] capitalize">
                {booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus}
              </p>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="mt-4 pt-4 border-t border-[#DCDCDC]">
            <h3 className="text-sm font-medium text-[#09090B] mb-3">Cost Breakdown</h3>
            {breakdowns.map((breakdown) => (
              <div key={breakdown.id} className="flex justify-between items-center mb-2">
                <span className="text-xs text-[#09090B]">{breakdown.name}</span>
                <span className="text-xs text-[#09090B]">{breakdown.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center md:gap-x-4 md:justify-center mt-4">
          <div className="flex gap-x-2 items-center hover:cursor-pointer" onClick={handleCallAgent}>
            <SVGs.Contact />
            <span className="text-base leading-6 tracking-[0%] align-middle text-[#09090B]">
              Call Agent
            </span>
          </div>
          <div className="h-6 border-r border-r-[#A7A7A7]" />
          <div
            className="flex gap-x-2 items-center hover:cursor-pointer"
            onClick={handleDownloadReceipt}
          >
            <SVGs.Download />
            <span className="text-base leading-6 tracking-[0%] align-middle text-[#09090B]">
              Download receipt
            </span>
          </div>
        </div>
        <Button
          onClick={handleReturnToBookings}
          className="w-full h-10.5 rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] mt-9"
        >
          <span className="font-medium text-base leading-[26px] tracking-[0%] align-middle text-white">
            Return to My Bookings
          </span>
        </Button>
      </div>
    </div>
  );
}
