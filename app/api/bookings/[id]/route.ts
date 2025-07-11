import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, updateBooking, createAuditLog } from '@/lib/json-storage';
import { AuditLog } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = getBookingById(params.id);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const { adminId, adminName, ...bookingUpdates } = updates;

    if (!adminId || !adminName) {
      return NextResponse.json(
        { error: 'Admin information required' },
        { status: 400 }
      );
    }

    // Get current booking for audit log
    const currentBooking = getBookingById(params.id);
    if (!currentBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const success = updateBooking(params.id, bookingUpdates);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      );
    }

    // Create audit log
    const auditLog: AuditLog = {
      id: Date.now().toString(),
      entityType: 'booking',
      entityId: params.id,
      action: 'edit',
      adminId,
      adminName,
      timestamp: new Date().toISOString(),
      details: `Updated booking for ${currentBooking.customerName} - Vehicle: ${currentBooking.vehicle.vehicleNumber}`,
      previousData: currentBooking,
      newData: bookingUpdates
    };
    
    createAuditLog(auditLog);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}