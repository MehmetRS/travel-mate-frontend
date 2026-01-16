/**
 * Backend API Contracts
 * 
 * These types EXACTLY match the backend API responses.
 * DO NOT modify these types - they are the source of truth.
 * Backend: Travel Mate NestJS + Prisma
 */

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

export interface MeResponse {
  sub: string; // user id
  email: string;
}

// ============================================================================
// TRIP TYPES
// ============================================================================

export interface VehicleDto {
  vehicleType: string;
  brand: string;
  model: string;
  seats: number;
}

export interface DriverDto {
  id: string;
  name: string;
  rating: number;
  isVerified: boolean;
  vehicle: VehicleDto | null;
}

export interface TripResponseDto {
  id: string;
  origin: string;
  destination: string;
  departureDateTime: string; // ISO DateTime
  price: number;
  totalSeats: number;
  availableSeats: number;
  isFull: boolean;
  description?: string;
  driver: DriverDto;
}

export interface TripDetailResponseDto extends TripResponseDto {
  createdAt: string; // ISO DateTime
}

export interface CreateTripDto {
  origin: string;
  destination: string;
  departureDateTime: string; // ISO DateTime
  price: number;
  availableSeats: number;
  description?: string;
  vehicleId?: string;
}

// ============================================================================
// REQUEST TYPES (NEW)
// ============================================================================

export enum RequestType {
  BOOKING = 'BOOKING',
  CHAT = 'CHAT',
}

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface RequesterDto {
  id: string;
  name: string;
  rating: number;
  isVerified: boolean;
}

export interface CreateTripRequestDto {
  type: RequestType;
  seatsRequested?: number; // Required if type === BOOKING
}

export interface TripRequestResponseDto {
  id: string;
  tripId: string;
  requesterId: string;
  requester?: RequesterDto;
  type: RequestType;
  status: RequestStatus;
  seatsRequested: number | null;
  createdAt: string;
  updatedAt: string;
  chatId?: string | null; // Present after acceptance
}

export interface UpdateTripRequestDto {
  action: 'ACCEPT' | 'REJECT' | 'CANCEL';
}

// ============================================================================
// CHAT TYPES
// ============================================================================

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  LOCATION = 'LOCATION',
}

export interface MessageDto {
  id: string;
  content: string;
  senderId: string;
  messageType: MessageType;
  metadata: Record<string, any> | null;
  createdAt: string;
}

export interface ChatResponseDto {
  exists: boolean;
  chatId?: string;
  messages?: MessageDto[];
}

export interface CreateMessageDto {
  content: string;
  messageType?: MessageType;
  metadata?: Record<string, any>;
}

// ============================================================================
// PAYMENT TYPES (NEW)
// ============================================================================

export enum PaymentStatus {
  NOT_STARTED = 'NOT_STARTED',
  STARTED = 'STARTED',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface CreatePaymentDto {
  amount: number;
  requestId?: string;
}

export interface PaymentResponseDto {
  id: string;
  tripId: string;
  payerId: string;
  requestId: string | null;
  amount: number;
  status: PaymentStatus;
  providerRef: string | null;
  createdAt: string;
  updatedAt: string;
}
