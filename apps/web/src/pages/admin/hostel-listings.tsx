import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@uhomes/ui-kit';
import { SVGs } from '../../../../../packages/ui-kit/src/assets/svgs/Index';
import HostelImage from '@/assets/pngs/hostel-image-2.png';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllProperties, updatePropertyStatus, type AdminProperty } from '@/services/admin';

// --- Types ---
interface Listing {
  id: string;
  name: string;
  location: string;
  price: number;
  amenities: number;
  agent: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  images?: Array<{ url: string }>;
}

type ModalStep = 'DETAILS' | 'CONFIRM_REJECT' | 'SUCCESS_REJECT' | 'SUCCESS_APPROVE';

function mapProperty(prop: AdminProperty): Listing {
  const agentId = typeof prop.agentId === 'object' ? prop.agentId : null;
  const amenitiesCount = prop.amenities
    ? Object.values(prop.amenities).filter((v) => v === true).length
    : 0;
  return {
    id: prop._id,
    name: prop.title,
    location: prop.location,
    price: prop.price ?? 0,
    amenities: amenitiesCount,
    agent: agentId?.fullName || 'N/A',
    status: prop.isAvailable ? 'Approved' : 'Rejected',
    images: prop.images,
  };
}

// --- Main Page Component ---
export function AdminHostelListings() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStep, setModalInitialStep] = useState<ModalStep>('DETAILS');

  const filters = {
    page,
    limit: 10,
    ...(statusFilter !== 'all' && { status: statusFilter }),
  };

  const { data: propertiesData, isLoading: loading } = useQuery({
    queryKey: ['adminProperties', statusFilter, page],
    queryFn: async () => {
      const response = await getAllProperties(filters);
      if (response.data.status !== 'success') throw new Error('Failed to load properties');
      return response.data.data;
    },
  });

  const { data: stats = { total: 0, active: 0, pending: 0, rejected: 0 } } = useQuery({
    queryKey: ['adminPropertiesStats'],
    queryFn: async () => {
      const [all, active, pending, rejected] = await Promise.all([
        getAllProperties({ limit: 1 }),
        getAllProperties({ status: 'approved', limit: 1 }),
        getAllProperties({ status: 'pending', limit: 1 }),
        getAllProperties({ status: 'rejected', limit: 1 }),
      ]);
      return {
        total: all.data.status === 'success' ? all.data.data.pagination.total : 0,
        active: active.data.status === 'success' ? active.data.data.pagination.total : 0,
        pending: pending.data.status === 'success' ? pending.data.data.pagination.total : 0,
        rejected: rejected.data.status === 'success' ? rejected.data.data.pagination.total : 0,
      };
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) =>
      updatePropertyStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success(
        variables.status === 'approved'
          ? 'Property approved successfully'
          : 'Property rejected successfully'
      );
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
      queryClient.invalidateQueries({ queryKey: ['adminPropertiesStats'] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.error || error.response?.data?.message || 'Something went wrong';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
      }
    },
  });

  const listings: Listing[] = propertiesData?.properties?.map(mapProperty) ?? [];

  const handleOpenModal = (listing: Listing, step: ModalStep) => {
    setSelectedListing(listing);
    setModalInitialStep(step);
    setIsModalOpen(true);
  };

  const handleApprove = () => {
    if (!selectedListing) return;
    updateStatusMutation.mutate({ id: selectedListing.id, status: 'approved' });
    setIsModalOpen(false);
  };

  const handleReject = () => {
    if (!selectedListing) return;
    updateStatusMutation.mutate({ id: selectedListing.id, status: 'rejected' });
    setIsModalOpen(false);
  };

  const statsData = [
    {
      label: 'Total Listings',
      value: stats.total.toLocaleString(),
      color: 'bg-gradient-to-b from-[#E1EAFD] to-white',
      border: 'border-[#CBDBFC]',
    },
    {
      label: 'Active Listings',
      value: stats.active.toLocaleString(),
      color: 'bg-gradient-to-b from-[#C8FFDC] to-white',
      border: 'border-[#BFF0FC]',
    },
    {
      label: 'Pending Approval',
      value: stats.pending.toLocaleString(),
      color: 'bg-gradient-to-b from-[#FEECE0] to-white',
      border: 'border-[#FFE0D3]',
    },
    {
      label: 'Flagged',
      value: '0',
      color: 'bg-gradient-to-b from-[#D8F6FF] to-white',
      border: 'border-[#BFF0FC]',
    },
    {
      label: 'Rejected',
      value: stats.rejected.toLocaleString(),
      color: 'bg-gradient-to-b from-[#FA350766] to-white',
      border: 'border-[#FF383C66]',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <h1 className="font-semibold text-[22px] leading-[120%] tracking-[0%] text-black">
        Hostel Listings
      </h1>
      <p className="text-sm leading-[120%] tracking-[0%] text-black mt-1">
        Review, approve, and manage hostel listings submitted by agents
      </p>
      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-4 mt-4">
        {statsData.map((stat, i) => (
          <div
            key={i}
            className={`rounded border ${stat.border} ${stat.color} shadow-sm transition-all hover:shadow-md p-6`}
          >
            <h3 className="font-semibold text-[32px] leading-[100%] tracking-[0%] text-[#09090B]">
              {stat.value}
            </h3>
            <p className="font-semibold text-sm leading-[100%] tracking-[0%] text-[#71717A] mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-[12px] border border-[#E4E7EC] shadow-[0px_1px_2px_0px_#1018280D] overflow-hidden mt-4">
        {/* Toolbar */}
        <div className="flex justify-end items-center gap-4 p-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-28 rounded border-[#E4E4E4] bg-white font-Bricolage font-medium text-sm leading-[150%] tracking-[0%] text-black px-3 py-2">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <div className="h-[37px] border-l border-l-[#E4E4E4]"></div>
          <Button className="flex gap-2 items-center rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] hover:bg-blue-600 px-4 py-2">
            <SVGs.AddProperty className="size-4" />
            <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
              Create Ad Campaign
            </span>
          </Button>
        </div>
        <div className="border-t border-t-[#E4E7EC]"></div>
        <div className="p-4">
          {loading ? (
            <div className="p-4 text-center text-[#878FA1]">Loading listings...</div>
          ) : listings.length === 0 ? (
            <div className="p-4 text-center text-[#878FA1]">No listings found</div>
          ) : (
            <>
              {/* Listings Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onViewDetails={() => handleOpenModal(listing, 'DETAILS')}
                    onApprove={() => handleOpenModal(listing, 'SUCCESS_APPROVE')}
                    onReject={() => handleOpenModal(listing, 'CONFIRM_REJECT')}
                  />
                ))}
              </div>
              {/* Pagination */}
              {propertiesData?.pagination && propertiesData.pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-0.5 mt-6">
                  <button
                    type="button"
                    className="flex justify-center items-center size-10 rounded-[7px] hover:bg-[#F2F2F5] disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    <SVGs.ChevronLeft />
                  </button>
                  {Array.from({ length: propertiesData.pagination.pages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        className={`size-10 rounded-[7px] ${
                          page === p ? 'bg-[#F2F2F5]' : 'hover:bg-[#F2F2F5]'
                        }`}
                        onClick={() => setPage(p)}
                      >
                        <span
                          className={`text-sm leading-[21px] tracking-normal text-[#121417] ${
                            page === p ? 'font-bold' : ''
                          }`}
                        >
                          {p}
                        </span>
                      </button>
                    )
                  )}
                  <button
                    type="button"
                    className="flex justify-center items-center size-10 rounded-[7px] hover:bg-[#F2F2F5] disabled:opacity-50"
                    onClick={() => setPage((p) => Math.min(propertiesData.pagination.pages, p + 1))}
                    disabled={page >= propertiesData.pagination.pages}
                  >
                    <SVGs.ChevronLeft className="rotate-180" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* The Modal */}
      <ReviewListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listing={selectedListing}
        initialStep={modalInitialStep}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}

// --- Listing Card Component ---
interface ListingCardProps {
  listing: Listing;
  onViewDetails: () => void;
  onApprove: () => void;
  onReject: () => void;
}

function ListingCard({ listing, onViewDetails, onApprove, onReject }: ListingCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="rounded-full border-[0.5px] border-[#EAD67B] bg-[#FFD00014] font-medium text-sm leading-5 tracking-[0%] text-[#C18700] px-3 py-1">
            Pending
          </span>
        );
      case 'Approved':
        return (
          <span className="rounded-full border-[0.5px] border-[#A8DD9A] bg-[#2BCB0014] font-medium text-sm leading-5 tracking-[0%] text-[#176F00] px-3 py-1">
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="rounded-full border-[0.5px] border-[#FF9E9E] bg-[#ED2A2A14] font-medium text-sm leading-5 tracking-[0%] text-[#B10000] px-3 py-1">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-xl border border-[#F4F4F4] p-4">
      <div className="size-fit ml-auto">{getStatusBadge(listing.status)}</div>
      <div className="border-t border-t-[#F4F4F4] mt-4"></div>
      <div className="flex gap-6 mt-4">
        {/* Images */}
        <div className="w-[140px] space-y-1 shrink-0">
          <div className="h-[134px] rounded overflow-hidden bg-gray-50">
            {listing.images && listing.images.length > 0 ? (
              <img
                src={listing.images[0].url}
                alt={listing.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <img src={HostelImage} alt="Hostel" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="h-8 grid grid-cols-4 gap-1">
            {listing.images && listing.images.length > 0
              ? listing.images.slice(1, 4).map((img, i) => (
                  <div key={i} className="rounded overflow-hidden">
                    <img src={img.url} className="w-full h-full object-cover opacity-60" />
                  </div>
                ))
              : [1, 2, 3].map((i) => (
                  <div key={i} className="rounded overflow-hidden">
                    <img src={HostelImage} className="w-full h-full object-cover opacity-60" />
                  </div>
                ))}
            {listing.images && listing.images.length > 4 && (
              <div className="flex justify-center items-center rounded bg-black/80 font-Bricolage font-medium text-xs leading-[100%] tracking-[0%] text-white">
                +{listing.images.length - 4}
              </div>
            )}
          </div>
        </div>
        {/* Info Section */}
        <div className="flex-1 grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs leading-[100%] tracking-[0%] align-middle text-[#09090B]">
              Apartment
            </p>
            <h4 className="font-semibold text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B] mt-1">
              {listing.name}
            </h4>
          </div>
          <div>
            <p className="text-xs leading-[100%] tracking-[0%] align-middle text-[#09090B]">
              Location
            </p>
            <div className="flex gap-1.5 items-center mt-1">
              <SVGs.Location className="text-[#141B34]" />
              <h4 className="font-semibold text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B]">
                {listing.location}
              </h4>
            </div>
          </div>
          <div>
            <p className="text-xs leading-[100%] tracking-[0%] align-middle text-[#09090B]">
              Price
            </p>
            <h4 className="font-semibold text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B] mt-1">
              ₦{(listing.price ?? 0).toLocaleString()}
            </h4>
          </div>
          <div>
            <p className="text-xs leading-[100%] tracking-[0%] align-middle text-[#09090B]">
              Amenities
            </p>
            <h4 className="font-semibold text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B] mt-1">
              {listing.amenities} items
            </h4>
          </div>
          <div className="col-span-2">
            <p className="text-xs leading-[100%] tracking-[0%] align-middle text-[#09090B]">
              Agent
            </p>
            <h4 className="font-semibold text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B] mt-1">
              {listing.agent}
            </h4>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={onViewDetails}
          className="text-[13px] leading-[100%] tracking-[0%] text-[#4976F4] hover:underline"
        >
          view details
        </button>
        <div className="flex gap-4">
          {listing.status === 'Pending' && (
            <>
              <Button
                variant="outline"
                onClick={onReject}
                className="rounded-[5px] border-[#EF3826EE] hover:bg-red-50 px-4 py-2"
              >
                <span className="font-medium text-sm leading-[150%] tracking-[0%] text-[#EF3826]">
                  Reject
                </span>
              </Button>
              <Button
                onClick={onApprove}
                className="rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] hover:bg-blue-600 px-4 py-2"
              >
                <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
                  Approve
                </span>
              </Button>
            </>
          )}
          {listing.status === 'Rejected' && (
            <button className="p-2 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
              <SVGs.Trash className="size-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// --- Review Listing Modal (Multi-Step) ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  initialStep: ModalStep;
  onApprove: () => void;
  onReject: () => void;
}

function ReviewListingModal({
  isOpen,
  onClose,
  listing,
  initialStep,
  onApprove,
  onReject,
}: ModalProps) {
  const [step, setStep] = useState<ModalStep>(initialStep);
  const [notes, setNotes] = useState('');

  // Sync internal state with the trigger step whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
    }
  }, [isOpen, initialStep]);

  if (!isOpen || !listing) return null;

  const handleResetAndClose = () => {
    setStep('DETAILS');
    setNotes('');
    onClose();
  };

  const amenitiesList = [
    { label: 'WiFi', icon: SVGs.Wifi },
    { label: 'Security', icon: SVGs.Security },
    { label: 'Parking', icon: SVGs.Car },
    { label: 'Water', icon: SVGs.Droplet },
    { label: 'Power', icon: SVGs.Flash },
  ];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        {/* --- STEP: DETAILS --- */}
        {step === 'DETAILS' && (
          <div className="w-full max-w-[640px] rounded-xl bg-white p-6">
            <h2 className="font-semibold text-lg leading-[130%] tracking-[0%] text-[#101828]">
              Review Listing
            </h2>
            <p className="font-medium text-sm leading-[120%] tracking-[0%] text-[#475467] mt-1">
              Review and take action on this listing
            </p>
            <div className="border border-[#E0E0E0] mt-4"></div>
            <div className="max-h-[70vh] overflow-y-auto mt-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm leading-[100%] tracking-[0%] text-[#09090B]">Apartment</h4>
                  <p className="text-sm leading-[120%] tracking-[0%] text-[#999999] mt-2">
                    {listing.name}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm leading-[100%] tracking-[0%] text-[#09090B]">Location</h4>
                  <p className="text-sm leading-[120%] tracking-[0%] text-[#999999] mt-2">
                    {listing.location}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm leading-[100%] tracking-[0%] text-[#09090B]">Price</h4>
                  <p className="text-sm leading-[120%] tracking-[0%] text-[#999999] mt-2">
                    ₦{(listing.price ?? 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm leading-[100%] tracking-[0%] text-[#09090B]">Agent</h4>
                  <p className="text-sm leading-[120%] tracking-[0%] text-[#999999] mt-2">
                    {listing.agent}
                  </p>
                </div>
              </div>
              <h4 className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-6">
                Amenities
              </h4>
              <div className="w-[70%] flex flex-wrap gap-2 mt-2">
                {amenitiesList.map((item) => (
                  <div
                    key={item.label}
                    className="flex gap-x-1 items-center rounded-full bg-[#F4F4F5] px-2 py-1"
                  >
                    <item.icon className="text-[#141B34]" />
                    <span className="text-sm leading-[150%] tracking-[0%] text-[#3D3D3D]">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <h4 className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-6">
                Listing Performance
              </h4>
              <div className="flex justify-between rounded bg-[#FAFAFA] p-3 mt-2">
                <div>
                  <p className="font-semibold text-[22px] leading-6 tracking-normal text-[#101828]">
                    354
                  </p>
                  <p className="text-sm leading-6 tracking-normal text-[#101828] mt-1">
                    Total views
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[22px] leading-6 tracking-normal text-[#101828]">
                    295
                  </p>
                  <p className="text-sm leading-6 tracking-normal text-[#101828] mt-1">
                    Total ratings
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[22px] leading-6 tracking-normal text-[#101828]">
                    349
                  </p>
                  <p className="text-sm leading-6 tracking-normal text-[#101828] mt-1">
                    Total bookings
                  </p>
                </div>
              </div>
              <h4 className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-6 mb-2">
                Review Notes (optional)
              </h4>
              <textarea
                className="w-full h-[86px] rounded-xl border border-[#E4E4E7] bg-white font-Bricolage text-sm leading-[130%] tracking-[0%] text-[#999999] focus:text-black focus:ring-1 focus:ring-blue-500 outline-none resize-none p-3"
                placeholder="Add notes or feedback about this listing"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center mt-12">
              <Button
                onClick={handleResetAndClose}
                variant="outline"
                className="rounded-[6px] border-[#E4E4E7] px-4 py-2"
              >
                <span className="font-medium text-sm leading-[100%] tracking-[0%] text-[#09090B]">
                  close
                </span>
              </Button>
              <div className="flex gap-4 items-center">
                <Button
                  onClick={() => setStep('CONFIRM_REJECT')}
                  variant="outline"
                  className="rounded-[5px] border-[#EF3826EE] px-4 py-2"
                >
                  <span className="font-medium text-sm leading-[150%] tracking-[0%] text-[#EF3826]">
                    Reject
                  </span>
                </Button>
                <Button
                  onClick={onApprove}
                  className="rounded-[5px] border-[#E4E4E4EE] bg-[#3E78FF] px-4 py-2"
                >
                  <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
                    Approve
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP: CONFIRM REJECT --- */}
        {step === 'CONFIRM_REJECT' && (
          <div className="w-[466px] max-w-[600px] flex flex-col items-center rounded-xl border border-[#D9D9D9] bg-white shadow p-8">
            <SVGs.WarningLine className="size-12 text-[#F58700] mb-6" />
            <h3 className="font-bold text-lg leading-[120%] tracking-[0%] text-center text-[#1E1E1E] mt-8">
              Are you sure you want to reject this application?
            </h3>
            <p className="text-sm leading-[140%] tracking-[0%] text-center text-[#1E1E1E] mt-4">
              Note that once rejected, this action cannot be undone.
            </p>
            <div className="w-full flex gap-x-8 items-center mt-8">
              <Button
                onClick={() => setStep('DETAILS')}
                variant="outline"
                className="w-[46.02%] rounded border-[#E4E4E4] bg-whitepx-3 py-2"
              >
                <span className="font-medium text-sm leading-[120%] tracking-[0%] text-[#09090B]">
                  Cancel
                </span>
              </Button>
              <Button
                onClick={onReject}
                className="w-[46.02%] rounded-[5px] border-[#E4E4E4EE] bg-[#EF3826] px-4 py-2"
              >
                <span className="font-medium text-sm leading-[120%] tracking-[0%] text-white">
                  Reject
                </span>
              </Button>
            </div>
          </div>
        )}

        {/* --- STEP: SUCCESS --- */}
        {(step === 'SUCCESS_APPROVE' || step === 'SUCCESS_REJECT') && (
          <div className="w-[466px] max-w-[600px] flex flex-col items-center rounded-xl border border-[#D9D9D9] bg-white shadow p-8">
            <SVGs.TaskChecked className="size-[46.67px] text-[#589E67]" />
            <h3 className="font-bold text-lg leading-[120%] tracking-[0%] text-center text-[#1E1E1E] mt-8">
              Application {step === 'SUCCESS_APPROVE' ? 'Approval' : 'Rejection'} Successful
            </h3>
            <Button
              onClick={handleResetAndClose}
              variant="outline"
              className="w-full rounded border-[#E4E4E4] bg-white px-3 py-2 mt-8"
            >
              <span className="font-medium text-sm leading-[120%] tracking-[0%] text-[#09090B]">
                Close
              </span>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
