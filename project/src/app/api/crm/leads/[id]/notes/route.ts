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
  const leadId = params?.id;

  if (!leadId) return jsonError('Missing lead id', 400);

  try {
    // Return newest first
    const rows = await query(
      `SELECT 
         id,
         lead_id,
         content,
         note_type,
         is_important,
         created_by,
         created_at
       FROM lead_notes
       WHERE lead_id = ?
       ORDER BY created_at DESC`,
      [leadId]
    );

    return NextResponse.json({ notes: rows }, { status: 200 });
  } catch (err) {
    console.error('MySQL error fetching lead notes:', err);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Params }
) {
  const leadId = params?.id;

  if (!leadId) return jsonError('Missing lead id', 400);

  try {
    const body = await request.json();

    const content =
      typeof body?.content === 'string' ? body.content.trim() : '';
    const noteType =
      typeof body?.note_type === 'string' && body.note_type.trim()
        ? body.note_type.trim()
        : 'general';
    const isImportant = Boolean(body?.is_important);
    const createdBy =
      typeof body?.created_by === 'string' && body.created_by.trim()
        ? body.created_by.trim()
        : 'System';

    if (!content) return jsonError('content is required', 400);

    // Insert the note
    const insertResult: any = await query(
      `INSERT INTO lead_notes (lead_id, content, note_type, is_important, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [leadId, content, noteType, isImportant, createdBy]
    );

    // Best-effort: log activity (do not fail note creation if activity insert fails)
    try {
      await query(
        `INSERT INTO lead_activities (lead_id, activity_type, description, created_by, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [leadId, 'note_added', 'New note added to lead', createdBy]
      );
    } catch (activityErr) {
      console.error('MySQL warning: failed to insert lead activity:', activityErr);
    }

    // Fetch created note (safer than relying on driver-specific return shape)
    const insertedId =
      insertResult?.insertId ??
      insertResult?.[0]?.insertId ??
      null;

    let createdNote: any = null;
    if (insertedId) {
      const rows: any = await query(
        `SELECT 
           id,
           lead_id,
           content,
           note_type,
           is_important,
           created_by,
           created_at
         FROM lead_notes
         WHERE id = ?
         LIMIT 1`,
        [insertedId]
      );
      createdNote = Array.isArray(rows) ? rows[0] : null;
    }

    return NextResponse.json(
      { success: true, note: createdNote, id: insertedId },
      { status: 201 }
    );
  } catch (err) {
    console.error('MySQL error creating lead note:', err);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}

