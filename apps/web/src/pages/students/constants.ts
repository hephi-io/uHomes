import { SVGs } from '@/assets/svgs/Index';
import type { IBooking } from '@/shared/booking';
import type { ITransaction } from '@/shared/transactions';
import type { Booking } from '@/services/booking';

export const hostelDetails = [
  {
    id: 1,
    label: 'Booking ID',
    text: 'UH-2024-001',
  },
  {
    id: 2,
    label: 'Apartment',
    text: 'Modern 2-Bedroom Hostel Near UNIZIK',
  },
  {
    id: 3,
    label: 'Designated Agent',
    text: 'Chidi Okafor',
  },
  {
    id: 4,
    label: 'Location',
    text: 'Awka, Anambra',
  },
  {
    id: 5,
    label: 'Duration',
    text: '12 months',
  },
  {
    id: 6,
    label: 'Move-Out Date',
    text: '2024-01-15',
  },
  {
    id: 7,
    label: 'Move-in Date',
    text: '2024-02-01',
  },
];

export const topBadges = [
  { id: 1, Icon: SVGs.CheckmarkBadge, text: 'Available' },
  { id: 2, Icon: SVGs.SecurityOne, text: 'Verified' },
];

export const badges = [
  { id: 1, Icon: SVGs.Wifi, text: 'WiFi' },
  { id: 2, Icon: SVGs.Security, text: 'Security' },
  { id: 3, Icon: SVGs.Car, text: 'Parking' },
  { id: 4, Icon: SVGs.Droplet, text: 'Water' },
  { id: 5, Icon: SVGs.Zap, text: 'Power' },
];

export type Property = {
  id: string;
  images: string[];
  name: string;
  location: string;
  price: string;
  bookings: number;
  amenities: string;
  rating: string;
};

// images
export const images = [
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=80',
    alt: 'Modern home office',
  },
  {
    url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200&q=80',
    alt: 'Luxury living room',
  },
  {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&q=80',
    alt: 'Modern kitchen',
  },
  {
    url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=200&q=80',
    alt: 'Bedroom interior',
  },
  {
    url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=200&q=80',
    alt: 'Dining room',
  },
];

export const data: Property[] = [
  {
    id: '1',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e3b5c9c3e92?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80',
    ],
    name: 'Emerates Lodge',
    location: 'Ifite Road, Awka',
    price: '₦180,000',
    bookings: 3,
    amenities: '4 items',
    rating: '4.5 (24)',
  },
  {
    id: '2',
    images: [
      'https://images.unsplash.com/photo-1598928506311-1f6c4d51da8e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490359854-dfba19688a31?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617093727343-356fb608c685?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586109848423-620cb19b2357?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615873968403-89e6bb6c03f8?auto=format&fit=crop&w=800&q=80',
    ],
    name: 'Emerates Lodge',
    location: 'Ifite Road, Awka',
    price: '₦180,000',
    bookings: 3,
    amenities: '4 items',
    rating: '4.5 (24)',
  },
  {
    id: '3',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490362497-4cbb225b38e9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617094628063-05e3aa8b0ca4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    ],
    name: 'Emerates Lodge',
    location: 'Ifite Road, Awka',
    price: '₦180,000',
    bookings: 3,
    amenities: '4 items',
    rating: '4.5 (24)',
  },
  {
    id: '4',
    images: [
      'https://images.unsplash.com/photo-1505691723518-36a9f9232e9a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554995208-cd24bdbfc5ea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618220179428-22790b579c62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1628624747186-d5eafd0100a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615874959474-6246af79bcb4?auto=format&fit=crop&w=800&q=80',
    ],
    name: 'Emerates Lodge',
    location: 'Ifite Road, Awka',
    price: '₦180,000',
    bookings: 3,
    amenities: '4 items',
    rating: '4.5 (24)',
  },
  {
    id: '5',
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551290460-6870d3cf423d?auto=format&fit=crop&w=800&q=80',
    ],
    name: 'Emerates Lodge',
    location: 'Ifite Road, Awka',
    price: '₦180,000',
    bookings: 3,
    amenities: '4 items',
    rating: '4.5 (24)',
  },
];

export const Checkboxes = [
  { id: '1', name: 'Single Room' },
  { id: '2', name: 'Shared Room' },
  { id: '3', name: 'Self Contain' },
];
export const amenities = [
  { id: '1', name: 'Wifi' },
  { id: '2', name: 'Parking' },
  { id: '3', name: 'Kitchen' },
  { id: '4', name: '24/7 Power' },
  { id: '5', name: 'Security' },
  { id: '6', name: 'Gym' },
];

export const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
];
export const frameworks2 = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
];

export interface IAddNewProperty {
  propertyTitle: string;
  location: string;
  roomType: string;
  price: string;
  description: string;
  propertyImages: File[];
  amenities: string[];
}

export const bookingData: IBooking[] = [
  {
    bookingID: 'BK20251104-108',
    studentName: 'Cynthia Themoon',
    apartment: 'Emerates Lodge',
    roomType: 'Shared Room',
    duration: '12m',
    bookingStatus: 'Pending',
    MoveInDate: '12/12/2025',
  },
  {
    bookingID: 'BK20251104-109',
    studentName: 'Paul Micheal',
    apartment: 'Royal Lodge',
    roomType: 'Single Room',
    duration: '6m',
    bookingStatus: 'Cancelled',
    MoveInDate: '04/12/2025',
  },
  {
    bookingID: 'BK20251104-110',
    studentName: 'Oluchi Sarah',
    apartment: 'Elite Lodge',
    roomType: 'Single Room',
    duration: '2yr',
    bookingStatus: 'Pending',
    MoveInDate: '23/12/2025',
  },
  {
    bookingID: 'BK20251104-111',
    studentName: 'Godwin Martins',
    apartment: 'Founders Lodge',
    roomType: 'Self Contain',
    duration: '12m',
    bookingStatus: 'Accepted',
    MoveInDate: '18/12/2025',
  },
  {
    bookingID: 'BK20251104-112',
    studentName: 'Ada Jeremiah',
    apartment: 'Chidi Lodge',
    roomType: 'Shared Room',
    duration: '2yr',
    bookingStatus: 'Pending',
    MoveInDate: '10/01/2026',
  },
];

export const transactionData: ITransaction[] = [
  {
    transactionRef: 'TXN-20251104-108',
    studentName: 'Cynthia Themoon',
    paymentType: 'Bank Transfer',
    amount: 'Shared Room',
    date: '12/10/2025',
    statusBadge: 'Escrow Held',
  },
  {
    transactionRef: 'TXN-20251104-108',
    studentName: 'Paul Micheal',
    paymentType: 'Bank Transfer',
    amount: 'Single Room',
    date: '04/11/2025',
    statusBadge: 'Refunded',
  },
  {
    transactionRef: 'TXN-20251104-108',
    studentName: 'Oluchi Sarah',
    paymentType: 'Card Payment',
    amount: 'Single Room',
    date: '11/11/2025',
    statusBadge: 'Escrow Held',
  },
  {
    transactionRef: 'TXN-20251104-108',
    studentName: 'Godwin Martins',
    paymentType: 'Bank Transfer',
    amount: 'Self Contain',
    date: '18/09/2025',
    statusBadge: 'Successful',
  },
  {
    transactionRef: 'TXN-20251104-108',
    studentName: 'Ada Jeremiah',
    paymentType: 'Card Payment',
    amount: 'Shared Room',
    date: '10/10/2025',
    statusBadge: 'Escrow Held',
  },
];
interface ReceiptDetail {
  id: number;
  header: string;
  textOne: string;
  textTwo: string;
}

export const formatReceiptDetails = (booking: Booking | null): ReceiptDetail[] => {
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

interface Breakdown {
  id: number;
  name: string;
  value: string;
}

export const formatBreakdown = (booking: Booking | null): Breakdown[] => {
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
