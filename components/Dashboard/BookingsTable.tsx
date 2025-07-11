'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingWithVehicle } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Check, X, Edit, Calendar, User, Car, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

interface BookingsTableProps {
  bookings: BookingWithVehicle[];
  onStatusUpdate: (id: string, status: 'confirmed' | 'cancelled') => void;
}

export default function BookingsTable({ bookings, onStatusUpdate }: BookingsTableProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

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

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
      completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800' }
    };

    const statusConfig = config[status as keyof typeof config] || { 
      label: status, 
      className: 'bg-gray-100 text-gray-800' 
    };

    return (
      <Badge className={statusConfig.className}>
        {statusConfig.label}
      </Badge>
    );
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  if (bookings.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
        <p className="text-gray-500">No bookings match your current filters.</p>
      </Card>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Customer Name</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{booking.customerName}</p>
                    <p className="text-sm text-gray-500">{booking.customerPhone}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <img
                    src={booking.vehicle.imageUrl}
                    alt={booking.vehicle.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900 font-mono text-sm">
                      {booking.vehicle.vehicleNumber}
                    </p>
                    <p className="text-sm text-gray-500">{booking.vehicle.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {booking.bookingType}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {booking.bookingType === 'daily' 
                          ? `${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}`
                          : `${formatDate(booking.startDate)} ${booking.startTime}-${booking.endTime}`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 flex items-center">
                    {formatPrice(booking.totalCost)}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    {booking.bookingType === 'daily' ? 'Daily rate' : 'Hourly rate'}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(booking.status)}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p className="text-gray-900">{formatDate(booking.createdAt)}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {booking.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                        disabled={loadingStates[booking.id]}
                        title="Confirm booking"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                        disabled={loadingStates[booking.id]}
                        title="Cancel booking"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/dashboard/edit-booking/${booking.id}`)}
                        title="Edit booking details"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {booking.status !== 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/dashboard/view-booking/${booking.id}`)}
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}