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

// --- Types ---
interface Listing {
  id: number;
  name: string;
  location: string;
  price: number;
  amenities: number;
  agent: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

type ModalStep = 'DETAILS' | 'CONFIRM_REJECT' | 'SUCCESS_REJECT' | 'SUCCESS_APPROVE';

// --- Mock Data ---
const listingsData: Listing[] = [
  {
    id: 1,
    name: 'Emerates Lodge',
    location: 'Ifite Road, Awka',
    price: 180000,
    amenities: 4,
    agent: 'Melodie Ezeani',
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Emerates Lodge',
    location: 'Ifite Road, Awka',
    price: 180000,
    amenities: 4,
    agent: 'Melodie Ezeani',
    status: 'Approved',
  },
  {
    id: 3,
    name: 'Emerates Lodge',
    location: 'Ifite Road, Awka',
    price: 180000,
    amenities: 4,
    agent: 'Melodie Ezeani',
    status: 'Rejected',
  },
  {
    id: 4,
    name: 'Emerates Lodge',
    location: 'Ifite Road, Awka',
    price: 180000,
    amenities: 4,
    agent: 'Melodie Ezeani',
    status: 'Pending',
  },
];

// --- Main Page Component ---
export function AdminHostelListings() {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStep, setModalInitialStep] = useState<ModalStep>('DETAILS');

  const stats = [
    {
      label: 'Total Listings',
      value: '1,300',
      color: 'bg-gradient-to-b from-[#E1EAFD] to-white',
      border: 'border-[#CBDBFC]',
    },
    {
      label: 'Active Listings',
      value: '10',
      color: 'bg-gradient-to-b from-[#C8FFDC] to-white',
      border: 'border-[#BFF0FC]',
    },
    {
      label: 'Pending Approval',
      value: '20',
      color: 'bg-gradient-to-b from-[#FEECE0] to-white',
      border: 'border-[#FFE0D3]',
    },
    {
      label: 'Flagged',
      value: '1,260',
      color: 'bg-gradient-to-b from-[#D8F6FF] to-white',
      border: 'border-[#BFF0FC]',
    },
    {
      label: 'Rejected',
      value: '10',
      color: 'bg-gradient-to-b from-[#FA350766] to-white',
      border: 'border-[#FF383C66]',
    },
  ];

  const handleOpenModal = (listing: Listing, step: ModalStep) => {
    setSelectedListing(listing);
    setModalInitialStep(step);
    setIsModalOpen(true);
  };

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
        {stats.map((stat, i) => (
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
          <Select defaultValue="all">
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
          {/* Listings Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
            {listingsData.map((listing) => (
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
          <div className="flex justify-center items-center gap-0.5 mt-6">
            <button className="flex justify-center items-center size-10 rounded-[7px] hover:bg-[#F2F2F5]">
              <SVGs.ChevronLeft />
            </button>
            <button className="size-10 rounded-[7px] bg-[#F2F2F5]">
              <span className="font-bold text-sm leading-[21px] tracking-normal text-[#121417]">
                1
              </span>
            </button>
            <button className="group size-10 rounded-[7px] hover:bg-[#F2F2F5]">
              <span className="text-sm leading-[21px] tracking-normal text-[#121417] group-hover:font-bold">
                2
              </span>
            </button>
            <button className="group flex justify-center items-center size-10 rounded-[7px] hover:bg-[#F2F2F5]">
              <span className="text-sm leading-[21px] tracking-normal text-[#121417] group-hover:font-bold">
                ...
              </span>
            </button>
            <button className="group size-10 rounded-[7px] hover:bg-[#F2F2F5]">
              <span className="text-sm leading-[21px] tracking-normal text-[#121417] group-hover:font-bold">
                10
              </span>
            </button>
            <button className="flex justify-center items-center size-10 rounded-[7px] hover:bg-[#F2F2F5]">
              <SVGs.ChevronLeft className="rotate-180" />
            </button>
          </div>
        </div>
      </div>
      {/* The Modal */}
      <ReviewListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listing={selectedListing}
        initialStep={modalInitialStep}
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
            <img src={HostelImage} alt="Hostel" className="w-full h-full object-cover" />
          </div>
          <div className="h-8 grid grid-cols-4 gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded overflow-hidden">
                <img src={HostelImage} className="w-full h-full object-cover opacity-60" />
              </div>
            ))}
            <div className="flex justify-center items-center rounded bg-black/80 font-Bricolage font-medium text-xs leading-[100%] tracking-[0%] text-white">
              +8
            </div>
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
              ₦{listing.price.toLocaleString()}
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
}

function ReviewListingModal({ isOpen, onClose, listing, initialStep }: ModalProps) {
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
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[640px] overflow-hidden"
      >
        {/* --- STEP: DETAILS --- */}
        {step === 'DETAILS' && (
          <>
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#09090B]">Review Listing</h2>
              <p className="text-sm text-[#71717A]">Review and take action on this listing</p>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Apartment</p>
                  <p className="text-sm font-medium text-gray-600">{listing.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Location</p>
                  <p className="text-sm font-medium text-gray-600">{listing.location}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Price</p>
                  <p className="text-sm font-medium text-gray-600">
                    ₦{listing.price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Agent</p>
                  <p className="text-sm font-medium text-gray-600">{listing.agent}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-3">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {amenitiesList.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F4F5] rounded-full border border-gray-100"
                    >
                      <item.icon className="size-3.5 text-gray-600" />
                      <span className="text-xs font-medium text-gray-700">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-3">
                  Listing Performance
                </p>
                <div className="grid grid-cols-3 border border-gray-100 rounded-xl py-5 divide-x divide-gray-100 bg-[#FAFAFA]">
                  <div className="text-center px-2">
                    <p className="text-2xl font-bold text-gray-900">354</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Total views</p>
                  </div>
                  <div className="text-center px-2">
                    <p className="text-2xl font-bold text-gray-900">295</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Total ratings</p>
                  </div>
                  <div className="text-center px-2">
                    <p className="text-2xl font-bold text-gray-900">349</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Total bookings</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">
                  Review Notes (optional)
                </p>
                <textarea
                  className="w-full h-24 p-4 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Add notes or feedback about this listing"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6 bg-[#F9FAFB] border-t border-gray-100 flex justify-between items-center">
              <Button
                onClick={handleResetAndClose}
                variant="outline"
                className="px-8 border-gray-200 text-gray-600 font-bold h-11"
              >
                close
              </Button>
              <div className="flex gap-3">
                <Button
                  onClick={() => setStep('CONFIRM_REJECT')}
                  variant="outline"
                  className="px-8 border-red-100 text-[#F04438] hover:bg-red-50 font-bold h-11"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => setStep('SUCCESS_APPROVE')}
                  className="px-8 bg-[#3E78FF] text-white font-bold h-11"
                >
                  Approve
                </Button>
              </div>
            </div>
          </>
        )}

        {/* --- STEP: CONFIRM REJECT --- */}
        {step === 'CONFIRM_REJECT' && (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <SVGs.Cancel className="size-10 text-[#F79009]" />
            </div>
            <h3 className="text-xl font-bold text-[#101828] mb-2 px-6">
              Are you sure you want to reject this application?
            </h3>
            <p className="text-sm text-[#667085] mb-10 max-w-[320px]">
              Note that once rejected, this action cannot be undone.
            </p>
            <div className="flex gap-4 w-full">
              <Button
                onClick={() => setStep('DETAILS')}
                variant="outline"
                className="flex-1 border-gray-200 font-bold h-12 text-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setStep('SUCCESS_REJECT')}
                className="flex-1 bg-[#F04438] text-white font-bold h-12"
              >
                Reject
              </Button>
            </div>
          </div>
        )}

        {/* --- STEP: SUCCESS --- */}
        {(step === 'SUCCESS_APPROVE' || step === 'SUCCESS_REJECT') && (
          <div className="p-12 flex flex-col items-center text-center outline outline-black">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <SVGs.CheckmarkCircle className="size-10 text-[#12B76A]" />
            </div>
            <h3 className="text-xl font-bold text-[#101828] mb-10">
              Application {step === 'SUCCESS_APPROVE' ? 'Approval' : 'Rejection'} Successful
            </h3>
            <Button
              onClick={handleResetAndClose}
              variant="outline"
              className="w-full border-gray-200 font-bold h-12 text-gray-700"
            >
              Close
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
