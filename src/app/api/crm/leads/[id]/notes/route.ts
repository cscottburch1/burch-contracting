import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: notes, error } = await supabase
      .from('lead_notes')
      .select('*')
      .eq('lead_id', params.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notes' },
        { status: 500 }
      );
    }

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
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: note, error } = await supabase
      .from('lead_notes')
      .insert([
        {
          lead_id: params.id,
          content: body.content,
          note_type: body.note_type || 'general',
          is_important: body.is_important || false,
          created_by: body.created_by || 'System'
        }
      ])
      .select()
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
