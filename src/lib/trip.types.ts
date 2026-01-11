export type Trip = {
  id: string;
  origin: string;
  destination: string;
  departureDateTime: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  isFull: boolean;
  description?: string;
  driver: {
    id: string;
    name: string;
    rating: number;
    isVerified: boolean;
    vehicle: {
      vehicleType: string;
      brand: string;
      model: string;
      seats: number;
    } | null;
  };
  createdAt?: string;
};

// Filter types for client-side filtering
export type TripFilters = {
  minPrice?: number;
  maxPrice?: number;
  date?: string;
  verifiedOnly: boolean;
  minSeats: number;
};

// Sort options for trip listing
export enum TripSortOption {
  DATE_ASC = 'date_asc',
  DATE_DESC = 'date_desc',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  RATING_DESC = 'rating_desc'
}
