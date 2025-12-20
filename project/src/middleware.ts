// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Use a secure environment variable for the password
const PASSWORD = process.env.CRM_PASSWORD;
const USERNAME = 'scott@burchcontracting.com';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/crm')) {
    // Return 401 immediately if the password env var isn't set (local dev error)
    if (!PASSWORD) {
        console.error('CRM_PASSWORD environment variable is not set!');
        return new NextResponse('Server Misconfiguration', { status: 500 });
    }

    const authorizationHeader = request.headers.get('authorization');

    if (authorizationHeader) {
      const basicAuth = authorizationHeader.split(' ')[1];
      // Use built-in Buffer for reliable decoding if not using an Edge runtime polyfill
      // In Vercel Edge Runtime, atob is fine. For broader compatibility, Buffer might be safer.
      const decoded = Buffer.from(basicAuth, 'base64').toString();
      const [user, password] = decoded.split(':');

      if (user === USERNAME && password === PASSWORD) {
        return NextResponse.next();
      }
    }

    // Prompt for credentials
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="CRM Access"',
      },
    });
  }
  
  // Allow all other routes to proceed
  return NextResponse.next();
}

// Config to apply this middleware only to paths starting with /crm/
export const config = {
  matcher: '/crm/:path*',
};

