'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookingWithVehicle } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Dashboard/Header';
import Filters from '@/components/Dashboard/Filters';
import BookingsTable from '@/components/Dashboard/BookingsTable';
import BookingsListView from '@/components/Dashboard/BookingsListView';
import Pagination from '@/components/Dashboard/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, CheckCircle, Clock, XCircle, Table, List } from 'lucide-react';

interface BookingsResponse {
  bookings: BookingWithVehicle[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<BookingsResponse>({
    bookings: [],
    total: 0,
    totalPages: 0,
    currentPage: 1
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1
  });
  const [view, setView] = useState<'table' | 'list'>('table');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setView('list');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: '10',
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`/api/bookings?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const handleStatusUpdate = (id: string, status: 'confirmed' | 'cancelled') => {
    setData(prev => ({
      ...prev,
      bookings: prev.bookings.map(booking =>
        booking.id === id ? { ...booking, status } : booking
      )
    }));
  };

  const handleApplyFilters = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleEditBooking = (id: string) => {
    router.push(`/dashboard/edit-booking/${id}`);
  };

  const stats = {
    total: data.total,
    pending: data.bookings.filter(b => b.status === 'pending').length,
    confirmed: data.bookings.filter(b => b.status === 'confirmed').length,
    cancelled: data.bookings.filter(b => b.status === 'cancelled').length
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Filters
              status={filters.status}
              search={filters.search}
              onStatusChange={(status) => setFilters(prev => ({ ...prev, status }))}
              onSearchChange={(search) => setFilters(prev => ({ ...prev, search }))}
              onApplyFilters={handleApplyFilters}
            />
          </div>
          
          <div className="flex justify-end mb-4">
            <div className="hidden md:flex space-x-2">
              <Button
                variant={view === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('table')}
                title="Table View"
              >
                <Table className="h-4 w-4 mr-2" /> Table
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('list')}
                title="List View"
              >
                <List className="h-4 w-4 mr-2" /> List
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading bookings...</p>
            </div>
          ) : (
            <>
              {view === 'table' ? (
                <BookingsTable
                  bookings={data.bookings}
                  onStatusUpdate={handleStatusUpdate}
                  onEditBooking={handleEditBooking}
                />
              ) : (
                <BookingsListView
                  bookings={data.bookings}
                  onStatusUpdate={handleStatusUpdate}
                  onEditBooking={handleEditBooking}
                />
              )}
            </>
          )}

          <Pagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}