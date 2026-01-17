'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { StarIcon, CheckBadgeIcon, ArrowRightIcon, UserIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import TripCard from '@/components/TripCard';

export default function DashboardClient() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { profile, upcomingTrips, pastPendingTrips, pastCompletedTrips, isLoading, error, refetch } = useDashboard();

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
          {/* Header skeleton */}
          <div className="h-8 bg-gray-200 rounded mb-8"></div>

          {/* Profile section skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Trips sections skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-4">
                <div className="h-20 bg-gray-100 rounded"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
              </div>
            </div>

            <div>
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-4">
                <div className="h-20 bg-gray-100 rounded"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
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
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Don't render content until authenticated
  if (!isAuthenticated || !user || !profile) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Profile Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* User Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <UserIcon className="w-6 h-6 mr-2 text-blue-500" />
            Profile Summary
          </h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{profile.name || 'Not set'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Rating</p>
              <div className="flex items-center">
                <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-medium">{profile.rating.toFixed(1)}</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Vehicles</p>
              <p className="font-medium">{profile.vehiclesCount} registered</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <ArrowRightIcon className="w-6 h-6 mr-2 text-blue-500" />
            Quick Actions
          </h2>

          <div className="space-y-3">
            <Link
              href="/trips"
              className="block w-full text-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
            >
              Search Trips
            </Link>

            <Link
              href="/trips/create"
              className="block w-full text-center px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
            >
              Create Trip
            </Link>

            <Link
              href="/profile"
              className="block w-full text-center px-4 py-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2 text-blue-500" />
            Trip Stats
          </h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Upcoming Trips</p>
              <p className="text-2xl font-bold text-blue-600">{upcomingTrips.length}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Past Pending Trips</p>
              <p className="text-2xl font-bold text-yellow-600">{pastPendingTrips.length}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Past Completed Trips</p>
              <p className="text-2xl font-bold text-green-600">{pastCompletedTrips.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trips Sections - Three distinct sections as required */}
      <div className="space-y-8">
        {/* 1️⃣ Yaklaşan Yolculuklar (Upcoming Trips) */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <ClockIcon className="w-6 h-6 mr-2 text-blue-500" />
            Yaklaşan Yolculuklar
          </h2>

          {upcomingTrips.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Henüz yaklaşan yolculuğunuz yok</p>
              <Link
                href="/trips"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                Yolculuk ara
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} status="upcoming" />
              ))}
            </div>
          )}
        </div>

        {/* 2️⃣ Geçmiş Yolculuklar (Tamamlanmamış) */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2 text-yellow-500" />
            Geçmiş Yolculuklar (Tamamlanmamış)
          </h2>

          {pastPendingTrips.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Tamamlanmamış geçmiş yolculuğunuz yok</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastPendingTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} status="pending" />
              ))}
            </div>
          )}
        </div>

        {/* 3️⃣ Tamamlanan Yolculuklar */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2 text-green-500" />
            Tamamlanan Yolculuklar
          </h2>

          {pastCompletedTrips.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Tamamlanan yolculuğunuz yok</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastCompletedTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} status="completed" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Empty dashboard message if all sections are empty */}
      {upcomingTrips.length === 0 && pastPendingTrips.length === 0 && pastCompletedTrips.length === 0 && (
        <div className="text-center py-12 mt-8">
          <div className="bg-blue-50 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Hoş geldiniz!</h3>
            <p className="text-gray-600 mb-6">Henüz hiç yolculuğunuz yok. Yeni yolculuklar keşfetmek veya oluşturmak için aşağıdaki bağlantıları kullanın.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/trips"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-center"
              >
                Yolculuk Ara
              </Link>
              <Link
                href="/trips/create"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-center"
              >
                Yolculuk Oluştur
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
