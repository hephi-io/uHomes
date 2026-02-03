import { useState, useEffect, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@uhomes/ui-kit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@uhomes/ui-kit';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@uhomes/ui-kit';
import { HostelCard } from '@/shared/hostel-card';
import { SVGs } from '@/assets/svgs/Index';
import NoBookings from '@/assets/pngs/no-bookings.png';
import HostelImageTwo from '@/assets/pngs/hostel-image-2.png';
import { useAuth } from '@/contexts/auth-context';
import { useNotifications } from '@/contexts/NotificationContext';
import { getActiveBookingsSummary, getMyBookings, type Booking } from '@/services/booking';
import { getSavedProperties, type SavedProperty } from '@/services/property';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { formatReceiptDetails, formatBreakdown } from '@/pages/students/constants';
import { toast } from 'sonner';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const staggerItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

// Sort and filter options
const BOOKING_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'move-in-date', label: 'Move-in Date' },
];

const BOOKING_FILTER_OPTIONS = [
  { value: 'all', label: 'All Bookings' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const SAVED_PROPERTY_SORT_OPTIONS = [
  { value: 'newest', label: 'Recently Saved' },
  { value: 'oldest', label: 'Oldest Saved' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'rating', label: 'Highest Rated' },
];

export function StudentDashboard() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
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

  // Sort and filter states
  const [bookingSortBy, setBookingSortBy] = useState('newest');
  const [bookingFilterStatus, setBookingFilterStatus] = useState('all');
  const [savedPropertySortBy, setSavedPropertySortBy] = useState('newest');
  const [activeTab, setActiveTab] = useState('My Bookings');

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

  // Client-side filtering and sorting
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = [...bookings];

    // Apply status filter
    if (bookingFilterStatus !== 'all') {
      filtered = filtered.filter((booking) => booking.status === bookingFilterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (bookingSortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-high':
          return b.amount - a.amount;
        case 'price-low':
          return a.amount - b.amount;
        case 'move-in-date':
          return new Date(a.moveInDate).getTime() - new Date(b.moveInDate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [bookings, bookingSortBy, bookingFilterStatus]);

  const filteredAndSortedSavedProperties = useMemo(() => {
    const filtered = [...savedProperties];

    // Apply sorting
    filtered.sort((a, b) => {
      switch (savedPropertySortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [savedProperties, savedPropertySortBy]);

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

  return (
    <>
      <h1 className="hidden lg:block lg:font-semibold lg:text-2xl lg:leading-[120%] lg:tracking-[0%] lg:text-black lg:px-8 lg:py-5">
        Dashboard
      </h1>

      <div className="hidden lg:block lg:border-t lg:border-[#E4E4E4]"></div>

      <div className="lg:p-8 lg:pt-11">
        <motion.div
          className="flex justify-between items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex gap-x-4 items-center" variants={itemVariants}>
            <div className="size-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.fullName || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <SVGs.ProfilePicSmall />
              )}
            </div>
            <div>
              <h1 className="font-semibold text-xl leading-[120%] tracking-[0%] text-[#000000] md:text-[22px]">
                Hi, {user?.fullName} 👋🏽
              </h1>

              <p className="text-[13px] leading-[120%] tracking-[0%] text-[#000000] md:text-sm mt-1">
                Ready to find your next hostel?
              </p>
            </div>
          </motion.div>

          <NavLink to="/students/notifications" className="size-fit">
            <motion.div
              className="relative w-10 h-10 flex justify-center items-center rounded-full border border-[#00000033] bg-[#F8F8F8] lg:hidden"
              variants={itemVariants}
            >
              <SVGs.Notification />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#3E78FF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
            </motion.div>
          </NavLink>
        </motion.div>
        <div className="hidden lg:block lg:border-t lg:border-[#E4E4E4] lg:mt-8"></div>
        <motion.div
          className="md:grid md:grid-cols-2 md:gap-x-4 lg:w-[696px] md:mt-9 lg:mt-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              className={`h-[200px] flex flex-col justify-between rounded border bg-linear-to-b to-[#FFFFFF] ${card.cardStyle} p-6`}
              variants={itemVariants}
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
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="rounded-xl border border-[#E4E7EC] bg-white shadow-[0px_1px_2px_0px_#1018280D] lg:p-0 mt-4 md:mt-9 lg:mt-4"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex justify-between items-center md:hidden px-4 pt-4"
            variants={itemVariants}
          >
            <div className="flex gap-x-2 items-center">
              {activeTab === 'My Bookings' ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="group h-8 rounded border border-[#E4E4E4] bg-white px-3"
                      >
                        <SVGs.FunnelSimpleTwo />
                        <span className="font-medium text-sm leading-[150%] tracking-[0%] text-black hidden group-hover:inline-block">
                          Sort By
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {BOOKING_SORT_OPTIONS.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => setBookingSortBy(option.value)}
                          className={bookingSortBy === option.value ? 'bg-accent' : ''}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="group h-8 rounded border border-[#E4E4E4] bg-white px-3"
                      >
                        <SVGs.Funnel />
                        <span className="font-medium text-sm leading-[150%] tracking-[0%] text-black hidden group-hover:inline-block">
                          Filter
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {BOOKING_FILTER_OPTIONS.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => setBookingFilterStatus(option.value)}
                          className={bookingFilterStatus === option.value ? 'bg-accent' : ''}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="group h-[37px] gap-x-2 items-center rounded border border-[#E4E4E4] bg-white transition-all duration-300 ease-in-out px-3"
                    >
                      <SVGs.FunnelSimpleTwo />
                      <span className="font-medium text-sm leading-[150%] tracking-[0%] text-black hidden group-hover:inline-block">
                        Sort By
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {SAVED_PROPERTY_SORT_OPTIONS.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setSavedPropertySortBy(option.value)}
                        className={savedPropertySortBy === option.value ? 'bg-accent' : ''}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <FindHostels />
          </motion.div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0 mt-4 md:mt-0">
            <div className="md:flex md:justify-between md:items-center px-4 md:pt-4">
              <TabsList className="w-full h-10 rounded-md bg-[#F4F4F5] md:w-[316px] p-1 m-0">
                {tabTriggers.map((tabTrigger) => (
                  <TabsTrigger
                    key={tabTrigger.id}
                    value={tabTrigger.name}
                    className="data-[state=active]:rounded data-[state=active]:bg-white data-[state=active]:shadow-[0px_1px_3px_0px_#0000001A,0px_1px_2px_-1px_#0000001A] data-[state=active]:text-[#09090B] font-Bricolage font-medium text-sm leading-5 tracking-[0%] text-center align-middle text-[#71717A]"
                  >
                    {tabTrigger.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="hidden md:flex md:gap-x-4 md:items-center">
                {activeTab === 'My Bookings' ? (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-[37px] gap-x-2 items-center rounded border border-[#E4E4E4] bg-white px-3"
                        >
                          <SVGs.FunnelSimpleTwo />
                          <span className="font-medium text-sm leading-[150%] tracking-[0%] text-black">
                            Sort By
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {BOOKING_SORT_OPTIONS.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => setBookingSortBy(option.value)}
                            className={bookingSortBy === option.value ? 'bg-accent' : ''}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-[37px] gap-x-2 items-center rounded border border-[#E4E4E4] bg-white px-3"
                        >
                          <SVGs.Funnel />
                          <span className="font-medium text-sm leading-[150%] tracking-[0%] text-black">
                            Filter
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {BOOKING_FILTER_OPTIONS.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => setBookingFilterStatus(option.value)}
                            className={bookingFilterStatus === option.value ? 'bg-accent' : ''}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-[37px] gap-x-2 items-center rounded border border-[#E4E4E4] bg-white px-3"
                      >
                        <SVGs.FunnelSimpleTwo />
                        <span className="font-medium text-sm leading-[150%] tracking-[0%] text-black">
                          Sort By
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {SAVED_PROPERTY_SORT_OPTIONS.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => setSavedPropertySortBy(option.value)}
                          className={savedPropertySortBy === option.value ? 'bg-accent' : ''}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <FindHostels />
              </div>
            </div>

            <div className="hidden lg:block lg:border-t lg:border-t-[#E4E7EC] lg:mt-4"></div>

            <TabsContent value="My Bookings">
              {bookingsLoading ? (
                <motion.div
                  className="px-4 pb-4 lg:pt-4"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="rounded border border-[#F4F4F4] bg-[#FDFDFD] p-6 mt-4 lg:mt-0">
                    <p className="text-center text-[#878FA1]">Loading bookings...</p>
                  </div>
                </motion.div>
              ) : filteredAndSortedBookings.length === 0 ? (
                <motion.div
                  className="px-4 pb-4 lg:pt-4"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                >
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
                </motion.div>
              ) : (
                <>
                  <div className="overflow-x-scroll lg:overflow-hidden px-4 pb-4 lg:pt-4">
                    <motion.div
                      className="w-[1337px] grid grid-cols-1 gap-4 rounded border border-[#F4F4F4] bg-[#FDFDFD] lg:w-full p-4 mt-4 lg:mt-0"
                      variants={staggerContainerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {filteredAndSortedBookings.map((booking) => (
                        <motion.div key={booking._id} variants={staggerItemVariants}>
                          <HostelDetail booking={booking} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                  {bookingsTotalPages > 1 && (
                    <motion.div
                      className="flex justify-center items-center gap-x-2 px-4 pb-4"
                      variants={fadeVariants}
                      initial="hidden"
                      animate="visible"
                    >
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
                    </motion.div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="Saved Properties">
              {savedPropertiesLoading ? (
                <motion.div
                  className="rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] p-4"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <p className="text-center text-[#878FA1]">Loading saved properties...</p>
                </motion.div>
              ) : filteredAndSortedSavedProperties.length === 0 ? (
                <motion.div
                  className="px-4 pb-4 lg:pt-4"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                >
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
                </motion.div>
              ) : (
                <>
                  <motion.div
                    className="rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 p-4"
                    variants={staggerContainerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredAndSortedSavedProperties.map((property) => (
                      <motion.div key={property._id} variants={staggerItemVariants}>
                        <HostelCard property={property} />
                      </motion.div>
                    ))}
                  </motion.div>
                  {savedPropertiesTotalPages > 1 && (
                    <motion.div
                      className="flex justify-center items-center gap-x-2 mt-4"
                      variants={fadeVariants}
                      initial="hidden"
                      animate="visible"
                    >
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
                    </motion.div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
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
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const property = typeof booking.propertyid === 'object' ? booking.propertyid : null;
  const agent = typeof booking.agent === 'object' ? booking.agent : null;

  const handleCopy = async () => {
    try {
      if (agent?.phoneNumber !== undefined) {
        await navigator.clipboard.writeText(agent?.phoneNumber);
      }
      setCopied(true);
      toast.success('Phone Number Copied', { position: 'bottom-center' });
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Error', err);
    }
  };

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

  const receiptDetailsData = formatReceiptDetails(booking);
  const breakdownsData = formatBreakdown(booking);

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
        <Button
          variant="outline"
          className="gap-x-2 rounded-lg border border-[#DCDCDC] bg-[#F8F8F9] px-4 py-2"
          onClick={() => navigate(`/students/hostels/${property?._id}`)}
        >
          <SVGs.View />
          <span className="font-medium text-xs leading-[150%] tracking-[0%] text-[#3D3D3D]">
            View Property
          </span>
        </Button>
        {booking.paymentStatus === 'paid' && (
          <AlertDialog>
            <AlertDialogTrigger>
              <Button
                variant="outline"
                className="gap-x-2 rounded-lg border border-[#DCDCDC] bg-[#F8F8F9] px-4 py-2"
              >
                <SVGs.Download />
                <span className="font-medium text-xs leading-[150%] tracking-[0%] text-[#3D3D3D]">
                  Download Receipt
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
                        className={receiptDetail.id === 3 || receiptDetail.id === 4 ? 'hidden' : ''}
                      >
                        -
                      </span>
                      <span
                        className={receiptDetail.id === 3 || receiptDetail.id === 4 ? 'hidden' : ''}
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
                        Your current rent expires on {formatDate(booking.moveOutDate)}. Renew early
                        to keep your room secured.
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="gap-x-2 rounded-lg border border-[#DCDCDC] bg-[#F8F8F9] px-4 py-2"
            >
              <SVGs.Contact />
              <span className="font-medium text-xs leading-[150%] tracking-[0%] text-[#3D3D3D]">
                Contact Agent
              </span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader className="flex flex-row justify-end">
              <AlertDialogCancel className="size-fit">
                <SVGs.XIcon className="size-3" />
              </AlertDialogCancel>
            </AlertDialogHeader>
            <div className="flex justify-center gap-x-4 items-center">
              <span className="text-5xl">{agent?.phoneNumber}</span>
              <Button variant="ghost" onClick={handleCopy}>
                {!copied ? <SVGs.Copy /> : <SVGs.CheckmarkCircle />}
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
