import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Call localhost:8000/ping to keep container alive
  try {
    await fetch('http://localhost:8000/ping', {
      method: 'GET',
      // Add a timeout to prevent hanging
      signal: AbortSignal.timeout(5000)
    })
  } catch (error) {
    // Log error but don't block the request
    console.warn('Failed to ping localhost:8000/ping:', error)
  }

  // Continue with the request normally
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  // Run on all paths except static files and API routes that don't need it
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 