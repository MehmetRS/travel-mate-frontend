'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRequests } from './hooks/useRequests';
import {
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  BookmarkIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function RequestsClient() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const {
    requests,
    isLoading,
    error,
    successMessage,
    refetch,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    clearMessages
  } = useRequests();

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8"></div>

          <div className="space-y-6">
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Don't render content until authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Filter requests to show only pending ones (for action)
  const pendingRequests = requests.filter(req => req.status === 'PENDING');
  const completedRequests = requests.filter(req => req.status !== 'PENDING');

  const handleAccept = async (requestId: string) => {
    if (confirm('Are you sure you want to accept this request?')) {
      try {
        await acceptRequest(requestId);
      } catch (error) {
        // Error is already handled by the hook
      }
    }
  };

  const handleReject = async (requestId: string) => {
    if (confirm('Are you sure you want to reject this request?')) {
      try {
        await rejectRequest(requestId);
      } catch (error) {
        // Error is already handled by the hook
      }
    }
  };

  const handleCancel = async (requestId: string) => {
    if (confirm('Are you sure you want to cancel this request?')) {
      try {
        await cancelRequest(requestId);
      } catch (error) {
        // Error is already handled by the hook
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trip Requests</h1>
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Dashboard
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-green-700">{successMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={clearMessages}
                className="text-green-500 hover:text-green-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requests Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <ClockIcon className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircleIcon className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Accepted Requests</p>
              <p className="text-3xl font-bold text-green-600">
                {completedRequests.filter(r => r.status === 'ACCEPTED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <XCircleIcon className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Rejected Requests</p>
              <p className="text-3xl font-bold text-red-600">
                {completedRequests.filter(r => r.status === 'REJECTED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <ClockIcon className="w-6 h-6 mr-2 text-yellow-500" />
            Pending Requests
          </h2>

          <div className="space-y-6">
            {pendingRequests.map(request => (
              <RequestCard
                key={request.id}
                request={request}
                onAccept={handleAccept}
                onReject={handleReject}
                onCancel={handleCancel}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Requests Section */}
      {completedRequests.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <CheckCircleIcon className="w-6 h-6 mr-2 text-green-500" />
            Completed Requests
          </h2>

          <div className="space-y-6">
            {completedRequests.map(request => (
              <RequestCard
                key={request.id}
                request={request}
                onAccept={() => {}}
                onReject={() => {}}
                onCancel={() => {}}
                isCompleted={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {requests.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-6">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-500 mb-4">You don't have any trip requests yet.</p>
          <p className="text-sm text-gray-400">
            Requests will appear here when travelers want to join your trips.
          </p>
        </div>
      )}
    </div>
  );
}

// Request Card Component
function RequestCard({ request, onAccept, onReject, onCancel, isCompleted = false }: {
  request: any,
  onAccept: (requestId: string) => void,
  onReject: (requestId: string) => void,
  onCancel: (requestId: string) => void,
  isCompleted?: boolean
}) {
  const getStatusBadge = () => {
    switch (request.status) {
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Pending</span>;
      case 'ACCEPTED':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Accepted</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Rejected</span>;
      case 'CANCELLED':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Cancelled</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">{request.status}</span>;
    }
  };

  const getRequestTypeIcon = () => {
    switch (request.type) {
      case 'BOOKING':
        return <BookmarkIcon className="w-5 h-5 text-blue-500" />;
      case 'CHAT':
        return <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-500" />;
      default:
        return <ArrowRightIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Trip Info */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              {getRequestTypeIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Trip: {request.tripId}
              </h3>
              <p className="text-sm text-gray-500">
                Request from: {request.requester?.name || 'Unknown traveler'}
              </p>
            </div>
          </div>

          {/* Request Details */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-gray-500">Type</p>
              <p className="font-medium capitalize">{request.type.toLowerCase()}</p>
            </div>

            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium">{getStatusBadge()}</p>
            </div>

            {request.seatsRequested && (
              <div>
                <p className="text-gray-500">Seats Requested</p>
                <p className="font-medium">{request.seatsRequested}</p>
              </div>
            )}

            <div>
              <p className="text-gray-500">Requested At</p>
              <p className="font-medium">
                {new Date(request.createdAt).toLocaleString('tr-TR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {!isCompleted && (
            <div className="flex space-x-3">
              <button
                onClick={() => onAccept(request.id)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                Accept
              </button>

              <button
                onClick={() => onReject(request.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                Reject
              </button>

              <button
                onClick={() => onCancel(request.id)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center"
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
