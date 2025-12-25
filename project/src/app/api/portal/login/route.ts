import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/mysql';

export async function POST(request: Request) {
  try {
    const { email, accessCode } = await request.json();

    if (!email || !accessCode) {
      return NextResponse.json({ error: 'Email and access code are required.' }, { status: 400 });
    }

    const user = await queryOne(
      'SELECT id FROM portal_users WHERE email = ? AND access_code = ? AND status = "active"',
      [email, accessCode]
    );

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or access code.' }, { status: 401 });
    }

    return NextResponse.json({ portalUserId: (user as any).id });
  } catch (error) {
    console.error('Portal login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
