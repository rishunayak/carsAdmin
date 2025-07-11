import { NextRequest, NextResponse } from 'next/server';
import { getFilteredBookings } from '@/lib/json-storage';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const status = searchParams.get('status') || '';
  const search = searchParams.get('search') || '';

  try {
    const result = getFilteredBookings(page, limit, status, search);
    
    const listings = result.bookings.map(booking => ({
      ...booking.vehicle,
      price: booking.vehicle.dailyRate,
      status: booking.status as any,
      submittedAt: booking.createdAt
    }));

    return NextResponse.json({
      listings,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}