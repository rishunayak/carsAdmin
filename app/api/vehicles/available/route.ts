import { NextRequest, NextResponse } from 'next/server';
import { getAvailableVehicles } from '@/lib/json-storage';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const startTime = searchParams.get('startTime') || '';
  const endTime = searchParams.get('endTime') || '';
  const excludeBookingId = searchParams.get('excludeBookingId') || undefined;

  if (!startDate || !endDate || !startTime || !endTime) {
    return NextResponse.json(
      { error: 'Missing required parameters: startDate, endDate, startTime, endTime' },
      { status: 400 }
    );
  }

  try {
    const availableVehicles = getAvailableVehicles(
      startDate,
      endDate,
      startTime,
      endTime,
      excludeBookingId
    );

    return NextResponse.json({
      vehicles: availableVehicles,
      total: availableVehicles.length
    });
  } catch (error) {
    console.error('Error fetching available vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available vehicles' },
      { status: 500 }
    );
  }
}