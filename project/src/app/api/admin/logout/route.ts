import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function POST() {
  const response = NextResponse.redirect(new URL('/admin', 'https://burchcontracting.com'));
  response.cookies.delete('admin_session');
  return response;
}1~nano project/src/app/api/admin/logout/route.ts
