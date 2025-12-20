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

    await query(
      `INSERT INTO lead_notes (lead_id, content, note_type, is_important, created_by, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [params.id, body.content, body.note_type || 'general', body.is_important || false, body.created_by || 'System']
    );
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create note' },
        { status: 500 }
      );
    }

    await supabase
      .from('lead_activities')
      .insert([
        {
          lead_id: params.id,
          activity_type: 'note_added',
          description: 'New note added to lead',
          created_by: body.created_by || 'System'
        }
      ]);

    return NextResponse.json(
      { note },
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
