import { NextRequest, NextResponse } from 'next/server'

type Variant = 'A' | 'B' | 'C'
const VARIANTS: Variant[] = ['A', 'B', 'C']

export function proxy(request: NextRequest) {
  const res = NextResponse.next()

  const forced = request.nextUrl.searchParams.get('__variant') as Variant | null
  if (forced && (VARIANTS as string[]).includes(forced)) {
    res.cookies.set('variant', forced, {
      maxAge: 60 * 60,
      httpOnly: true,
      path: '/',
    })
    return res
  }

  if (!request.cookies.get('variant')) {
    const v = VARIANTS[Math.floor(Math.random() * VARIANTS.length)]
    res.cookies.set('variant', v, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      path: '/',
    })
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
