import { NextRequest, NextResponse } from 'next/server'
import type { AbVariant as Variant } from '@/lib/db/schema'

const VARIANTS: Variant[] = ['A', 'B', 'C']

export function proxy(request: NextRequest) {
  const res = NextResponse.next()

  const forced = request.nextUrl.searchParams.get('__variant') as Variant | null
  if (forced && (VARIANTS as string[]).includes(forced)) {
    res.cookies.set('variant', forced, {
      maxAge: 60 * 60 * 24 * 30, // Override keeps it for a while too to test
      httpOnly: true,
      path: '/',
    })
    return res
  }

  if (!request.cookies.get('variant')) {
    // Starting with MVP: A and C only
    const ACTIVE_VARIANTS: Variant[] = ['A', 'C']
    const v = ACTIVE_VARIANTS[Math.floor(Math.random() * ACTIVE_VARIANTS.length)]
    res.cookies.set('variant', v, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      path: '/',
    })
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
