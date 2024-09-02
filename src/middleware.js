import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
  console.log("IS AUTHORIZED? ", request.auth)
  if (false)
    return NextResponse.redirect(new URL('/signin', request.url))
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard/:path*',
}