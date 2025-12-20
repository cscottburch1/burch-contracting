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
    if (body.estimated_value !== undefined) {
      updates.push('estimated_value = ?');
      values.push(body.estimated_value);
    }
    if (body.scheduled_date !== undefined) {
      updates.push('scheduled_date = ?');
      values.push(body.scheduled_date);
    }
    if (body.last_contact_date !== undefined) {
      updates.push('last_contact_date = ?');
      values.push(body.last_contact_date);
    }
    if (body.tags !== undefined) {
      updates.push('tags = ?');
      values.push(JSON.stringify(body.tags));
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(params.id);

    const sql = `UPDATE contact_leads SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);

    const lead = await queryOne(
      'SELECT * FROM contact_leads WHERE id = ?',
      [params.id]
    );

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
