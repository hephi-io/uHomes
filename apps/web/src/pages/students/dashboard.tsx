import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@uhomes/ui-kit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@uhomes/ui-kit';
import { HostelCard } from '@/shared/hostel-card';
import { SVGs } from '@/assets/svgs/Index';
import NoBookings from '@/assets/pngs/no-bookings.png';
import HostelImageTwo from '@/assets/pngs/hostel-image-2.png';
import { useAuth } from '@/contexts/auth-context';
import { getActiveBookingsSummary, getMyBookings, type Booking } from '@/services/booking';
import { getSavedProperties, type SavedProperty } from '@/services/property';

export function StudentDashboard() {
  const { user } = useAuth();
  const [activeBookingsCount, setActiveBookingsCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [bookingsTotalPages, setBookingsTotalPages] = useState(1);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [savedPropertiesPage, setSavedPropertiesPage] = useState(1);
  const [savedPropertiesTotalPages, setSavedPropertiesTotalPages] = useState(1);
  const [savedPropertiesLoading, setSavedPropertiesLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      setSummaryLoading(true);
      try {
        const response = await getActiveBookingsSummary();
        if (response.data.status === 'success') {
          setActiveBookingsCount(response.data.data.count);
          setTotalSpent(response.data.data.totalAmount);
        }
      } catch (error) {
        console.error('Error fetching active bookings summary:', error);
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      setBookingsLoading(true);
      try {
        const response = await getMyBookings(bookingsPage, 10);
        if (response.data.status === 'success') {
          setBookings(response.data.data.bookings);
          setBookingsTotalPages(response.data.data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, [bookingsPage]);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      setSavedPropertiesLoading(true);
      try {
        const response = await getSavedProperties(savedPropertiesPage, 10);
        if (response.data.status === 'success') {
          setSavedProperties(response.data.data.properties);
          setSavedPropertiesTotalPages(response.data.data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching saved properties:', error);
      } finally {
        setSavedPropertiesLoading(false);
      }
    };

    fetchSavedProperties();
  }, [savedPropertiesPage]);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      id: 1,
      cardStyle: 'border-[#BFF0FC] from-[#D8F6FF] mt-6 md:mt-0',
      headingTwo: 'Active Bookings',
      Icon: SVGs.Note,
      number: summaryLoading ? '...' : activeBookingsCount.toString(),
      headingThree: 'Awaiting review',
    },
    {
      id: 2,
      cardStyle: 'border-[#BCF5D5] from-[#C8FFDC] mt-4 md:mt-0',
      headingTwo: 'Total Spent',
      Icon: SVGs.MoneyBag,
      number: summaryLoading ? '...' : formatCurrency(totalSpent),
      headingThree: 'Paid bookings',
    },
  ];

  const tabTriggers = [
    { id: 1, name: 'My Bookings' },
    { id: 2, name: 'Saved Properties' },
  ];

  const funnelIcons = [
    {
      id: 1,
      Icon: SVGs.FunnelSimpleTwo,
      label: 'Sort By',
    },
    {
      id: 2,
      Icon: SVGs.Funnel,
      label: 'Filter',
    },
  ];

  return (
    <>
      <h1 className="hidden lg:block lg:font-semibold lg:text-2xl lg:leading-[120%] lg:tracking-[0%] lg:text-black lg:px-8 lg:py-5">
        Dashboard
      </h1>

      <div className="hidden lg:block lg:border-t lg:border-[#E4E4E4]"></div>

      <div className="lg:p-8 lg:pt-11">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-4 items-center">
            <SVGs.ProfilePic />

            <div>
              <h1 className="font-semibold text-xl leading-[120%] tracking-[0%] text-[#000000] md:text-[22px]">
                Hi, {user?.fullName} 👋🏽
              </h1>

              <p className="text-[13px] leading-[120%] tracking-[0%] text-[#000000] md:text-sm mt-1">
                Ready to find your next hostel?
              </p>
            </div>
          </div>

          <div className="w-10 h-10 flex justify-center items-center rounded-full border border-[#00000033] bg-[#F8F8F8] lg:hidden">
            <SVGs.Notification />
          </div>
        </div>
        <div className="hidden lg:block lg:border-t lg:border-[#E4E4E4] lg:mt-8"></div>
        <div className="md:grid md:grid-cols-2 md:gap-x-4 lg:w-[696px] md:mt-9 lg:mt-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`h-[200px] flex flex-col justify-between rounded border bg-linear-to-b to-[#FFFFFF] ${card.cardStyle} p-6`}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-sm leading-[150%] tracking-[0%] text-[#727272]">
                  {card.headingTwo}
                </h2>
                <div className="w-10 h-10 flex justify-center items-center rounded bg-white">
                  <card.Icon />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-2xl leading-[100%] tracking-[0%] text-[#09090B]">
                  {card.number}
                </h1>
                <h3 className="text-[13px] leading-[100%] tracking-[0%] text-[#71717A] mt-2.5">
                  {card.headingThree}
                </h3>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[#E4E7EC] bg-white shadow-[0px_1px_2px_0px_#1018280D] lg:p-0 mt-4 md:mt-9 lg:mt-4">
          <div className="flex justify-between items-center md:hidden px-4 pt-4">
            <div className="flex gap-x-2 items-center">
              {funnelIcons.map((funnelIcon) => (
                <Button
                  key={funnelIcon.id}
                  variant="outline"
                  className="h-8 rounded border border-[#E4E4E4] bg-white px-3"
                >
                  <funnelIcon.Icon />
                </Button>
              ))}
            </div>
            <FindHostels />
          </div>
          <Tabs defaultValue="My Bookings" className="gap-0 mt-4 md:mt-0">
            <div className="md:flex md:justify-between md:items-center px-4 md:pt-4">
              <TabsList className="w-full h-10 rounded-md bg-[#F4F4F5] md:w-[316px] p-1 m-0">
                {tabTriggers.map((tabTrigger) => (
                  <TabsTrigger
                    key={tabTrigger.id}
                    value={tabTrigger.name}
                    className="data-[state=active]:rounded data-[state=active]:bg-white data-[state=active]:shadow-[0px_1px_3px_0px_#0000001A,0px_1px_2px_-1px_#0000001A] data-[state=active]:text-[#09090B] font-medium text-sm leading-5 tracking-[0%] text-center align-middle text-[#71717A]"
                  >
                    {tabTrigger.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="hidden md:flex md:gap-x-4 md:items-center">
                {funnelIcons.map((funnelIcon) => (
                  <Button
                    key={funnelIcon.id}
                    variant="outline"
                    className="h-[37px] gap-x-2 items-center rounded border border-[#E4E4E4] bg-white px-3"
                  >
                    <funnelIcon.Icon />
                    <span className="font-medium text-sm leading-[150%] tracking-[0%] text-black">
                      {funnelIcon.label}
                    </span>
                  </Button>
                ))}
                <FindHostels />
              </div>
            </div>

            <div className="hidden lg:block lg:border-t lg:border-t-[#E4E7EC] lg:mt-4"></div>

            <TabsContent value="My Bookings">
              {bookingsLoading ? (
                <div className="px-4 pb-4 lg:pt-4">
                  <div className="rounded border border-[#F4F4F4] bg-[#FDFDFD] p-6 mt-4 lg:mt-0">
                    <p className="text-center text-[#878FA1]">Loading bookings...</p>
                  </div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="px-4 pb-4 lg:pt-4">
                  <div className="rounded border border-[#F4F4F4] bg-[#FDFDFD] md:h-[475px] md:flex md:flex-col md:items-center md:justify-center lg:h-[390px] p-6 mt-4 lg:m-0">
                    <img
                      src={NoBookings}
                      alt=""
                      className="w-full md:w-[364.52px] md:h-40 lg:w-[364.62px]"
                    />
                    <p className="w-fit font-medium text-sm leading-5 tracking-[0%] text-[#878FA1] mx-auto mt-9">
                      You currently have no bookings
                    </p>
                    <div className="w-fit mx-auto mt-6 md:mt-8">
                      <FindHostels />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-scroll lg:overflow-hidden px-4 pb-4 lg:pt-4">
                    <div className="w-[1337px] grid grid-cols-1 gap-4 rounded border border-[#F4F4F4] bg-[#FDFDFD] lg:w-full p-4 mt-4 lg:mt-0">
                      {bookings.map((booking) => (
                        <HostelDetail key={booking._id} booking={booking} />
                      ))}
                    </div>
                  </div>
                  {bookingsTotalPages > 1 && (
                    <div className="flex justify-center items-center gap-x-2 px-4 pb-4">
                      <Button
                        variant="outline"
                        onClick={() => setBookingsPage((p) => Math.max(1, p - 1))}
                        disabled={bookingsPage === 1}
                        className="px-4"
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-[#71717A]">
                        Page {bookingsPage} of {bookingsTotalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setBookingsPage((p) => Math.min(bookingsTotalPages, p + 1))}
                        disabled={bookingsPage === bookingsTotalPages}
                        className="px-4"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="Saved Properties">
              {savedPropertiesLoading ? (
                <div className="rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] p-4">
                  <p className="text-center text-[#878FA1]">Loading saved properties...</p>
                </div>
              ) : savedProperties.length === 0 ? (
                <div className="px-4 pb-4 lg:pt-4">
                  <div className="rounded border border-[#F4F4F4] bg-[#FDFDFD] md:h-[475px] md:flex md:flex-col md:items-center md:justify-center lg:h-[390px] p-6 mt-4 lg:m-0">
                    <img
                      src={NoBookings}
                      alt=""
                      className="w-full md:w-[364.52px] md:h-40 lg:w-[364.62px]"
                    />
                    <p className="w-fit font-medium text-sm leading-5 tracking-[0%] text-[#878FA1] mx-auto mt-9">
                      You have no saved properties
                    </p>
                    <div className="w-fit mx-auto mt-6 md:mt-8">
                      <FindHostels />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 p-4">
                    {savedProperties.map((property) => (
                      <HostelCard key={property._id} property={property} />
                    ))}
                  </div>
                  {savedPropertiesTotalPages > 1 && (
                    <div className="flex justify-center items-center gap-x-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setSavedPropertiesPage((p) => Math.max(1, p - 1))}
                        disabled={savedPropertiesPage === 1}
                        className="px-4"
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-[#71717A]">
                        Page {savedPropertiesPage} of {savedPropertiesTotalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setSavedPropertiesPage((p) => Math.min(savedPropertiesTotalPages, p + 1))
                        }
                        disabled={savedPropertiesPage === savedPropertiesTotalPages}
                        className="px-4"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

function FindHostels() {
  const navigate = useNavigate();

  const handleFindHostels = () => {
    navigate('/students/hostels');
  };

  return (
    <Button
      onClick={handleFindHostels}
      className="h-[37px] gap-x-2 rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] px-4 cursor-pointer"
    >
      <SVGs.Building />
      <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
        Find Hostels
      </span>
    </Button>
  );
}

function HostelDetail({ booking }: { booking: Booking }) {
  const hostelDetailButtons = [
    { id: 1, Icon: SVGs.View, text: 'View Property' },
    { id: 2, Icon: SVGs.Download, text: 'Download Receipt' },
    { id: 3, Icon: SVGs.Contact, text: 'Contact Agent' },
  ];

  const property = typeof booking.property === 'object' ? booking.property : null;
  const agent = typeof booking.agent === 'object' ? booking.agent : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-[#08AF4E4D] text-[#026F2F]';
      case 'pending':
        return 'bg-[#FEF3C74D] text-[#92400E]';
      case 'cancelled':
        return 'bg-[#FEE2E24D] text-[#991B1B]';
      case 'completed':
        return 'bg-[#E0E7FF4D] text-[#3730A3]';
      default:
        return 'bg-[#F3F4F64D] text-[#374151]';
    }
  };

  const images = property?.images || [];
  const mainImage = images[0]?.url || HostelImageTwo;
  const thumbnailImages = images.slice(1, 5);
  const remainingImages = images.length - 5;

  return (
    <div className="border border-[#F4F4F4] bg-white p-4">
      <div className="flex gap-x-20 justify-between">
        <div className="w-[140px] shrink-0">
          <div className="h-20 rounded overflow-hidden">
            <img
              src={mainImage}
              alt={property?.title || 'Property'}
              className="w-full h-full object-cover"
            />
          </div>
          {thumbnailImages.length > 0 && (
            <div className="h-8 grid grid-cols-4 gap-1 mt-1">
              {thumbnailImages.map((img, i) => (
                <div key={i} className="relative h-full rounded overflow-hidden">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  {i === thumbnailImages.length - 1 && remainingImages > 0 && (
                    <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center bg-[#000000CC]">
                      <span className="font-medium text-xs leading-[100%] tracking-[0%] align-middle text-white">
                        +{remainingImages}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-full grid grid-cols-4 gap-x-20">
          <div>
            <span className="text-xs leading-[100%] tracking-[0%] align-middle text-[#09090B]">
              Booking ID
            </span>
            <h1 className="font-semibold text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B] mt-1">
              {booking._id.slice(-8).toUpperCase()}
            </h1>
          </div>
          <div>
            <span className="text-xs leading-[100%] tracking-[0%] align-middle text-[#09090B]">
              Apartment
            </span>
            <h1 className="font-semibold text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B] mt-1">
              {property?.title || 'N/A'}
            </h1>
          </div>
          <div>
            <span className="text-xs leading-[100%] tracking-[0%] align-middle text-[#09090B]">
              Designated Agent
            </span>
            <h1 className="font-semibold text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B] mt-1">
              {agent?.fullName || 'N/A'}
            </h1>
          </div>
          <div>
            <span className="text-xs leading-[100%] tracking-[0%] align-middle text-[#09090B]">
              Location
            </span>
            <div className="flex gap-x-1.5 items-center mt-1">
              <SVGs.Location />
              <h1 className="font-semibold text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B]">
                {property?.location || 'N/A'}
              </h1>
            </div>
          </div>
          <div>
            <span className="text-xs leading-[100%] tracking-[0%] align-middle text-[#09090B]">
              Duration
            </span>
            <h1 className="font-semibold text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B] mt-1">
              {booking.duration}
            </h1>
          </div>
          <div>
            <span className="text-xs leading-[100%] tracking-[0%] align-middle text-[#09090B]">
              Move-Out Date
            </span>
            <h1 className="font-semibold text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B] mt-1">
              {booking.moveOutDate ? formatDate(booking.moveOutDate) : 'N/A'}
            </h1>
          </div>
          <div>
            <span className="text-xs leading-[100%] tracking-[0%] align-middle text-[#09090B]">
              Move-in Date
            </span>
            <h1 className="font-semibold text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B] mt-1">
              {formatDate(booking.moveInDate)}
            </h1>
          </div>
        </div>
        <div className="w-fit">
          <h1 className="font-bold text-xl leading-[100%] tracking-[0%] text-[#09090B]">
            {formatCurrency(booking.amount)}
          </h1>
          <div
            className={`h-7 flex justify-center items-center rounded-full px-4 mt-1 ${getStatusColor(booking.status)}`}
          >
            <span className="text-[13px] leading-[100%] tracking-[0%] capitalize">
              {booking.status}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-x-2 items-center mt-12">
        {hostelDetailButtons.map((hostelDetailButton) => (
          <Button
            key={hostelDetailButton.id}
            variant="outline"
            className="gap-x-2 rounded-lg border border-[#DCDCDC] bg-[#F8F8F9] px-4 py-2"
          >
            <hostelDetailButton.Icon />
            <span className="font-medium text-xs leading-[150%] tracking-[0%] text-[#3D3D3D]">
              {hostelDetailButton.text}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
