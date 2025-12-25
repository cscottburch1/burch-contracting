import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  response.cookies.set('admin_session', '', { maxAge: 0 });
  return redirect('/admin');
}
