import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { setAdminSessionCookie } from '@/lib/adminAuth';

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || '').trim();
    const password = String(body?.password || '');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ error: 'Admin auth not configured on server' }, { status: 500 });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    if (!safeEqual(email, adminEmail) || !safeEqual(password, adminPassword)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    setAdminSessionCookie();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error('Admin login error:', e);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
