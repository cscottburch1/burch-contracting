import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

type Params = { id: string };

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(
  _request: Request,
  { params }: { params: Params }
) {
  const id = params?.id;
  if (!id) return jsonError('Missing lead id', 400);

  try {
    const rows: any = await query(
      `SELECT *
       FROM contact_leads
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    const lead = Array.isArray(rows) ? rows[0] : null;
    if (!lead) return jsonError('Lead not found', 404);

    return NextResponse.json({ lead }, { status: 200 });
  } catch (err) {
    console.error('MySQL error fetching lead:', err);
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Params }
) {
  const id = params?.id;
  if (!id) return jsonError('Missing lead id', 400);

  try {
    const body = await request.json();

    // Allow only these fields to be updated (safe whitelist)
    const allowedFields = new Set([
      'first_name',
      'last_name',
      'email',
      'phone',
      'address',
      'city',
      'state',
      'zip',
      'project_type',
      'project_description',
      'status',
      'source',
      'budget',
      'preferred_contact_method',
      'preferred_contact_time',
    ]);

    const updates: Record<string, any> = {};
    for (const [key, value] of Object.entries(body || {})) {
      if (allowedFields.has(key)) {
        updates[key] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return jsonError('No valid fields to update', 400);
    }

    // Build parameterized SQL
    const setClauses: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(updates)) {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }

    // always update updated_at if your table has it
    // If your table doesn't have updated_at, remove the next 2 lines
    setClauses.push(`updated_at = NOW()`);

    values.push(id);

    const sql = `UPDATE contact_leads SET ${setClauses.join(', ')} WHERE id = ?`;
    const result: any = await query(sql, values);

    // If nothing updated, it might be invalid id
    const affected =
      result?.affectedRows ?? result?.[0]?.affectedRows ?? 0;

    if (!affected) return jsonError('Lead not found', 404);

    // Return updated row
    const rows: any = await query(
      `SELECT *
       FROM contact_leads
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    const lead = Array.isArray(rows) ? rows[0] : null;

    return NextResponse.json({ lead }, { status: 200 });
  } catch (err) {
    console.error('MySQL error updating lead:', err);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

