import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Note: Can't import from '@/lib/db/schema' directly in edge runtime if it uses unsupported node APIs.
// We'll hardcode the variants here to be safe for Edge middleware.
const VARIANTS = ['A', 'B', 'C'] as const
type Variant = typeof VARIANTS[number]

export function middleware(request: NextRequest) {
  const res = NextResponse.next()
  
  // 1. Check for forced variant override
  const forced = request.nextUrl.searchParams.get('__variant') as Variant | null
  if (forced && VARIANTS.includes(forced)) {
    res.cookies.set('variant', forced, { maxAge: 60 * 60 * 24 * 30, httpOnly: true })
    return res
  }

  // 2. Assign random variant if none exists
  if (!request.cookies.get('variant')) {
    // Starting with MVP: A and C only
    const ACTIVE_VARIANTS: Variant[] = ['A', 'C']
    const v = ACTIVE_VARIANTS[Math.floor(Math.random() * ACTIVE_VARIANTS.length)]
    res.cookies.set('variant', v, { maxAge: 60 * 60 * 24 * 30, httpOnly: true })
  }
  
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
