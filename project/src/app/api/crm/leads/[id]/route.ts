import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/mysql';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lead = await queryOne(
      'SELECT * FROM contact_leads WHERE id = ?',
      [params.id]
    );

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { lead },
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const updateData: any = {};
    const updates: string[] = [];
    const values: any[] = [];

    if (body.status !== undefined) {
      updates.push('status = ?');
      values.push(body.status);
    }
    if (body.priority !== undefined) {
      updates.push('priority = ?');
      values.push(body.priority);
    }
    if (body.assigned_to !== undefined) {
      updates.push('assigned_to = ?');
      values.push(body.assigned_to);
    }
    if (body.estimated_value !== undefined) updateData.estimated_value = body.estimated_value;
    if (body.scheduled_date !== undefined) updateData.scheduled_date = body.scheduled_date;
    if (body.last_contact_date !== undefined) updateData.last_contact_date = body.last_contact_date;
    if (body.tags !== undefined) updateData.tags = body.tags;

    updateData.updated_at = new Date().toISOString();

    const { data: lead, error } = await supabase
      .from('contact_leads')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update lead' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { lead },
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
