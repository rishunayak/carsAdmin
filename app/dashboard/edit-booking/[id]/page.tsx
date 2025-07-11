'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BookingWithVehicle, Vehicle } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Dashboard/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Loader2, User, Calendar, Car, IndianRupee, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { calculateBookingCost } from '@/lib/data';

interface EditBookingPageProps {
  params: { id: string };
}

interface BookingFormData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  bookingType: 'hourly' | 'daily';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  vehicleId: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

export default function EditBookingPage({ params }: EditBookingPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [booking, setBooking] = useState<BookingWithVehicle | null>(null);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    bookingType: 'daily',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    vehicleId: ''
  });

  useEffect(() => {
    fetchBooking();
  }, [params.id]);

  useEffect(() => {
    if (formData.startDate && formData.endDate && formData.startTime && formData.endTime) {
      fetchAvailableVehicles();
    }
  }, [formData.startDate, formData.endDate, formData.startTime, formData.endTime]);

  const fetchBooking = async () => {
  try {
    const response = await fetch(`/api/bookings/${params.id}`);
    if (response.ok) {
      const bookingData = await response.json();
      console.log('Fetched booking data:', bookingData);

      if (bookingData.status === 'confirmed' || bookingData.status === 'cancelled') {
        toast.warning(`Can't edit this booking because it is ${bookingData.status}.`);
        router.push('/dashboard');
        return;
      }

      setBooking(bookingData);
      setFormData({
        customerName: bookingData.customerName,
        customerPhone: bookingData.customerPhone,
        customerAddress: bookingData.customerAddress,
        bookingType: bookingData.bookingType,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        vehicleId: bookingData.vehicleId,
        status: bookingData.status
      });
    } else {
      toast.error('Booking not found');
      router.push('/dashboard');
    }
  } catch (error) {
    toast.error('Failed to fetch booking');
    router.push('/dashboard');
  } finally {
    setLoading(false);
  }
};

  const fetchAvailableVehicles = async () => {
    try {
      const params = new URLSearchParams({
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        excludeBookingId: booking?.id || ''
      });

      const response = await fetch(`/api/vehicles/available?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableVehicles(data.vehicles);
      }
    } catch (error) {
      console.error('Failed to fetch available vehicles:', error);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateNewCost = (): number => {
    if (!formData.vehicleId || !formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime) {
      return 0;
    }

    return calculateBookingCost(
      formData.vehicleId,
      formData.bookingType,
      formData.startDate,
      formData.endDate,
      formData.startTime,
      formData.endTime
    );
  };

  const handleSave = async () => {
    if (!booking || !user) return;

    // Validation
    if (!formData.customerName || !formData.customerPhone || !formData.customerAddress) {
      toast.error('Please fill in all customer details');
      return;
    }

    if (!formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime) {
      toast.error('Please fill in all booking period details');
      return;
    }

    if (!formData.vehicleId) {
      toast.error('Please select a vehicle');
      return;
    }

    setSaving(true);
    try {
      const newTotalCost = calculateNewCost();
      
      const updates = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        bookingType: formData.bookingType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        vehicleId: formData.vehicleId,
        totalCost: newTotalCost,
        adminId: user.id,
        adminName: user.name
      };

      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        toast.success('Booking updated successfully');
        router.push('/dashboard');
      } else {
        toast.error('Failed to update booking');
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
      toast.error('An error occurred while updating the booking');
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-4xl mx-auto py-6 px-4">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!booking) {
    return null;
  }

  const selectedVehicle = availableVehicles.find(v => v.id === formData.vehicleId);
  const newTotalCost = calculateNewCost();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Booking</h1>
                <p className="text-gray-500">Modify customer details, booking period, and vehicle</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">
                Pending Approval
              </Badge>
            </div>
          </div>

          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Contact Number</Label>
                    <Input
                      id="customerPhone"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="customerAddress">Customer Address</Label>
                  <Input
                    id="customerAddress"
                    value={formData.customerAddress}
                    onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                    placeholder="Enter customer address"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Booking Period
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bookingType">Booking Type</Label>
                  <Select 
                    value={formData.bookingType} 
                    onValueChange={(value: 'daily' | 'hourly') => handleInputChange('bookingType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.bookingType === 'daily' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="startDate">Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => {
                          handleInputChange('startDate', e.target.value);
                          handleInputChange('endDate', e.target.value);
                        }}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {formData.bookingType === 'daily' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vehicle Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="h-5 w-5 mr-2" />
                  Vehicle Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableVehicles.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles available</h3>
                    <p className="text-gray-500">No vehicles are available for the selected time period.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Label>Select Vehicle</Label>
                    <Select value={formData.vehicleId} onValueChange={(value) => handleInputChange('vehicleId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{vehicle.vehicleNumber} - {vehicle.title}</span>
                              <span className="ml-4 text-sm text-gray-500">
                                ₹{vehicle.dailyRate}/day
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedVehicle && (
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <img
                            src={selectedVehicle.imageUrl}
                            alt={selectedVehicle.title}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{selectedVehicle.title}</h4>
                            <p className="text-sm font-mono text-gray-600">
                              {selectedVehicle.vehicleNumber}
                            </p>
                            <p className="text-sm text-gray-500">{selectedVehicle.location}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline">{selectedVehicle.category}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ₹{selectedVehicle.hourlyRate}/hour
                            </p>
                            <p className="text-sm text-gray-500">
                              ₹{selectedVehicle.dailyRate}/day
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {newTotalCost > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <IndianRupee className="h-5 w-5 mr-2" />
                    Updated Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Booking Type:</span>
                      <Badge variant="outline">{formData.bookingType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Original Cost:</span>
                      <span>{formatPrice(booking.totalCost)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>New Total Cost:</span>
                      <span className={newTotalCost !== booking.totalCost ? 'text-blue-600' : ''}>
                        {formatPrice(newTotalCost)}
                      </span>
                    </div>
                    {newTotalCost !== booking.totalCost && (
                      <div className="flex justify-between text-sm">
                        <span>Difference:</span>
                        <span className={newTotalCost > booking.totalCost ? 'text-red-600' : 'text-green-600'}>
                          {newTotalCost > booking.totalCost ? '+' : ''}{formatPrice(newTotalCost - booking.totalCost)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving || !formData.vehicleId || newTotalCost === 0}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Booking...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Booking
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}