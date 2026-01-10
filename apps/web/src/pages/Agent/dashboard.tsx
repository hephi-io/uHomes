import profile from '@/assets/pngs/profile.png';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@uhomes/ui-kit';
import { SVGs } from '@/assets/svgs/Index';
import { createColumns, type Property } from '@/shared/columns';
import { useState, useEffect, useCallback } from 'react';
import Grid from './grid';
import AddNewProperty from './components/add-new-property';
import { bookingColumns, type IBooking } from '@/shared/booking';
import { transactionColumn, type ITransaction } from '@/shared/transactions';
import Tableshared from '@/shared/table';
import { useAuth } from '@/contexts/auth-context';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  getAgentProperties,
  getAgentDashboardStats,
  deleteProperty,
  type SavedProperty,
} from '@/services/property';
import { getMyBookings, type Booking } from '@/services/booking';
import { Dialog, DialogContent } from '@uhomes/ui-kit';
import { DialogFooter } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [activeView, setActiveView] = useState<'list' | 'grid'>('grid');

  // Dashboard stats
  const [totalProperties, setTotalProperties] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Data lists
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  // Loading states
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // Edit/Delete states
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const tabTriggers = [
    { id: 1, name: 'My Listings' },
    { id: 2, name: 'Bookings' },
    { id: 3, name: 'Transactions' },
  ];

  // Helper function to format currency
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Transform booking data from API to IBooking type
  const transformBooking = (booking: Booking): IBooking => {
    const property = typeof booking.property === 'object' ? booking.property : null;
    const tenant = booking.tenant;

    // Map status
    let bookingStatus: 'Pending' | 'Accepted' | 'Cancelled' = 'Pending';
    if (booking.status === 'confirmed') bookingStatus = 'Accepted';
    else if (booking.status === 'cancelled') bookingStatus = 'Cancelled';

    return {
      bookingID: `BK${booking._id.slice(-8).toUpperCase()}`,
      studentName: tenant.fullName,
      apartment: property?.title || 'N/A',
      roomType: 'N/A', // Not available in booking data
      duration: booking.duration,
      bookingStatus,
      MoveInDate: new Date(booking.moveInDate).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    };
  };

  // Transform booking to transaction
  const transformTransaction = (booking: Booking): ITransaction => {
    const tenant = booking.tenant;

    // Map payment status to transaction status
    let statusBadge: 'Escrow Held' | 'Refunded' | 'Successful' = 'Escrow Held';
    if (booking.paymentStatus === 'paid') statusBadge = 'Successful';
    else if (booking.paymentStatus === 'refunded') statusBadge = 'Refunded';

    return {
      transactionRef: `TXN-${booking._id.slice(-8).toUpperCase()}`,
      studentName: tenant.fullName,
      paymentType: 'Bank Transfer', // Default, not available in booking data
      amount: formatCurrency(booking.amount),
      date: new Date(booking.createdAt).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      statusBadge,
    };
  };

  // Transform property function
  const transformProperty = useCallback(
    (property: SavedProperty): Property => {
      const amenityCount = Array.isArray(property.amenities)
        ? property.amenities.length
        : Object.values(property.amenities).filter(Boolean).length;

      return {
        id: property._id,
        images: property.images.map((img) => (typeof img === 'string' ? img : img.url)),
        name: property.title,
        location: property.location,
        price: formatCurrency(property.price || 0),
        bookings: 0, // Will be calculated from bookings data
        amenities: `${amenityCount} items`,
        rating: property.rating ? `${property.rating.toFixed(1)} (0)` : 'N/A',
      };
    },
    [formatCurrency]
  );

  // Fetch properties function (can be called to refresh)
  const fetchProperties = useCallback(async () => {
    setPropertiesLoading(true);
    try {
      const response = await getAgentProperties(1, 100); // Fetch all for stats
      if (response.data.status === 'success') {
        const transformedProperties = response.data.data.properties.map(transformProperty);
        setProperties(transformedProperties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setPropertiesLoading(false);
    }
  }, [transformProperty]);

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Handle edit
  const handleEdit = (propertyId: string) => {
    setEditingPropertyId(propertyId);
    setEditDialogOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProperty(propertyToDelete);

      // Optimistically remove the property from the list immediately
      setProperties((prevProperties) =>
        prevProperties.filter((prop) => prop.id !== propertyToDelete)
      );

      setDeleteDialogOpen(false);
      setPropertyToDelete(null);

      // Refresh properties and stats in the background
      await Promise.all([
        fetchProperties(),
        getAgentDashboardStats().then((statsResponse) => {
          if (statsResponse.data.status === 'success') {
            setTotalProperties(statsResponse.data.data.totalProperties);
            setAvailableRooms(statsResponse.data.data.availableRooms);
            setPendingBookings(statsResponse.data.data.pendingBookings);
            setTotalRevenue(statsResponse.data.data.totalRevenue);
          }
        }),
      ]);
    } catch (error) {
      console.error('Error deleting property:', error);
      // If delete fails, refresh to get the correct state
      await fetchProperties();
      alert('Failed to delete property. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit success
  const handleEditSuccess = () => {
    setEditingPropertyId(null);
    setEditDialogOpen(false);
    fetchProperties();
    // Refresh stats
    getAgentDashboardStats().then((statsResponse) => {
      if (statsResponse.data.status === 'success') {
        setTotalProperties(statsResponse.data.data.totalProperties);
        setAvailableRooms(statsResponse.data.data.availableRooms);
        setPendingBookings(statsResponse.data.data.pendingBookings);
        setTotalRevenue(statsResponse.data.data.totalRevenue);
      }
    });
  };

  const handleEditDialogClose = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      setEditingPropertyId(null);
    }
  };

  // Create columns with handlers
  const propertyColumns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDeleteClick,
  });

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const response = await getAgentDashboardStats();
        if (response.data.status === 'success') {
          setTotalProperties(response.data.data.totalProperties);
          setAvailableRooms(response.data.data.availableRooms);
          setPendingBookings(response.data.data.pendingBookings);
          setTotalRevenue(response.data.data.totalRevenue);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      setBookingsLoading(true);
      try {
        const response = await getMyBookings(1, 100);
        if (response.data.status === 'success') {
          // Transform bookings for display
          const transformedBookings = response.data.data.bookings.map(transformBooking);
          setBookings(transformedBookings);

          // Transform bookings to transactions
          const transformedTransactions = response.data.data.bookings.map(transformTransaction);
          setTransactions(transformedTransactions);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="">
      <div className="hidden md:block border-b border-[#E4E4E4] py-5 px-8">
        <h2 className="text-[#000000] font-semibold text-2xl leading-[120%] ">Dashboard</h2>
      </div>

      <div className=" mt-7  md:mt-0 lg:p-8 md:space-y-9 lg:space-y-4">
        <div className=" border-0 md:border-b  md:border-[#E4E4E4]  md:pt-8  lg:pt-3 lg:pb-8 ">
          <div className="flex items-center justify-between mb-6 md:mb-0">
            <div className="flex items-center  gap-4 ">
              <div className="size-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.fullName || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src={profile} alt="profile image" className="w-full h-full object-cover" />
                )}
              </div>

              <div className="space-y-0.5">
                <h2 className="font-semibold text-base text-[22px] leading-[120%]">
                  Hi, {user?.fullName || 'Agent'} <span>👋🏽</span>
                </h2>
                <p className="text-[#000000] font-normal text-[14px] sm:text-sm leading-[120%] max-w-[220px] sm:max-w-none">
                  Manage your properties and track your earnings
                </p>
              </div>
            </div>
            <div className="relative w-10 h-10 flex justify-center items-center rounded-full bg-[#F8F8F8] lg:hidden">
              <SVGs.Notification />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#3E78FF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
          <div className="rounded-lg p-6 border border-[#CBDBFC] flex flex-col  gap-8 bg-linear-to-b from-[#E1EAFD] to-[#FFFFFF]">
            <div className="flex flex-col-reverse  gap-2 md:gap-0 md:flex-row md:items-center justify-between">
              <h2 className="font-semibold text-sm leading-[150%] text-[#727272]">
                Total Properties
              </h2>
              <div className="rounded-lg bg-[#FFFFFF] p-2 size-[35px] md:size-auto ">
                <SVGs.House />
              </div>
            </div>
            <div>
              <h4 className="text-[#09090B] font-bold text-[32px] mb-4 leading-[100%]">
                {statsLoading ? '...' : totalProperties}
              </h4>
              <p className="font-normal text-[#71717A] text-[13px]">Listed properties</p>
            </div>
          </div>

          <div className="rounded-lg p-6 border border-[#FFE0D3] flex flex-col  gap-8 bg-linear-to-b from-[#FEECE0] to-[#FFFFFF]">
            <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-0 md:items-center justify-between">
              <h2 className="font-semibold text-sm leading-[150%] text-[#727272]">
                Available Rooms
              </h2>
              <div className="rounded-lg bg-[#FFFFFF] p-2  size-[35px] md:size-auto">
                <SVGs.PropertyView />
              </div>
            </div>
            <div>
              <h4 className="text-[#09090B] font-bold text-[32px] mb-4 leading-[100%]">
                {statsLoading ? '...' : availableRooms}
              </h4>
              <p className="font-normal text-[#71717A] text-[13px]">Total rooms</p>
            </div>
          </div>

          <div className="rounded-lg p-6 border border-[#BFF0FC] flex flex-col  gap-8 bg-linear-to-b from-[#D8F6FF] to-[#FFFFFF]">
            <div className="flex gap-2 md:gap-0   flex-col md:flex-row md:items-center justify-between">
              <h2 className="font-semibold text-sm leading-[150%] text-[#727272]">
                Pending Bookings
              </h2>
              <div className="rounded-lg bg-[#FFFFFF] p-2 size-[35px] md:size-auto ">
                <SVGs.Note />
              </div>
            </div>
            <div>
              <h4 className="text-[#09090B] font-bold text-[32px] mb-4 leading-[100%]">
                {statsLoading ? '...' : pendingBookings}
              </h4>
              <p className="font-normal text-[#71717A] text-[13px]">Awaiting review</p>
            </div>
          </div>

          <div className="rounded-lg p-6 border border-[#BCF5D5] flex flex-col  gap-8 bg-linear-to-b from-[#C8FFDC] to-[#FFFFFF]">
            <div className="flex flex-col gap-2 md:flex-row md:gap-0 md:items-center justify-between">
              <h2 className="font-semibold text-sm leading-[150%] text-[#727272]">Total Revenue</h2>
              <div className="rounded-lg bg-[#FFFFFF] p-2 size-[35px] md:size-auto ">
                <SVGs.MoneyBag />
              </div>
            </div>
            <div>
              <h4 className="text-[#09090B] font-bold text-[32px] mb-4 leading-[100%]">
                {statsLoading ? '...' : formatCurrency(totalRevenue)}
              </h4>
              <p className="font-normal text-[#71717A] text-[13px]">Paid bookings</p>
            </div>
          </div>
        </div>

        {/* listing */}
        <div className="rounded-xl border border-[#E4E7EC] bg-white shadow-[0px_1px_2px_0px_#1018280D] lg:p-0 mt-4 md:mt-9 lg:mt-4 overflow-hidden">
          <div className=" flex items-center gap-[54px] mb-4 md:hidden px-4 pt-4">
            <div className="flex items-center gap-1 lg:hidden ">
              <Button
                variant="outline"
                className=" lg:flex cursor-pointer gap-x-2 rounded border border-[#E4E4E4EE] bg-white px-3 py-2"
              >
                <SVGs.Filter />
              </Button>

              <Button
                variant="outline"
                className=" lg:flex cursor-pointer gap-x-2 rounded border border-[#E4E4E4EE] bg-white px-3 py-2"
              >
                <SVGs.FunnelSimple />
                <span className="font-medium text-sm text-[#404D61]">Filter</span>
              </Button>
            </div>

            <div className="flex items-center gap-1 md:hidden">
              <div
                onClick={() => setActiveView('list')}
                className={` py-2 px-3 flex items-center gap-2 cursor-pointer  ${activeView === 'list' ? 'border-b-2 border-[#09090B]' : ''} ?`}
              >
                <SVGs.ListIcon />
                <span className="text-[#09090B] font-medium text-sm">List</span>
              </div>

              <div
                onClick={() => setActiveView('grid')}
                className={` py-2 px-3 flex items-center gap-2 cursor-pointer  ${activeView === 'grid' ? 'border-b-2 border-[#09090B]' : ''} ?`}
              >
                <SVGs.GridView />
                <span className="text-[#09090B] font-medium text-sm">Grid</span>
              </div>
            </div>
          </div>

          <div className="w-[90%] mx-auto md:hidden">
            <Button
              onClick={() => navigate('/SMNewProperty')}
              variant="outline"
              className="w-full flex gap-x-2 rounded border border-[#E4E4E4] bg-[#3E78FF] hover:bg-[#3E78FF] px-4 py-2"
            >
              <SVGs.AddProperty />
              <span className="font-medium text-sm text-white">Add Property</span>
            </Button>
          </div>

          <Tabs defaultValue="My Listings" className="gap-0 mt-4 md:mt-0">
            <div className="md:flex md:gap-[100px] md:items-center px-4 md:pt-4">
              <TabsList className="w-full h-10 rounded-md bg-[#F4F4F5]  md:w-[596px] p-1 m-0">
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
              <div className="hidden md:flex items-center gap-4 lg:hidden ">
                <Button
                  variant="outline"
                  className=" lg:flex cursor-pointer gap-x-2 rounded border border-[#E4E4E4EE] bg-white px-3 py-2"
                >
                  <SVGs.Filter />
                  <span className="font-medium text-sm text-[#404D61]">Sort By</span>
                </Button>

                <Button
                  variant="outline"
                  className=" lg:flex cursor-pointer gap-x-2 rounded border border-[#E4E4E4EE] bg-white px-3 py-2"
                >
                  <SVGs.FunnelSimple />
                  <span
                    className="
                  font-medium text-sm text-[#404D61]"
                  >
                    Filter
                  </span>
                </Button>
              </div>

              {/* ---------- List / Grid Toggle ---------- */}
              <div className="hidden lg:flex items-center gap-3 ">
                <div
                  onClick={() => setActiveView('list')}
                  className={` py-2 px-3 flex items-center gap-2 cursor-pointer  ${activeView === 'list' ? 'border-b-2 border-[#09090B]' : ''} ?`}
                >
                  <SVGs.ListIcon />
                  <span className="text-[#09090B] font-medium text-sm">List</span>
                </div>

                <div
                  onClick={() => setActiveView('grid')}
                  className={`py-2 px-3 flex items-center gap-2 cursor-pointer ${activeView === 'grid' ? 'border-b-2 border-[#09090B]' : ''}`}
                >
                  <SVGs.GridView />
                  <span className="text-[#09090B] font-medium text-sm">Grid</span>
                </div>
              </div>

              {/* ---------- Sort / Filter / Add Property ---------- */}
              <div className=" hidden lg:flex items-center gap-4 ">
                <Button
                  variant="outline"
                  className="hidden lg:flex cursor-pointer gap-x-2 rounded border border-[#E4E4E4EE] bg-white px-3 py-2"
                >
                  <SVGs.Filter />
                  <span className="font-medium text-sm text-[#404D61]">Sort By</span>
                </Button>

                <Button
                  variant="outline"
                  className="hidden lg:flex cursor-pointer gap-x-2 rounded border border-[#E4E4E4EE] bg-white px-3 py-2"
                >
                  <SVGs.FunnelSimple />
                  <span className="font-medium text-sm text-[#404D61]">Filter</span>
                </Button>

                <div className="w-px h-[37px] bg-[#E4E4E4]" />

                <AddNewProperty />
              </div>
            </div>

            <div className=" hidden md:flex justify-between items-center mt-4 lg:hidden mb-4 px-4">
              <div className="flex items-center gap-3 ">
                <div
                  onClick={() => setActiveView('list')}
                  className={` py-2 px-3 flex items-center gap-2 cursor-pointer  ${activeView === 'list' ? 'border-b-2 border-[#09090B]' : ''} ?`}
                >
                  <SVGs.ListIcon />
                  <span className="text-[#09090B] font-medium text-sm">List</span>
                </div>

                <div
                  onClick={() => setActiveView('grid')}
                  className={` py-2 px-3 flex items-center gap-2 cursor-pointer  ${activeView === 'grid' ? 'border-b-2 border-[#09090B]' : ''} ?`}
                >
                  <SVGs.GridView />
                  <span className="text-[#09090B] font-medium text-sm">Grid</span>
                </div>
              </div>

              <div className="flex items-center gap-4 lg:hidden">
                <AddNewProperty />
              </div>
            </div>

            <div className="hidden lg:block lg:border-t lg:border-t-[#E4E7EC] lg:mt-4"></div>
            <TabsContent value="My Listings" className="">
              {propertiesLoading ? (
                <div className="p-4 text-center text-[#878FA1]">Loading properties...</div>
              ) : properties.length === 0 ? (
                <div className="p-4 text-center text-[#878FA1]">No properties found</div>
              ) : activeView === 'list' ? (
                <Tableshared columns={propertyColumns} data={properties} />
              ) : (
                <Grid properties={properties} onRefresh={fetchProperties} />
              )}
            </TabsContent>
            <TabsContent value="Bookings" className="">
              {bookingsLoading ? (
                <div className="p-4 text-center text-[#878FA1]">Loading bookings...</div>
              ) : bookings.length === 0 ? (
                <div className="p-4 text-center text-[#878FA1]">No bookings found</div>
              ) : (
                <Tableshared columns={bookingColumns} data={bookings} />
              )}
            </TabsContent>
            <TabsContent value="Transactions" className="">
              {bookingsLoading ? (
                <div className="p-4 text-center text-[#878FA1]">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div className="p-4 text-center text-[#878FA1]">No transactions found</div>
              ) : (
                <Tableshared columns={transactionColumn} data={transactions} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Property Dialog */}
      {editingPropertyId && (
        <AddNewProperty
          propertyId={editingPropertyId}
          mode="edit"
          open={editDialogOpen}
          onOpenChange={handleEditDialogClose}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="w-[400px] rounded-[10px] bg-white p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-[#09090B] font-semibold text-xl">Delete Property</h2>
            <p className="text-[#61646B] font-normal text-sm">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setPropertyToDelete(null);
              }}
              disabled={isDeleting}
              className="border border-[#E5E5E5] rounded-[6px] font-inter py-2 px-4"
            >
              <span className="text-[#09090B] font-medium text-sm">Cancel</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 border border-red-600 rounded-[6px] font-inter py-2 px-4"
            >
              <span className="text-white font-medium text-sm">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
