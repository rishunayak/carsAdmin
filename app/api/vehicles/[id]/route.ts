import { NextRequest, NextResponse } from 'next/server';
import { getVehicleById, updateVehicle, createAuditLog } from '@/lib/json-storage';
import { AuditLog } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vehicle = getVehicleById(params.id);

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
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
    const { adminId, adminName, ...vehicleUpdates } = updates;

    if (!adminId || !adminName) {
      return NextResponse.json(
        { error: 'Admin information required' },
        { status: 400 }
      );
    }

    // Get current vehicle for audit log
    const currentVehicle = getVehicleById(params.id);
    if (!currentVehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    const success = updateVehicle(params.id, vehicleUpdates);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update vehicle' },
        { status: 500 }
      );
    }

    // Create audit log
    const auditLog: AuditLog = {
      id: Date.now().toString(),
      entityType: 'vehicle',
      entityId: params.id,
      action: 'edit',
      adminId,
      adminName,
      timestamp: new Date().toISOString(),
      details: `Updated vehicle ${currentVehicle.vehicleNumber} - ${currentVehicle.title}`,
      previousData: currentVehicle,
      newData: vehicleUpdates
    };
    
    createAuditLog(auditLog);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    );
  }
}