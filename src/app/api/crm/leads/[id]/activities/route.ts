import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const activities = await query(
      'SELECT * FROM lead_activities WHERE lead_id = ? ORDER BY created_at DESC',
      [params.id]
    );

    return NextResponse.json(
      { activities },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
