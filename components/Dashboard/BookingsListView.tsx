'use client';

import React, { useState } from 'react';
import { BookingWithVehicle } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, IndianRupee, User, Phone, Home, Car, Edit } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface BookingsListViewProps {
  bookings: BookingWithVehicle[];
  onStatusUpdate: (id: string, status: 'confirmed' | 'cancelled') => void;
  onEditBooking: (id: string) => void;
}

const BookingsListView: React.FC<BookingsListViewProps> = ({ bookings, onStatusUpdate, onEditBooking }) => {
  const { user } = useAuth();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled') => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));

    try {
      const response = await fetch('/api/bookings/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, adminId: user?.id, adminName: user?.name })
      });

      if (response.ok) {
        onStatusUpdate(id, status);
        toast.success(`Booking ${status} successfully`);
      } else {
        toast.error('Failed to update booking status');
      }
    } catch (error) {
      toast.error('An error occurred while updating the booking');
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No bookings found for the current filters.</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col sm:flex-row bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4"
          >
            <div className="flex-shrink-0 w-full sm:w-48 h-32 sm:h-auto relative mb-4 sm:mb-0 sm:mr-4 rounded-md overflow-hidden">
              <Image
                src={booking.vehicle.imageUrl || '/placeholder-car.jpg'}
                alt={booking.vehicle.title}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-md"
              />
            </div>

            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{booking.vehicle.title}</h3>
                  <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {booking.vehicle.vehicleNumber} - {booking.vehicle.make} {booking.vehicle.model}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" /> {booking.customerName}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" /> {booking.customerPhone}
                  </div>
                  <div className="flex items-center col-span-full">
                    <Home className="h-4 w-4 mr-2 flex-shrink-0 text-gray-500" /> {booking.customerAddress}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" /> {formatDate(booking.startDate)} to {formatDate(booking.endDate)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" /> {booking.startTime} - {booking.endTime}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" /> {booking.vehicle.location}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <div className="text-lg font-bold flex items-center mr-auto">
                  <IndianRupee className="h-5 w-5 mr-1" /> {booking.totalCost}
                </div>

                {booking.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                      disabled={loadingStates[booking.id]}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                      disabled={loadingStates[booking.id]}
                    >
                      Confirm
                    </Button>
                  </>
                )}

                {/* Show Edit button only if booking is not confirmed or cancelled */}
                {booking.status !== 'confirmed' && booking.status !== 'cancelled' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditBooking(booking.id)}
                    title="Edit booking details"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BookingsListView;
