import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('builder_token')?.value
  const { pathname } = request.nextUrl

  // Define unprotected routes
  const isPublicRoute = pathname === '/'

  // 1. If it's a public route and user has no token, let them through
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // 2. If it's NOT a public route and user has no token, redirect to landing
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 3. User is authenticated, let them through
  return NextResponse.next()
}

// Config to specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
