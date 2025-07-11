import { NextRequest, NextResponse } from 'next/server';
import { getFilteredAuditLogs } from '@/lib/json-storage';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const action = searchParams.get('action') || '';
    const admin = searchParams.get('admin') || '';
    const search = searchParams.get('search') || '';

    const result = getFilteredAuditLogs(page, limit, action, admin, search);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}