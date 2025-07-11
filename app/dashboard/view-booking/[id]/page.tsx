'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookingWithVehicle } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Dashboard/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Calendar, Car, IndianRupee, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ViewBookingPageProps {
  params: { id: string };
}

export default function ViewBookingPage({ params }: ViewBookingPageProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingWithVehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setBooking(data);
        } else {
          toast.error('Oops! We couldn\'t find that booking.');
          router.push('/dashboard');
        }
      } catch (error) {
        toast.error('Failed to load booking details. Please try again.');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [params.id, router]);

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
      completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800' },
    };

    const currentStatus = statusMap[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-800',
    };

    return <Badge className={currentStatus.className}>{currentStatus.label}</Badge>;
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString();

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-4xl mx-auto py-6 px-4">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button variant="outline" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
                <p className="text-gray-500">Booking ID: {booking.id}</p>
              </div>
              {getStatusBadge(booking.status)}
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Customer Name</p>
                      <p className="font-medium text-gray-900">{booking.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-900">{booking.customerPhone}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">{booking.customerAddress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="h-5 w-5 mr-2" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <img
                    src={booking.vehicle.imageUrl}
                    alt={booking.vehicle.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{booking.vehicle.title}</h4>
                    <p className="text-sm font-mono text-gray-600">
                      {booking.vehicle.vehicleNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                    </p>
                    <p className="text-sm text-gray-500">{booking.vehicle.location}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline">{booking.vehicle.category}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ₹{booking.vehicle.hourlyRate}/hour
                    </p>
                    <p className="text-sm text-gray-500">
                      ₹{booking.vehicle.dailyRate}/day
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Booking Type</p>
                    <Badge variant="outline" className="mt-1">
                      {booking.bookingType === 'hourly' ? 'Hourly' : 'Daily'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">
                      {booking.bookingType === 'daily'
                        ? `${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}`
                        : `${formatDate(booking.startDate)} (${booking.startTime} - ${booking.endTime})`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Start Time</p>
                      <p className="font-medium text-gray-900">{booking.startTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">End Time</p>
                      <p className="font-medium text-gray-900">{booking.endTime}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <IndianRupee className="h-5 w-5 mr-2" />
                  Pricing Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total Cost</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(booking.totalCost)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Based on {booking.bookingType} rate
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Booking Created</p>
                      <p className="text-sm text-gray-500">{formatDateTime(booking.createdAt)}</p>
                    </div>
                  </div>

                  {booking.lastModified !== booking.createdAt && (
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">Last Modified</p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(booking.lastModified)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-600'
                          : booking.status === 'cancelled'
                          ? 'bg-red-600'
                          : 'bg-gray-400'
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900">Current Status</p>
                      <p className="text-sm text-gray-500">{booking.status}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}