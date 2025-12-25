import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect(new URL('/admin', 'https://burchcontracting.com'));
  response.cookies.delete('admin_session');
  return response;
}

