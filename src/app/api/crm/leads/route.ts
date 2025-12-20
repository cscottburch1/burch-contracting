import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(request: NextRequest) {
  try {
    const sql = `
      SELECT * FROM contact_leads
      ORDER BY created_at DESC
    `;

    const leads = await query(sql);

    return NextResponse.json(
      { leads },
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
