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
  id: string;
  type: string;
  brand: string;
  model: string;
  seatCount: number;
  licensePlate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleDto {
  type: string;
  brand: string;
  model: string;
  seatCount: number;
  licensePlate?: string | null;
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
// CHAT STATUS TYPES
// ============================================================================

export enum ChatStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
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
  status?: ChatStatus;
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
