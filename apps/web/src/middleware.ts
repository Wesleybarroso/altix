// middleware to redirect root to landing page
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/' || pathname === '') {
    const url = request.nextUrl.clone();
    url.pathname = '/landing';
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
