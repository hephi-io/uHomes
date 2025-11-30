import { SVGs } from '@/assets/svgs/Index';

export const availableRooms = [
  { id: 1, description: 'Single Room', price: '₦250,000' },
  { id: 2, description: 'Shared Room (2-person)', price: '₦125,000' },
];

export const studentReviews = [
  {
    id: 1,
    name: 'David',
    date: '21/10/2025',
    rating: SVGs.FiveStars,
    review:
      'Novena Hostel really made my stay at school easy. The rooms are clean, the environment is peaceful, and I love that there’s always light and water. Totally worth it!',
  },
  {
    id: 2,
    name: 'Esther',
    date: '21/8/2024',
    rating: SVGs.FourAndHalfStars,
    review:
      'I’ve stayed here for two sessions now, and it’s been great. The WIFI is fast, and the location is close to everything, food spots, school, and transport. Highly recommend.',
  },
  {
    id: 3,
    name: 'Amaka',
    date: '4/10/2023',
    rating: SVGs.FourAndHalfStars,
    review:
      'It’s my first hostel off campus, and I love it here! The place feels safe, neat, and comfortable. Plus, the balcony view is perfect for evening relaxation.',
  },
  {
    id: 4,
    name: 'Emeka',
    date: '23/4/2023',
    rating: SVGs.FiveStars,
    review: 'Very neat environment, highly recommended!',
  },
  {
    id: 5,
    name: 'Samuel',
    date: '3/6/2023',
    rating: SVGs.FiveStars,
    review: 'Very neat environment, highly recommended!',
  },
];

export const paginationPlaceholders = [
  { id: 1, content: '1' },
  { id: 2, content: '2' },
  { id: 3, content: '3...' },
  { id: 4, content: '84' },
];

export const commentButtons = [
  { id: 1, text: 'The room was exactly as described!' },
  { id: 2, text: 'Clean' },
  { id: 3, text: 'safe and peaceful' },
  { id: 4, text: 'Great Room mates' },
  { id: 5, text: 'Quick maintenance support.' },
];

export const receiptDetails = [
  {
    id: 1,
    header: 'Sender details',
    textOne: 'Cynthia Themoon',
    textTwo: '9014184551 / Moniepoint MFB',
  },
  {
    id: 2,
    header: 'Recipient Details',
    textOne: 'UHomes property',
    textTwo: '0123456789 / Paystack Titans',
  },
  { id: 3, header: 'Payment Reference', textOne: 'BK20251104-108', textTwo: '' },
  { id: 4, header: 'Payment Date', textOne: 'Tuesday, November 11th, 2025 | 01:55pm', textTwo: '' },
];

export const breakdowns = [
  { id: 1, name: 'Rent', value: '₦240,000' },
  { id: 2, name: 'Service charge', value: '₦10,000' },
  { id: 3, name: 'Caution fee', value: '₦20,000' },
  { id: 4, name: 'Agreement fee (one-time)', value: '₦10,000' },
];
