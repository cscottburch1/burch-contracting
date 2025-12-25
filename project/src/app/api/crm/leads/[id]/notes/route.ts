import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notes = await query(
      'SELECT * FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC',
      [params.id]
    );

    return NextResponse.json(
      { notes },
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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const sql = `
      INSERT INTO lead_notes (lead_id, content, note_type, is_important, created_by)
      VALUES (?, ?, ?, ?, ?)
    `;

    await query(sql, [
      params.id,
      body.content,
      body.note_type || 'general',
      body.is_important || false,
      body.created_by || 'System'
    ]);

    const notes = await query(
      'SELECT * FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC',
      [params.id]
    );

    return NextResponse.json(
      { notes },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
