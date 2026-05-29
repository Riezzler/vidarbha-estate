import { Property } from './types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Imperial Crown Heritage Villa',
    address: 'Temple Road, Near Raj Bhavan, Civil Lines',
    city: 'Civil Lines',
    state: 'Maharashtra',
    pincode: '440001',
    beds: 5,
    baths: 5,
    sqft: 5800,
    price: 155000000, // ₹15.5 Crore
    isRent: false,
    type: 'Villa',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    agent: {
      name: 'Anurag Kewat',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      phone: '9545160270',
      email: 'anuragkewat265@gmail.com',
      rating: 5.0
    },
    isSaved: false
  },
  {
    id: 'prop-2',
    title: 'The WHC View Luxury Penthouse',
    address: 'West High Court Road, Dharampeth',
    city: 'Dharampeth',
    state: 'Maharashtra',
    pincode: '440010',
    beds: 4,
    baths: 4,
    sqft: 4200,
    price: 68000000, // ₹6.8 Crore
    isRent: false,
    type: 'Penthouse',
    imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
    agent: {
      name: 'Anurag Kewat',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      phone: '9545160270',
      email: 'anuragkewat265@gmail.com',
      rating: 4.9
    },
    isSaved: true
  },
  {
    id: 'prop-3',
    title: 'Somnath Gated Estate Villa',
    address: 'Airport Road, near VIP Lounge, Wardha Road',
    city: 'Wardha Road',
    state: 'Maharashtra',
    pincode: '440015',
    beds: 5,
    baths: 5,
    sqft: 4800,
    price: 85000000, // ₹8.5 Crore
    isRent: false,
    type: 'Villa',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    agent: {
      name: 'Anurag Kewat',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      phone: '9545160270',
      email: 'anuragkewat265@gmail.com',
      rating: 5.0
    },
    isSaved: false
  },
  {
    id: 'prop-4',
    title: 'Canal Road Regency Duplex Suites',
    address: 'Near Central Mall, Ramdaspeth',
    city: 'Ramdaspeth',
    state: 'Maharashtra',
    pincode: '440010',
    beds: 3,
    baths: 3,
    sqft: 3200,
    price: 42000000, // ₹4.2 Crore
    isRent: false,
    type: 'Apartment',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    agent: {
      name: 'Anurag Kewat',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      phone: '9545160270',
      email: 'anuragkewat265@gmail.com',
      rating: 4.8
    },
    isSaved: false
  },
  {
    id: 'prop-5',
    title: 'Pioneer Royal Bungalow',
    address: 'Near Pratap Nagar Square, Pratap Nagar',
    city: 'Pratap Nagar',
    state: 'Maharashtra',
    pincode: '440022',
    beds: 4,
    baths: 4,
    sqft: 3600,
    price: 52000000, // ₹5.2 Crore
    isRent: false,
    type: 'House',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    agent: {
      name: 'Anurag Kewat',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      phone: '9545160270',
      email: 'anuragkewat265@gmail.com',
      rating: 4.9
    },
    isSaved: false
  },
  {
    id: 'prop-6',
    title: 'MIHAN Corporate Logistics Hub',
    address: 'Beltarodi-Besa Road, Near Manish Nagar T-Point',
    city: 'Besa-Manish Nagar',
    state: 'Maharashtra',
    pincode: '440034',
    beds: 6,
    baths: 4,
    sqft: 6500,
    price: 110000000, // ₹11 Crore
    isRent: false,
    type: 'Commercial',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    agent: {
      name: 'Anurag Kewat',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      phone: '9545160270',
      email: 'anuragkewat265@gmail.com',
      rating: 5.0
    },
    isSaved: false
  }
];

export const CITIES = ['All Cities', 'Civil Lines', 'Dharampeth', 'Wardha Road', 'Ramdaspeth', 'Pratap Nagar', 'Besa-Manish Nagar'];
export const PROPERTY_TYPES = ['All Types', 'Apartment', 'House', 'Penthouse', 'Villa', 'Commercial'];
export const BEDROOM_OPTIONS = ['Any Beds', '1-2 Beds', '3-4 Beds', '5+ Beds'];

// Format function to show indian rupees in Lakh and Crore beautifully
export function formatINR(value: number, format: 'LAKH_CRORE' | 'FULL_NUMERIC' | 'SHORT_CR' = 'LAKH_CRORE'): string {
  if (format === 'FULL_NUMERIC') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }

  // Calculate in Lakh or Crore
  const lakh = 100000;
  const crore = 10000000;

  if (value >= crore) {
    const crVal = value / crore;
    // Round to 2 decimal places unless it's a whole number
    const formatted = crVal % 1 === 0 ? crVal.toString() : crVal.toFixed(2);
    return format === 'SHORT_CR' ? `₹${formatted} Cr` : `₹${formatted} Crores`;
  } else if (value >= lakh) {
    const lVal = value / lakh;
    const formatted = lVal % 1 === 0 ? lVal.toString() : lVal.toFixed(2);
    return format === 'SHORT_CR' ? `₹${formatted} L` : `₹${formatted} Lakhs`;
  } else {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }
}
