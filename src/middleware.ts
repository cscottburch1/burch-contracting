import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, getAdminSessionFromRequestCookie } from '@/lib/adminAuth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin pages except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value || null;
    const session = getAdminSessionFromRequestCookie(cookie);

    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
