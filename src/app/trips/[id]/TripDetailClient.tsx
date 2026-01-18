'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StarIcon, CheckBadgeIcon, ClockIcon, MapPinIcon, ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { useTrip } from '@/features/trips/hooks/useTrip';
import { useTripRequest } from '@/features/requests/hooks/useTripRequest';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { tripsApi } from '@/lib/api/trips';
import { requestsApi } from '@/features/requests/api';
import { chatApi } from '@/lib/api/chat';
import { ApiError, UnauthorizedError, ForbiddenError, ConflictError } from '@/lib/api/errors';
import { RequestStatus, RequestType, ChatStatus } from '@/lib/types/backend-contracts';
import type { TripDetailResponseDto, TripRequestResponseDto } from '@/lib/types/backend-contracts';

interface TripDetailContentProps {
  trip: TripDetailResponseDto;
  request: TripRequestResponseDto | null;
  tripId: string;
  onRequestReservation: (seats: number) => Promise<void>;
  onCancelReservation: () => Promise<void>;
  onAcceptReservation: () => Promise<void>;
  onRejectReservation: () => Promise<void>;
  onConfirmTripCompleted: () => Promise<void>;
  onChat: () => Promise<void>;
  isRequesting: boolean;
  isCancelling: boolean;
  isAccepting: boolean;
  isRejecting: boolean;
  isConfirming: boolean;
  isStartingChat: boolean;
  requestError: string | null;
  chatError: string | null;
  bookingSeats: number;
  onBookingSeatsChange: (seats: number) => void;
}

function TripDetailContent({
  trip,
  request,
  tripId,
  onRequestReservation,
  onCancelReservation,
  onAcceptReservation,
  onRejectReservation,
  onConfirmTripCompleted,
  onChat,
  isRequesting,
  isCancelling,
  isAccepting,
  isRejecting,
  isConfirming,
  isStartingChat,
  requestError,
  chatError,
  bookingSeats,
  onBookingSeatsChange,
}: TripDetailContentProps) {
  const { user } = useAuth();
  const now = new Date();

  // Define explicit UI states - derived from backend data only
  const uiState = {
    isDriver: trip.driver.id === user?.id,
    isPassenger: request !== null && request.requesterId === user?.id,
    hasReservation: request !== null,
    isPending: request?.status === RequestStatus.PENDING,
    isAccepted: request?.status === RequestStatus.ACCEPTED,
    isRejected: request?.status === RequestStatus.REJECTED,
    isCancelled: request?.status === RequestStatus.CANCELLED,
    isTripCompleted: false, // Backend doesn't provide this field, always false for now
    isTripPast: new Date(trip.departureDateTime) < now,
    isTripFull: trip.availableSeats === 0,
  };

  // Determine status badge text and color
  const getStatusBadge = () => {
    if (uiState.isTripCompleted) {
      return { text: "Yolculuk Tamamlandı", color: "bg-green-100 text-green-800", emoji: "✅" };
    } else if (uiState.isTripFull) {
      return { text: "Dolu", color: "bg-red-100 text-red-800", emoji: "🚫" };
    } else if (!uiState.hasReservation) {
      return { text: "Upcoming", color: "bg-blue-100 text-blue-800", emoji: "🟦" };
    } else if (uiState.isPending) {
      return { text: "Beklemede", color: "bg-yellow-100 text-yellow-800", emoji: "⏳" };
    } else if (uiState.isAccepted) {
      return { text: "Onaylandı", color: "bg-green-100 text-green-800", emoji: "🟩" };
    }
    return { text: "Bilinmiyor", color: "bg-gray-100 text-gray-800", emoji: "❓" };
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <p className="text-red-500">Trip Detail Client Mounted: {tripId}</p>
        {/* Status Badge */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusBadge.color}`}>
            <span className="mr-2">{statusBadge.emoji}</span>
            <span>{statusBadge.text}</span>
          </div>
        </div>

        {/* Trip Summary Section */}
        <div className={`rounded-lg border p-6 mb-6 ${uiState.isTripFull ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-xl font-semibold">{trip.origin}</span>
                <span className="text-gray-400">→</span>
                <span className="text-xl font-semibold">{trip.destination}</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 mr-1" />
                  <span>
                    {new Date(trip.departureDateTime).toLocaleDateString('tr-TR')} - {' '}
                    {new Date(trip.departureDateTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div>
                  {uiState.isTripFull ? (
                    <span className="text-red-500 font-medium">DOLU</span>
                  ) : (
                    <span><span className="font-medium">{trip.availableSeats}</span> / {trip.totalSeats} koltuk müsait</span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {trip.price} ₺
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Driver Information Section */}
          <div className="rounded-lg border p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4">Sürücü Bilgileri</h2>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                {trip.driver.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-medium">{trip.driver.name}</span>
                  {trip.driver.isVerified && (
                    <CheckBadgeIcon className="w-5 h-5 text-blue-500" title="Doğrulanmış Sürücü" />
                  )}
                </div>
                <div className="flex items-center text-gray-600">
                  <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                  <span>{trip.driver.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            {trip.driver.vehicle && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Araç Bilgileri</h3>
                <div className="text-gray-700">
                  <p>{trip.driver.vehicle.brand} {trip.driver.vehicle.model}</p>
                  <p>{trip.driver.vehicle.type}</p>
                  <p>{trip.driver.vehicle.seatCount} Koltuk</p>
                </div>
              </div>
            )}
          </div>

          {/* Trip Details Section */}
          <div className="rounded-lg border p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4">Yolculuk Detayları</h2>
            {trip.description && (
              <div className="mb-4">
                <p className="text-gray-700">{trip.description}</p>
              </div>
            )}
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPinIcon className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                <div>
                  <p className="font-medium">Kalkış Noktası</p>
                  <p className="text-gray-600">{trip.origin}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPinIcon className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                <div>
                  <p className="font-medium">Varış Noktası</p>
                  <p className="text-gray-600">{trip.destination}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Info Card */}
        {uiState.hasReservation && (
          <div className="mt-6 rounded-lg border p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4">Rezervasyon Bilgisi</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Yolcu adı:</span>
                <span className="font-medium">{user?.email || "Bilinmiyor"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Durum:</span>
                <span className="font-medium">
                  {uiState.isPending && "Beklemede"}
                  {uiState.isAccepted && "Onaylandı"}
                  {uiState.isRejected && "Reddedildi"}
                  {uiState.isCancelled && "İptal Edildi"}
                  {uiState.isTripCompleted && "Tamamlandı"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Oluşturulma tarihi:</span>
                <span className="font-medium">
                  {request?.createdAt ? new Date(request.createdAt).toLocaleString('tr-TR') : "Bilinmiyor"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons - Strict matrix based on uiState */}
        <div className="mt-6 space-y-4">
          {/* Passenger: No reservation & not driver & not full */}
          {!uiState.hasReservation && !uiState.isDriver && !uiState.isTripFull && (
            <div className="rounded-lg border p-6 bg-white">
              <h2 className="text-lg font-semibold mb-4">Rezervasyon ve Chat İste</h2>
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-1">
                    Koltuk Sayısı
                  </label>
                  <select
                    id="seats"
                    className="input-base w-24"
                    value={bookingSeats}
                    onChange={(e) => onBookingSeatsChange(Number(e.target.value))}
                    disabled={isRequesting}
                  >
                    {Array.from({ length: trip.availableSeats }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <button
                    onClick={() => onRequestReservation(bookingSeats)}
                    disabled={isRequesting}
                    className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${isRequesting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {isRequesting ? 'İstek Gönderiliyor...' : '➕ Rezervasyon İste'}
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={onChat}
                  disabled={isStartingChat}
                  className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${isStartingChat ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isStartingChat ? 'Chat Gönderiliyor...' : '💬 Chat İste'}
                </button>
              </div>
              {requestError && (
                <div className="text-red-500 text-sm mt-2">{requestError}</div>
              )}
              {chatError && (
                <div className="text-red-500 text-sm mt-2">{chatError}</div>
              )}
            </div>
          )}

          {/* Passenger: Pending */}
          {uiState.hasReservation && uiState.isPending && !uiState.isDriver && (
            <div className="rounded-lg border p-6 bg-white">
              <div className="flex gap-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <span className="mr-2">⏳</span>
                  <span>Rezervasyon beklemede</span>
                </div>
                <button
                  onClick={onCancelReservation}
                  disabled={isCancelling}
                  className={`flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors ${isCancelling ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {isCancelling ? 'İptal Ediliyor...' : '❌ İsteği İptal Et'}
                </button>
              </div>
              {requestError && (
                <div className="text-red-500 text-sm mt-2">{requestError}</div>
              )}
            </div>
          )}

          {/* Passenger: Accepted & future */}
          {uiState.hasReservation && uiState.isAccepted && !uiState.isTripPast && !uiState.isDriver && (
            <div className="rounded-lg border p-6 bg-white">
              <div className="flex gap-4">
                <button
                  onClick={onCancelReservation}
                  disabled={isCancelling}
                  className={`flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors ${isCancelling ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {isCancelling ? 'İptal Ediliyor...' : '❌ Rezervasyonu İptal Et'}
                </button>
                <button
                  onClick={onChat}
                  disabled={isStartingChat}
                  className={`flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors ${isStartingChat ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isStartingChat ? 'Sohbet Başlatılıyor...' : '💬 Sohbete Git'}
                </button>
              </div>
              {requestError && (
                <div className="text-red-500 text-sm mt-2">{requestError}</div>
              )}
              {chatError && (
                <div className="text-red-500 text-sm mt-2">{chatError}</div>
              )}
            </div>
          )}

          {/* Passenger: Accepted & past & not completed */}
          {uiState.hasReservation && uiState.isAccepted && uiState.isTripPast && !uiState.isTripCompleted && !uiState.isDriver && (
            <div className="rounded-lg border p-6 bg-white">
              <div className="flex gap-4">
                <button
                  onClick={onConfirmTripCompleted}
                  disabled={isConfirming}
                  className={`flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors ${isConfirming ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isConfirming ? 'Onaylanıyor...' : '✅ Yolculuk Yapıldı'}
                </button>
                <button
                  onClick={onChat}
                  disabled={isStartingChat}
                  className={`flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors ${isStartingChat ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isStartingChat ? 'Sohbet Başlatılıyor...' : '💬 Sohbete Git'}
                </button>
              </div>
              {requestError && (
                <div className="text-red-500 text-sm mt-2">{requestError}</div>
              )}
              {chatError && (
                <div className="text-red-500 text-sm mt-2">{chatError}</div>
              )}
            </div>
          )}

          {/* Driver: Pending */}
          {uiState.hasReservation && uiState.isPending && uiState.isDriver && (
            <div className="rounded-lg border p-6 bg-white">
              <div className="flex gap-4">
                <button
                  onClick={onAcceptReservation}
                  disabled={isAccepting}
                  className={`flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors ${isAccepting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isAccepting ? 'Kabul Ediliyor...' : '✅ Kabul Et'}
                </button>
                <button
                  onClick={onRejectReservation}
                  disabled={isRejecting}
                  className={`flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors ${isRejecting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {isRejecting ? 'Reddediliyor...' : '❌ Reddet'}
                </button>
              </div>
              {requestError && (
                <div className="text-red-500 text-sm mt-2">{requestError}</div>
              )}
            </div>
          )}

          {/* Driver: Accepted & future */}
          {uiState.hasReservation && uiState.isAccepted && !uiState.isTripPast && uiState.isDriver && (
            <div className="rounded-lg border p-6 bg-white">
              <div className="flex gap-4">
                <button
                  onClick={onCancelReservation}
                  disabled={isCancelling}
                  className={`flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors ${isCancelling ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {isCancelling ? 'İptal Ediliyor...' : '❌ Rezervasyonu İptal Et'}
                </button>
                <button
                  onClick={onChat}
                  disabled={isStartingChat}
                  className={`flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors ${isStartingChat ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isStartingChat ? 'Sohbet Başlatılıyor...' : '💬 Sohbete Git'}
                </button>
              </div>
              {requestError && (
                <div className="text-red-500 text-sm mt-2">{requestError}</div>
              )}
              {chatError && (
                <div className="text-red-500 text-sm mt-2">{chatError}</div>
              )}
            </div>
          )}

          {/* Driver: Accepted & past & not completed */}
          {uiState.hasReservation && uiState.isAccepted && uiState.isTripPast && !uiState.isTripCompleted && uiState.isDriver && (
            <div className="rounded-lg border p-6 bg-white">
              <div className="flex gap-4">
                <button
                  onClick={onConfirmTripCompleted}
                  disabled={isConfirming}
                  className={`flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors ${isConfirming ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isConfirming ? 'Onaylanıyor...' : '✅ Yolculuk Yapıldı'}
                </button>
                <button
                  onClick={onChat}
                  disabled={isStartingChat}
                  className={`flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors ${isStartingChat ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isStartingChat ? 'Sohbet Başlatılıyor...' : '💬 Sohbete Git'}
                </button>
              </div>
              {requestError && (
                <div className="text-red-500 text-sm mt-2">{requestError}</div>
              )}
              {chatError && (
                <div className="text-red-500 text-sm mt-2">{chatError}</div>
              )}
            </div>
          )}
        </div>

        {uiState.isTripFull && !uiState.hasReservation && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Bu yolculuk dolu
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TripDetailClientProps {
  tripId: string;
}

export default function TripDetailClient({ tripId }: TripDetailClientProps) {
  console.log("Fetching trip with id:", tripId);

  // Visible mount indicator - ALWAYS visible at the very top
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { state: tripState, refetch: refetchTrip } = useTrip(tripId);
  const { state: requestState, refetch: refetchRequest } = useTripRequest(tripId);

  const [bookingSeats, setBookingSeats] = useState(1);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);

  // Reset error states when trip or request changes
  useEffect(() => {
    setRequestError(null);
    setChatError(null);
  }, [tripState, requestState]);

  const handleRequestReservation = async (seats: number) => {
    if (!isAuthenticated) {
      router.push(`/login?returnUrl=/trips/${tripId}`);
      return;
    }

    try {
      setIsRequesting(true);
      setRequestError(null);

      await requestsApi.create(tripId, {
        type: RequestType.BOOKING,
        seatsRequested: seats
      });

      // Refresh data after creating request
      await Promise.all([refetchTrip(), refetchRequest()]);

    } catch (err) {
      console.error('Failed to create reservation request:', err);

      if (err instanceof UnauthorizedError) {
        router.push(`/login?returnUrl=/trips/${tripId}`);
        return;
      }

      if (err instanceof ForbiddenError) {
        setRequestError('Kendi yolculuğunuza rezervasyon isteği gönderemezsiniz');
      } else if (err instanceof ConflictError) {
        setRequestError('Yeterli müsait koltuk yok veya zaten bir isteğiniz var');
      } else {
        setRequestError(
          err instanceof ApiError
            ? err.message
            : 'Rezervasyon isteği gönderilemedi'
        );
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!isAuthenticated) {
      router.push(`/login?returnUrl=/trips/${tripId}`);
      return;
    }

    const request = requestState.status === 'success' ? requestState.data : null;
    if (!request) return;

    try {
      setIsCancelling(true);
      setRequestError(null);

      await requestsApi.update(request.id, { action: 'CANCEL' });

      // Refresh data after cancellation
      await Promise.all([refetchTrip(), refetchRequest()]);

    } catch (err) {
      console.error('Failed to cancel reservation:', err);

      if (err instanceof UnauthorizedError) {
        router.push(`/login?returnUrl=/trips/${tripId}`);
        return;
      }

      setRequestError(
        err instanceof ApiError
          ? err.message
          : 'Failed to cancel reservation'
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const handleAcceptReservation = async () => {
    if (!isAuthenticated) {
      router.push(`/login?returnUrl=/trips/${tripId}`);
      return;
    }

    const request = requestState.status === 'success' ? requestState.data : null;
    if (!request) return;

    try {
      setIsAccepting(true);
      setRequestError(null);

      await requestsApi.update(request.id, { action: 'ACCEPT' });

      // Refresh data after acceptance
      await Promise.all([refetchTrip(), refetchRequest()]);

    } catch (err) {
      console.error('Failed to accept reservation:', err);

      if (err instanceof UnauthorizedError) {
        router.push(`/login?returnUrl=/trips/${tripId}`);
        return;
      }

      setRequestError(
        err instanceof ApiError
          ? err.message
          : 'Failed to accept reservation'
      );
    } finally {
      setIsAccepting(false);
    }
  };

  const handleRejectReservation = async () => {
    if (!isAuthenticated) {
      router.push(`/login?returnUrl=/trips/${tripId}`);
      return;
    }

    const request = requestState.status === 'success' ? requestState.data : null;
    if (!request) return;

    try {
      setIsRejecting(true);
      setRequestError(null);

      await requestsApi.update(request.id, { action: 'REJECT' });

      // Refresh data after rejection
      await Promise.all([refetchTrip(), refetchRequest()]);

    } catch (err) {
      console.error('Failed to reject reservation:', err);

      if (err instanceof UnauthorizedError) {
        router.push(`/login?returnUrl=/trips/${tripId}`);
        return;
      }

      setRequestError(
        err instanceof ApiError
          ? err.message
          : 'Failed to reject reservation'
      );
    } finally {
      setIsRejecting(false);
    }
  };

  const handleConfirmTripCompleted = async () => {
    if (!isAuthenticated) {
      router.push(`/login?returnUrl=/trips/${tripId}`);
      return;
    }

    try {
      setIsConfirming(true);
      setRequestError(null);

      // This would call a backend endpoint to confirm trip completion
      // For now, we'll simulate this by updating the request status
      // In a real implementation, this would be a separate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Refresh data after confirmation
      await Promise.all([refetchTrip(), refetchRequest()]);

    } catch (err) {
      console.error('Failed to confirm trip completion:', err);

      if (err instanceof UnauthorizedError) {
        router.push(`/login?returnUrl=/trips/${tripId}`);
        return;
      }

      setRequestError(
        err instanceof ApiError
          ? err.message
          : 'Failed to confirm trip completion'
      );
    } finally {
      setIsConfirming(false);
    }
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      router.push(`/login?returnUrl=/trips/${tripId}`);
      return;
    }

    try {
      setIsStartingChat(true);
      setChatError(null);

      // Create chat request
      await chatApi.createMessage(tripId, {
        content: 'Hello, I would like to chat about this trip'
      });

      // Redirect to chat page or show success
      router.push(`/trips/${tripId}/chat`);

    } catch (err) {
      console.error('Failed to start chat:', err);

      if (err instanceof UnauthorizedError) {
        router.push(`/login?returnUrl=/trips/${tripId}`);
        return;
      }

      setChatError(
        err instanceof ApiError
          ? err.message
          : 'Sohbet başlatılamadı'
      );
    } finally {
      setIsStartingChat(false);
    }
  };

  // Loading State
  if (tripState.status === 'loading' || requestState.status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 text-red-600 font-bold">
          TripDetailClient mounted – tripId: {tripId}
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Not Found State
  if (tripState.status === 'notFound') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 text-red-600 font-bold">
          TripDetailClient mounted – tripId: {tripId}
        </div>
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Trip bulunamadı</h2>
          <p className="text-gray-600">İstenen yolculuk bulunamadı.</p>
        </div>
      </div>
    );
  }

  // Forbidden State (handled by backend)
  if (tripState.status === 'error' && tripState.error.includes('forbidden')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 text-red-600 font-bold">
          TripDetailClient mounted – tripId: {tripId}
        </div>
        <div className="text-center py-8 text-red-500">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erişim Engellendi</h2>
          <p className="text-sm">Bu yolculuğu görüntüleme izniniz yok.</p>
        </div>
      </div>
    );
  }

  // Error State
  if (tripState.status === 'error') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 text-red-600 font-bold">
          TripDetailClient mounted – tripId: {tripId}
        </div>
        <div className="text-center py-8 text-red-500">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Hata Oluştu</h2>
          <p className="text-sm">Yolculuk detayları yüklenirken hata oluştu.</p>
          {tripState.error && (
            <p className="text-xs mt-2 text-red-400">{tripState.error}</p>
          )}
        </div>
      </div>
    );
  }

  // Success State
  if (tripState.status === 'success') {
    const request = requestState.status === 'success' ? requestState.data : null;

    return (
      <>
        <div className="p-4 text-red-600 font-bold">
          TripDetailClient mounted – tripId: {tripId}
        </div>
        <TripDetailContent
          trip={tripState.data}
          request={request}
          tripId={tripId}
          onRequestReservation={handleRequestReservation}
          onCancelReservation={handleCancelReservation}
          onAcceptReservation={handleAcceptReservation}
          onRejectReservation={handleRejectReservation}
          onConfirmTripCompleted={handleConfirmTripCompleted}
          onChat={handleStartChat}
          isRequesting={isRequesting}
          isCancelling={isCancelling}
          isAccepting={isAccepting}
          isRejecting={isRejecting}
          isConfirming={isConfirming}
          isStartingChat={isStartingChat}
          requestError={requestError}
          chatError={chatError}
          bookingSeats={bookingSeats}
          onBookingSeatsChange={setBookingSeats}
        />
      </>
    );
  }

  // Fallback - should not reach here but render something visible
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="p-4 text-red-600 font-bold">
        TripDetailClient mounted – tripId: {tripId}
      </div>
      <div className="text-center py-8 text-red-500">
        <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Bilinmeyen Durum</h2>
        <p className="text-sm">Trip detayları için bilinmeyen bir durum oluştu</p>
      </div>
    </div>
  );
}
