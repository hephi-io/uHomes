import { useState, useEffect } from 'react';
import { Button } from '@uhomes/ui-kit';
import { useParams, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

import Badge from '@/shared/badge';
import LikeButton from '@/shared/like-button';
import { HostelCard } from '@/shared/hostel-card';
import { HostelCardSkeleton } from '@/shared/hostel-card-skeleton';
import { topBadges } from '@/pages/students/constants';
import { SVGs } from '@/assets/svgs/Index';
import HostelImage from '@/assets/pngs/hostel-image-3.png';
import { getPropertyById, getAllProperties, type SavedProperty } from '@/services/property';
import { getPropertyReviews, type Review } from '@/services/review';
import { getBookingByPropertyId, type Booking } from '@/services/booking';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface AvailableRoom {
  id: number;
  description: string;
  price: string;
}

interface ReceiptDetail {
  id: number;
  header: string;
  textOne: string;
  textTwo: string;
}

interface Breakdown {
  id: number;
  name: string;
  value: string;
}

// Helper function to get rating SVG component
const getRatingSVG = (rating: number) => {
  if (rating >= 4.5) return SVGs.FiveStars;
  if (rating >= 4.0) return SVGs.FourAndHalfStars;
  if (rating >= 3.5) return SVGs.FourAndHalfStars;
  if (rating >= 3.0) return SVGs.FourAndHalfStars;
  return SVGs.FourAndHalfStars;
};

// Helper function to format room type
const formatRoomType = (roomType?: SavedProperty['roomType'], price?: number): AvailableRoom[] => {
  if (!roomType || !price) return [];

  const roomTypeLabel =
    roomType === 'single'
      ? 'Single Room'
      : roomType === 'shared'
        ? 'Shared Room (2-person)'
        : 'Self Contain';

  return [
    {
      id: 1,
      description: roomTypeLabel,
      price: new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
      }).format(price),
    },
  ];
};

// Helper function to map amenities object to badges
const getAmenityBadges = (amenities: SavedProperty['amenities']) => {
  if (!amenities) return [];

  const badgesList = [];
  if (typeof amenities === 'object' && !Array.isArray(amenities)) {
    if (amenities.wifi) badgesList.push({ id: 1, Icon: SVGs.Wifi, text: 'WiFi' });
    if (amenities.security) badgesList.push({ id: 2, Icon: SVGs.Security, text: 'Security' });
    if (amenities.parking) badgesList.push({ id: 3, Icon: SVGs.Car, text: 'Parking' });
    if (amenities.power24_7) badgesList.push({ id: 4, Icon: SVGs.Zap, text: 'Power' });
    if (amenities.kitchen) badgesList.push({ id: 5, Icon: SVGs.CheckmarkBadge, text: 'Kitchen' });
    if (amenities.gym) badgesList.push({ id: 6, Icon: SVGs.CheckmarkBadge, text: 'Gym' });
  }

  return badgesList;
};

// Helper function to format receipt details from booking
const formatReceiptDetails = (booking: Booking | null): ReceiptDetail[] => {
  if (!booking) return [];

  const tenant = booking.tenant;
  const agent = typeof booking.agent === 'object' ? booking.agent : null;
  const property = typeof booking.property === 'object' ? booking.property : null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  };

  return [
    {
      id: 1,
      header: 'Sender details',
      textOne: tenant?.fullName || 'N/A',
      textTwo: `${tenant?.phoneNumber || 'N/A'} / Moniepoint MFB`,
    },
    {
      id: 2,
      header: 'Recipient Details',
      textOne: property?.title || 'UHomes property',
      textTwo: agent ? `${agent.phoneNumber} / Paystack Titans` : '0123456789 / Paystack Titans',
    },
    {
      id: 3,
      header: 'Payment Reference',
      textOne: booking._id.slice(-12).toUpperCase(),
      textTwo: '',
    },
    {
      id: 4,
      header: 'Payment Date',
      textOne: formatDate(booking.createdAt),
      textTwo: '',
    },
  ];
};

// Helper function to format breakdown from booking
const formatBreakdown = (booking: Booking | null): Breakdown[] => {
  if (!booking) return [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate breakdown (simplified - adjust based on your business logic)
  const rent = booking.amount * 0.9; // 90% rent
  const serviceCharge = booking.amount * 0.05; // 5% service charge
  const cautionFee = booking.amount * 0.03; // 3% caution fee
  const agreementFee = booking.amount * 0.02; // 2% agreement fee

  return [
    { id: 1, name: 'Rent', value: formatCurrency(rent) },
    { id: 2, name: 'Service charge', value: formatCurrency(serviceCharge) },
    { id: 3, name: 'Caution fee', value: formatCurrency(cautionFee) },
    { id: 4, name: 'Agreement fee (one-time)', value: formatCurrency(agreementFee) },
  ];
};

export function Hostel() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State management
  const [property, setProperty] = useState<SavedProperty | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsTotalPages, setReviewsTotalPages] = useState(1);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [similarProperties, setSimilarProperties] = useState<SavedProperty[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError('Property ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getPropertyById(id);

        if (response.data.status === 'success') {
          setProperty(response.data.data.property);
        } else {
          setError('Failed to fetch property details');
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 404) {
            setError('Property not found');
          } else {
            setError('Failed to fetch property details');
          }
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;

      try {
        setReviewsLoading(true);
        const response = await getPropertyReviews(id, reviewsPage, 10);

        if (response.data.status === 'success') {
          setReviews(response.data.data.reviews);
          setReviewsTotalPages(response.data.data.totalPages);
          setReviewsTotal(response.data.data.total);
          setAverageRating(response.data.data.averageRating);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id, reviewsPage]);

  // Fetch similar properties
  useEffect(() => {
    const fetchSimilarProperties = async () => {
      if (!property) return;

      try {
        const priceRange = property.price || 0;
        const minPrice = Math.max(0, priceRange * 0.8); // 20% below
        const maxPrice = priceRange * 1.2; // 20% above

        const response = await getAllProperties({
          page: 1,
          limit: 4,
          location: property.location,
          minPrice,
          maxPrice,
        });

        if (response.data.status === 'success') {
          // Exclude current property
          const filtered = response.data.data.properties.filter((p) => p._id !== id);
          setSimilarProperties(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching similar properties:', err);
      }
    };

    fetchSimilarProperties();
  }, [property, id]);

  // Fetch booking for receipt
  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;

      try {
        const bookingData = await getBookingByPropertyId(id);
        setBooking(bookingData);
      } catch (err) {
        console.error('Error fetching booking:', err);
      }
    };

    fetchBooking();
  }, [id]);

  const handleGoBack = () => {
    navigate('/students/hostels');
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (!property?.images || property.images.length === 0) return;

    if (direction === 'prev') {
      setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
    } else {
      setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) {
    return (
      <>
        <div className="flex gap-x-9 items-center pl-4 md:pl-8 mt-5 md:mt-0 lg:mt-5">
          <Button
            variant="outline"
            className="w-11 h-11 rounded-full border border-[#E5E5E5] p-0 cursor-pointer"
            onClick={handleGoBack}
          >
            <SVGs.ChevronLeft />
          </Button>
          <h1 className="font-semibold text-base leading-[120%] tracking-[0%] text-black">
            Find Hostels
          </h1>
        </div>
        <div className="border-t border-t-[#E4E4E4] mt-5"></div>
        <div className="lg:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 p-4 lg:p-0 mt-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <HostelCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <div className="flex gap-x-9 items-center pl-4 md:pl-8 mt-5 md:mt-0 lg:mt-5">
          <Button
            variant="outline"
            className="w-11 h-11 rounded-full border border-[#E5E5E5] p-0 cursor-pointer"
            onClick={handleGoBack}
          >
            <SVGs.ChevronLeft />
          </Button>
          <h1 className="font-semibold text-base leading-[120%] tracking-[0%] text-black">
            Find Hostels
          </h1>
        </div>
        <div className="border-t border-t-[#E4E4E4] mt-5"></div>
        <div className="lg:p-8">
          <div className="text-center py-12">
            <p className="text-red-500">{error || 'Property not found'}</p>
            <Button onClick={handleGoBack} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </>
    );
  }

  const availableRooms = formatRoomType(property.roomType, property.price);
  const amenityBadges = getAmenityBadges(property.amenities);
  const receiptDetailsData = formatReceiptDetails(booking);
  const breakdownsData = formatBreakdown(booking);
  const propertyImages = property.images && property.images.length > 0 ? property.images : [];
  const mainImage = propertyImages[currentImageIndex]?.url || HostelImage;

  return (
    <>
      <div className="flex gap-x-9 items-center pl-4 md:pl-8 mt-5 md:mt-0 lg:mt-5">
        <Button
          variant="outline"
          className="w-11 h-11 rounded-full border border-[#E5E5E5] p-0 cursor-pointer"
          onClick={handleGoBack}
        >
          <SVGs.ChevronLeft />
        </Button>

        <h1 className="font-semibold text-base leading-[120%] tracking-[0%] text-black">
          Find Hostels
        </h1>
      </div>

      <div className="border-t border-t-[#E4E4E4] mt-5"></div>

      <div className="lg:p-8">
        <div className="lg:flex lg:gap-x-[25px] justify-between lg:items-start">
          <div className="lg:w-[68.09%] lg:grow">
            <div className="flex justify-between mt-12 lg:mt-3">
              <div>
                <h1 className="font-semibold text-xl leading-[120%] tracking-[0%] text-black">
                  {property.title}
                </h1>
                <div className="flex gap-x-1.5 items-center mt-2">
                  <SVGs.Location />
                  <span className="text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B]">
                    {property.location}
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-10 h-10 rounded-full border border-[#E5E5E5]">
                <SVGs.Share />
              </Button>
            </div>
            <div className="relative h-[505px] rounded overflow-hidden mt-4">
              <img src={mainImage} alt={property.title} className="w-full h-full object-cover" />
              <div className="absolute left-4 right-4 top-3.5 flex justify-between items-center">
                <div className="flex gap-x-1.5 items-center">
                  {topBadges.map((topBadge) => (
                    <Badge key={topBadge.id} Icon={topBadge.Icon} text={topBadge.text} />
                  ))}
                </div>
                {(property?._id || id) && <LikeButton propertyId={property?._id || id || ''} />}
              </div>
            </div>
            {propertyImages.length > 1 && (
              <div className="flex justify-between items-center px-5 mt-2">
                <Button
                  variant="ghost"
                  className="w-fit p-0 m-0"
                  onClick={() => handleImageNavigation('prev')}
                >
                  <SVGs.ChevronLeft />
                </Button>
                <div className="flex gap-x-2">
                  {propertyImages.slice(0, 4).map((image, i) => (
                    <div
                      key={i}
                      className={`relative w-19.5 h-19.5 rounded overflow-hidden md:w-39.5 md:h-24 cursor-pointer ${
                        i === currentImageIndex ? 'border-[1.5px] border-[#141B34]' : ''
                      } ${i === 1 ? 'hidden md:block' : ''}`}
                      onClick={() => setCurrentImageIndex(i)}
                    >
                      <img src={image.url} alt="" className="w-full h-full object-cover" />
                      {i === 3 && propertyImages.length > 4 && (
                        <div className="absolute left-0 right-0 top-0 bottom-0 justify-center items-center bg-[#000000CC] flex">
                          <span className="font-medium text-xs leading-[100%] tracking-[0%] align-middle text-white">
                            +{propertyImages.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="w-fit p-0 m-0"
                  onClick={() => handleImageNavigation('next')}
                >
                  <SVGs.ChevronLeft className="rotate-180" />
                </Button>
              </div>
            )}
            <h2 className="font-semibold text-base leading-[150%] tracking-[0%] text-black mt-6 md:mt-9">
              Description
            </h2>
            <p className="text-sm leading-[150%] tracking-[0%] text-black mt-3">
              {property.description}
            </p>
            <h2 className="font-semibold text-base leading-[150%] tracking-[0%] text-black mt-4 lg:mt-9">
              Available Rooms
            </h2>
            {availableRooms.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 md:w-[73.74%] md:grid-cols-2 mt-3">
                {availableRooms.map((availableRoom) => (
                  <div key={availableRoom.id} className="rounded-md border border-[#EAEAEA] p-2">
                    <span className="text-xs leading-[100%] tracking-[0%] text-[#71717A]">
                      {availableRoom.description}
                    </span>
                    <div className="leading-[100%] tracking-[0%] mt-4">
                      <span className="font-semibold text-xl text-[#09090B]">
                        {availableRoom.price}
                      </span>{' '}
                      <span className="text-sm text-[#71717A]">per semester</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#71717A] mt-3">No room types available</p>
            )}
            <h2 className="font-semibold text-base leading-[150%] tracking-[0%] text-black mt-4 lg:mt-9">
              Amenities:
            </h2>
            {amenityBadges.length > 0 ? (
              <div className="flex gap-2 mt-3">
                {amenityBadges.map((badge) => (
                  <Badge key={badge.id} Icon={badge.Icon} text={badge.text} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#71717A] mt-3">No amenities listed</p>
            )}
            <Button
              className="w-full h-[37px] gap-x-2 rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] px-4 py-2 mt-4 lg:mt-9"
              onClick={() => navigate('/students/booking', { state: { propertyId: id } })}
            >
              <SVGs.PropertyAdd />
              <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
                Book Now
              </span>
            </Button>
            {booking && (
              <AlertDialog>
                <AlertDialogTrigger className="w-full mt-4">
                  <Button
                    variant="outline"
                    className="w-full h-10 gap-x-2 rounded-lg border-[#DCDCDC] bg-[#F8F8F9]"
                  >
                    <SVGs.Invoice />
                    <span className="font-medium text-sm leading-[150%] tracking-[0%] text-[#09090B]">
                      View Receipt
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[510px] max-h-screen rounded-[10px] bg-white gap-0 p-6 overflow-y-scroll">
                  <AlertDialogHeader className="gap-0">
                    <AlertDialogTitle className="flex gap-x-2 justify-center items-center">
                      <SVGs.UHome />
                      <span className="font-bold text-lg leading-6 tracking-normal align-middle text-[#1F1E1E]">
                        HOMES
                      </span>
                    </AlertDialogTitle>
                    <div className="border-t-[0.5px] border-t-[#DCDCDC] mt-2" />
                    <AlertDialogDescription className="mt-3">
                      <h1 className="font-medium text-lg leading-7 tracking-[0%] text-black text-center">
                        Booking Payment Receipt
                      </h1>
                      <div className="font-medium text-2xl leading-7 tracking-[0%] text-black text-center mt-4">
                        {formatCurrency(booking.amount)}
                      </div>
                      <div className="w-fit flex gap-x-2.5 items-center rounded-md bg-[#1DB4691F] px-2 py-0.5 mx-auto mt-4">
                        <div className="size-2 rounded-full bg-[#11A75C]" />
                        <span className="text-sm leading-5.5 tracking-[0%] text-[#11A75C]">
                          {booking.paymentStatus === 'paid' ? 'Successful' : booking.paymentStatus}
                        </span>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="bg-[#F9FBFF] p-4 mt-6">
                    {receiptDetailsData.map((receiptDetail) => (
                      <div key={receiptDetail.id} className={receiptDetail.id === 1 ? '' : 'mt-6'}>
                        <h4 className="font-light text-sm leading-[100%] tracking-[0%] text-[#727272]">
                          {receiptDetail.header}
                        </h4>
                        <div className="flex gap-x-2.5 items-center font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-2">
                          <span>{receiptDetail.textOne}</span>
                          <span
                            className={
                              receiptDetail.id === 3 || receiptDetail.id === 4 ? 'hidden' : ''
                            }
                          >
                            -
                          </span>
                          <span
                            className={
                              receiptDetail.id === 3 || receiptDetail.id === 4 ? 'hidden' : ''
                            }
                          >
                            {receiptDetail.textTwo}
                          </span>
                          <Button
                            variant="ghost"
                            className={`size-4 ${receiptDetail.id === 3 ? '' : 'hidden'}`}
                            onClick={() => {
                              navigator.clipboard.writeText(receiptDetail.textOne);
                            }}
                          >
                            <SVGs.Copy />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-t-[#DCDCDC] mt-6" />
                    <h3 className="font-medium text-sm leading-6 tracking-[0%] align-middle text-[#09090B] text-center mt-6">
                      Cost breakdown
                    </h3>
                    {breakdownsData.map((breakdown) => (
                      <div key={breakdown.id} className="flex justify-between items-center mt-4">
                        <span className="font-medium text-sm leading-7 tracking-[0%] align-middle text-[#09090B]">
                          {breakdown.name}
                        </span>
                        <span className="text-sm leading-7 tracking-[0%] text-right align-middle text-[#09090B]">
                          {breakdown.value}
                        </span>
                      </div>
                    ))}
                    {booking.moveOutDate && (
                      <div className="flex gap-x-2.5 rounded-lg bg-[#EFF3FD] px-3 py-2 mt-6">
                        <SVGs.Exclamation />
                        <div>
                          <h3 className="font-semibold text-sm leading-[150%] tracking-[0%] align-middle text-[#3E78FF]">
                            Rent is due in {booking.duration}
                          </h3>
                          <p className="text-sm leading-[120%] tracking-[0%] align-middle text-[#3E78FF] mt-2.5">
                            Your current rent expires on {formatDate(booking.moveOutDate)}. Renew
                            early to keep your room secured.
                          </p>
                        </div>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="w-full h-10 gap-x-2 rounded-[5px] border-[#E4E4E4] mt-4"
                    >
                      <SVGs.CreditCard />
                      <span className="font-medium text-sm leading-[150%] tracking-[0%] text-[#141B34]">
                        Renew
                      </span>
                    </Button>
                  </div>
                  <AlertDialogFooter className="mt-15">
                    <AlertDialogCancel className="h-[37px] rounded-md border border-[#E5E5E5] md:w-[131px]">
                      <span className="font-medium text-sm leading-[100%] tracking-[0%] text-[#09090B]">
                        Close
                      </span>
                    </AlertDialogCancel>
                    <AlertDialogAction className="h-[37px] rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] px-4">
                      <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
                        Download Receipt
                      </span>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <div className="rounded-[10px] border border-[#93A2C30D] shadow-[1px_1px_8px_0px_#00000014] lg:w-[30.07%] lg:max-w-[409px] lg:shrink-0 p-10 pt-3 md:px-4 lg:px-10 lg:pt-3 lg:pb-10 mt-[41px] lg:mt-0">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-lg leading-[100%] tracking-[0%] text-black">
                Students Review
              </h1>
              <div className="flex gap-x-1 items-center">
                <SVGs.StarHalf />
                <div className="text-sm leading-[100%] tracking-[0%] align-middle">
                  <span className="font-semibold">{averageRating.toFixed(1)}</span>{' '}
                  <span>({reviewsTotal})</span>
                </div>
              </div>
            </div>
            {reviewsLoading ? (
              <div className="mt-8">
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : reviews.length > 0 ? (
              <>
                {reviews.map((review, index) => {
                  const user = typeof review.userId === 'object' ? review.userId : null;
                  const RatingComponent = getRatingSVG(review.rating);
                  return (
                    <div key={review._id} className={index === 0 ? 'mt-8' : 'mt-12'}>
                      <div className="flex gap-x-4 items-center">
                        <span className="text-sm leading-[100%] tracking-[0%] text-[#09090B]">
                          {user?.fullName || 'Anonymous'}
                        </span>
                        <SVGs.Dot />
                        <span className="text-xs leading-[100%] tracking-[0%] text-[#AFAFAF]">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <RatingComponent className="mt-2.5" />
                      <p className="text-sm leading-[100%] tracking-[0%] text-[#AFAFAF] mt-2.5">
                        {review.comment}
                      </p>
                    </div>
                  );
                })}
                {reviewsTotalPages > 1 && (
                  <div className="w-fit flex gap-x-5 items-center lg:w-full mx-auto mt-8">
                    <Button
                      variant="ghost"
                      onClick={() => setReviewsPage((p) => Math.max(1, p - 1))}
                      disabled={reviewsPage === 1}
                    >
                      <SVGs.ChevronLeft />
                    </Button>

                    <div className="flex gap-x-6 items-center lg:gap-x-0">
                      {Array.from({ length: Math.min(reviewsTotalPages, 5) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant="secondary"
                            className={`group size-11 rounded-full ${
                              reviewsPage === pageNum ? 'bg-[#3E78FF]' : 'bg-[#F7F7F7]'
                            }`}
                            onClick={() => setReviewsPage(pageNum)}
                          >
                            <span
                              className={`text-base leading-[150%] tracking-[0%] align-middle group-hover:text-black ${
                                reviewsPage === pageNum ? 'text-white' : 'text-[#737373]'
                              }`}
                            >
                              {pageNum}
                            </span>
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => setReviewsPage((p) => Math.min(reviewsTotalPages, p + 1))}
                      disabled={reviewsPage === reviewsTotalPages}
                    >
                      <SVGs.ChevronLeft className="rotate-180" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-[#AFAFAF] mt-8">No reviews yet</p>
            )}
          </div>
        </div>

        <h1 className="font-semibold text-lg leading-[150%] tracking-[0%] text-black mt-20">
          Hostels Like This
        </h1>

        {similarProperties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] md:grid-cols-2 lg:grid-cols-3 lg:gap-12 lg:border-none lg:bg-inherit p-4 lg:p-0 mt-4">
            {similarProperties.map((similarProperty) => (
              <div
                key={similarProperty._id}
                className="rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] md:border-none p-4 md:p-0"
              >
                <HostelCard property={similarProperty} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] p-4 mt-4">
            <p className="text-center text-[#878FA1] py-8">No similar properties found</p>
          </div>
        )}
      </div>
    </>
  );
}
