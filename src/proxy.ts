import { NextRequest, NextResponse } from 'next/server'
import type { AbVariant as Variant } from '@/lib/db/schema'

const VARIANTS: Variant[] = ['A', 'B', 'C']

export function proxy(request: NextRequest) {
  const res = NextResponse.next()

  const forced = request.nextUrl.searchParams.get('__variant') as Variant | null
  if (forced && (VARIANTS as string[]).includes(forced)) {
    const url = request.nextUrl.clone()
    url.searchParams.delete('__variant')
    const redirect = NextResponse.redirect(url)
    redirect.cookies.set('variant', forced, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      path: '/',
    })
    return redirect
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
     * - og (static OG images)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - all files with extensions (e.g. .png, .jpg)
     */
    '/((?!api|_next/static|_next/image|og|favicon.ico|sitemap.xml|robots.txt|.*\\.[\\w]+$).*)',
  ],
}
