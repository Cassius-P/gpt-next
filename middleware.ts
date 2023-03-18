
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {
    const email = req.cookies.get('email');



    if (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')) {
        return NextResponse.next()
    } 

    return NextResponse.redirect(new URL('/login', req.url))

    
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/','/:path*'],
}