import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
  //return NextResponse.redirect(new URL('/dashboard', request.url))
  const { pathname } = request.nextUrl
  const channelId = pathname.split("/")[pathname.split("/").length - 1]
 
  const response = NextResponse.next()
  response.cookies.set('channel-id', channelId)
  return response
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard/channels/:path*',
}