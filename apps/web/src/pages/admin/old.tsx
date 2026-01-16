// import { useState } from 'react';
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
import HostelImage from '@/assets/pngs/hostel-image-2.png'; // Use your asset path

// Mock Data for the Listings
const listingsData = [
  {
    id: 1,
    name: 'Emerates Lodge',
    location: 'Ifite Road, Awka',
    price: 180000,
    amenities: 4,
    agent: 'Melodie Ezeani',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Emerates Lodge',
    location: 'Ifite Road, Awka',
    price: 180000,
    amenities: 4,
    agent: 'Melodie Ezeani',
    status: 'approved',
  },
  {
    id: 3,
    name: 'Emerates Lodge',
    location: 'Ifite Road, Awka',
    price: 180000,
    amenities: 4,
    agent: 'Melodie Ezeani',
    status: 'rejected',
  },
  {
    id: 4,
    name: 'Emerates Lodge',
    location: 'Ifite Road, Awka',
    price: 180000,
    amenities: 4,
    agent: 'Melodie Ezeani',
    status: 'pending',
  },
];

export function AdminHostelListings() {
  const stats = [
    { label: 'Total Listings', value: '1,300', color: 'bg-[#F4F4F5]', border: 'border-[#E4E4E7]' },
    { label: 'Active Listings', value: '10', color: 'bg-[#F0FFF6]', border: 'border-[#BCF5D5]' },
    { label: 'Pending Approval', value: '20', color: 'bg-[#FFF7F0]', border: 'border-[#FFE5D3]' },
    { label: 'Flagged', value: '1,260', color: 'bg-[#F0FBFF]', border: 'border-[#CCF3FF]' },
    { label: 'Rejected', value: '10', color: 'bg-[#FFF0F0]', border: 'border-[#FFD9D9]' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#09090B]">Hostel Listings</h1>
        <p className="text-sm text-[#71717A] mt-1">
          Review, approve, and manage hostel listings submitted by agents
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-5 rounded-xl border-2 bg-white ${stat.border} shadow-sm`}>
            <h3 className="text-2xl font-bold text-[#09090B]">{stat.value}</h3>
            <p className="text-xs font-medium text-[#71717A] mt-1 uppercase tracking-tight">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#E4E7EC] flex justify-end items-center gap-3">
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px] h-10 border-[#E4E4E4]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
        <Button className="bg-[#3E78FF] hover:bg-blue-600 flex gap-2 items-center text-white h-10 px-4 text-sm font-medium">
          <SVGs.AddProperty className="size-4" /> Create Ad Campaign
        </Button>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-2 gap-6">
        {listingsData.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 pt-4">
        <button className="p-2 text-gray-400 hover:text-black">&lt;</button>
        <button className="w-8 h-8 rounded bg-[#F4F4F5] text-sm font-bold">1</button>
        <button className="w-8 h-8 text-sm font-medium text-gray-400">2</button>
        <span className="text-gray-300">...</span>
        <button className="w-8 h-8 text-sm font-medium text-gray-400">10</button>
        <button className="p-2 text-gray-400 hover:text-black">&gt;</button>
      </div>
    </div>
  );
}

interface ListingProps {
  listing: {
    name: string;
    location: string;
    price: number;
    amenities: number;
    agent: string;
    status: string;
  };
}

function ListingCard({ listing }: ListingProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="bg-[#FFF9E6] text-[#D99E00] px-3 py-1 rounded-full text-[10px] font-bold uppercase">
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="bg-[#F0FFF6] text-[#00B048] px-3 py-1 rounded-full text-[10px] font-bold uppercase">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-[#FFF0F0] text-[#FF4D4D] px-3 py-1 rounded-full text-[10px] font-bold uppercase">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-sm relative"
    >
      <div className="absolute top-5 right-5">{getStatusBadge(listing.status)}</div>

      <div className="flex gap-4">
        {/* Image Section */}
        <div className="w-[180px] space-y-2">
          <div className="h-[140px] rounded-lg overflow-hidden border border-gray-100">
            <img src={HostelImage} alt="Hostel" className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded border border-gray-100 overflow-hidden">
                <img src={HostelImage} className="w-full h-full object-cover opacity-60" />
              </div>
            ))}
            <div className="h-10 rounded bg-black/80 flex items-center justify-center text-[10px] text-white font-bold">
              +8
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 grid grid-cols-2 gap-y-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Apartment</p>
            <h4 className="text-sm font-bold text-[#09090B] truncate">{listing.name}</h4>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Location</p>
            <div className="flex items-center gap-1 text-[#09090B]">
              <SVGs.Location className="size-3" />
              <h4 className="text-sm font-bold truncate">{listing.location}</h4>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Price</p>
            <h4 className="text-sm font-bold text-[#09090B]">₦{listing.price.toLocaleString()}</h4>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Amenities</p>
            <h4 className="text-sm font-bold text-[#09090B]">{listing.amenities} items</h4>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Agent</p>
            <h4 className="text-sm font-bold text-[#09090B]">{listing.agent}</h4>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
        <button className="text-blue-600 text-xs font-semibold hover:underline">
          view details
        </button>

        <div className="flex gap-2">
          {listing.status === 'pending' && (
            <>
              <Button
                variant="outline"
                className="text-red-500 border-red-100 bg-white h-9 px-6 text-xs font-bold"
              >
                Reject
              </Button>
              <Button className="bg-[#3E78FF] text-white h-9 px-6 text-xs font-bold">
                Approve
              </Button>
            </>
          )}
          {listing.status === 'rejected' && (
            <button className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100">
              <SVGs.Trash className="size-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
