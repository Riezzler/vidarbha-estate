export interface Agent {
  name: string;
  avatar: string;
  phone: string;
  email: string;
  rating: number;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  beds: number;
  baths: number;
  sqft: number;
  price: number; // In Indian Rupees
  isRent: boolean;
  type: 'Apartment' | 'House' | 'Penthouse' | 'Villa' | 'Commercial';
  imageUrl: string;
  agent: Agent;
  isSaved?: boolean;
}

export type CurrencyFormat = 'LAKH_CRORE' | 'FULL_NUMERIC' | 'SHORT_CR';
