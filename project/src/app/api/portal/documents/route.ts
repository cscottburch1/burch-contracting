import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(request: Request) {
  try {
    const { portalUserId, accessCode } = await request.json();

    if (!portalUserId || !accessCode) {
      return NextResponse.json({ error: 'portalUserId and accessCode are required.' }, { status: 400 });
    }

    const userCheck = await query(
      'SELECT id FROM portal_users WHERE id = ? AND access_code = ? AND status = "active" LIMIT 1',
      [portalUserId, accessCode]
    );

    if (!Array.isArray(userCheck) || userCheck.length === 0) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const docs = await query(
      'SELECT id, title, url, created_at FROM portal_documents WHERE portal_user_id = ? ORDER BY created_at DESC',
      [portalUserId]
    );

    return NextResponse.json({ documents: docs });
  } catch (error) {
    console.error('Portal documents error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
