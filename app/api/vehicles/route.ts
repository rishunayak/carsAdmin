import { NextRequest, NextResponse } from 'next/server';
import { getAllVehicles } from '@/lib/json-storage';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const vehicles = getAllVehicles();
    const activeVehicles = vehicles.filter(vehicle => vehicle.status === 'active');
    
    return NextResponse.json({
      vehicles: activeVehicles,
      total: activeVehicles.length
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}