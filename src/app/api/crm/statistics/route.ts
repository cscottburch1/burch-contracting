import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(request: NextRequest) {
  try {
    const statistics = await query(`
      SELECT
        status,
        COUNT(*) as count,
        AVG(estimated_value) as avg_value,
        SUM(estimated_value) as total_value
      FROM contact_leads
      GROUP BY status
    `);

    return NextResponse.json(
      { statistics },
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
