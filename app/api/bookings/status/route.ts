import { NextRequest, NextResponse } from 'next/server';
import { updateBooking, createAuditLog, getBookingById } from '@/lib/json-storage';
import { AuditLog } from '@/types';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, adminId, adminName } = await request.json();

    if (!id || !status || !adminId || !adminName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get current booking for audit log
    const currentBooking = getBookingById(id);
    if (!currentBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const success = updateBooking(id, { status });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update booking status' },
        { status: 500 }
      );
    }

    // Create audit log
    const auditLog: AuditLog = {
      id: Date.now().toString(),
      entityType: 'booking',
      entityId: id,
      action: status === 'confirmed' ? 'approve' : 'reject',
      adminId,
      adminName,
      timestamp: new Date().toISOString(),
      details: `${status === 'confirmed' ? 'Confirmed' : 'Cancelled'} booking for ${currentBooking.customerName} - Vehicle: ${currentBooking.vehicle.vehicleNumber}`
    };
    
    createAuditLog(auditLog);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}