import { NextResponse } from 'next/server';
import { auth } from './auth';

export default auth(async function middleware(request) {
  const session = request.auth;
  const pathname = request.nextUrl.pathname;
  const isProctedRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname === '/register' || pathname === '/login';
  if (!session && isProctedRoute) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  } else if (session && isAuthRoute)
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  else {
    return NextResponse.next();
  }
});
