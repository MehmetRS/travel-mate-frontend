'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import {
  UserIcon,
  StarIcon,
  CheckBadgeIcon,
  TruckIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  IdentificationIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function ProfileClient() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const {
    profile,
    vehicles,
    isLoading,
    error,
    successMessage,
    refetch,
    addVehicle,
    deleteVehicle,
    clearMessages
  } = useProfile();

  // Vehicle form state
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    type: '',
    brand: '',
    model: '',
    seatCount: 2,
    licensePlate: ''
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state - only after failed retry, not on first load
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

  // Handle missing_vehicle query param
  const searchParams = new URLSearchParams(window.location.search);
  const isMissingVehicle = searchParams.get('reason') === 'missing_vehicle';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewVehicle(prev => ({
      ...prev,
      [name]: name === 'seatCount' ? parseInt(value) || 1 : value
    }));
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addVehicle(newVehicle);
      setIsAddingVehicle(false);
      setNewVehicle({
        type: '',
        brand: '',
        model: '',
        seatCount: 2,
        licensePlate: ''
      });
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(vehicleId);
      } catch (error) {
        // Error is already handled by the hook
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
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

      {/* Friendly info banner for missing_vehicle case */}
      {isMissingVehicle && (
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <TruckIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-blue-700">
                You need to add a vehicle before creating a trip
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckIcon className="h-5 w-5 text-green-400" />
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

      {/* Profile Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Profile Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <UserIcon className="w-6 h-6 mr-2 text-blue-500" />
            Profile Information
          </h2>

          <div className="space-y-4">
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
              <p className="text-sm text-gray-500">Verification Status</p>
              <div className="flex items-center">
                {profile.isVerified ? (
                  <>
                    <CheckBadgeIcon className="w-5 h-5 text-green-500 mr-1" />
                    <span className="font-medium text-green-600">Verified</span>
                  </>
                ) : (
                  <>
                    <ClockIcon className="w-5 h-5 text-yellow-500 mr-1" />
                    <span className="font-medium text-yellow-600">Pending</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">
                {new Date(profile.createdAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2 text-blue-500" />
            Account Stats
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Vehicles</p>
              <p className="text-2xl font-bold text-blue-600">{vehicles.length}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Account Status</p>
              <p className="text-lg font-semibold text-green-600">Active</p>
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-2">Vehicles are required for trip creation</p>
              <Link
                href="/trips/create"
                className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
              >
                Create Trip
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <TruckIcon className="w-6 h-6 mr-2 text-blue-500" />
              My Vehicles
            </h2>

          <button
            onClick={() => setIsAddingVehicle(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Vehicle
          </button>
        </div>

        {/* Vehicle List */}
        {vehicles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No vehicles found</p>
            <p className="text-sm text-gray-400 mb-4">Add a vehicle to start creating trips</p>
            <button
              onClick={() => setIsAddingVehicle(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <TruckIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {vehicle.type} • {vehicle.seatCount} seats
                        {vehicle.licensePlate && ` • ${vehicle.licensePlate}`}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                  title="Delete vehicle"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Vehicle Modal/Form */}
      {isAddingVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <PlusIcon className="w-6 h-6 mr-2 text-green-500" />
                Add New Vehicle
              </h2>
              <button
                onClick={() => setIsAddingVehicle(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={newVehicle.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select vehicle type</option>
                  <option value="CAR">Car</option>
                  <option value="VAN">Van</option>
                  <option value="MOTORCYCLE">Motorcycle</option>
                </select>
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={newVehicle.brand}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Toyota, Ford, BMW"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={newVehicle.model}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Corolla, F-150, X5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="seatCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Seat Count
                </label>
                <input
                  type="number"
                  id="seatCount"
                  name="seatCount"
                  value={newVehicle.seatCount}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">
                  License Plate (optional)
                </label>
                <input
                  type="text"
                  id="licensePlate"
                  name="licensePlate"
                  value={newVehicle.licensePlate}
                  onChange={handleInputChange}
                  placeholder="e.g., 34ABC123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingVehicle(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
