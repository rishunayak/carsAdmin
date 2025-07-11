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
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    const listing = {
      ...booking.vehicle,
      price: booking.vehicle.dailyRate,
      status: booking.status as any,
      submittedAt: booking.createdAt
    };

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
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
    const { adminId, adminName, ...listingUpdates } = updates;

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
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    const success = updateBooking(params.id, listingUpdates);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update listing' },
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
      details: `Updated listing for ${currentBooking.customerName} - Vehicle: ${currentBooking.vehicle.vehicleNumber}`
    };
    
    createAuditLog(auditLog);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}