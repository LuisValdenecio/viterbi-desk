import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {

  const { pathname } = request.nextUrl

  //if (pathname.startsWith('/api/gmail-oauth-flow')) {
  //  const response = NextResponse.next()
  //  response.cookies.set('delete-scope')
  //}
 
  //const response = NextResponse.next()
  //response.cookies.set('channel-id', channelId)
  //return response
}
 
// See "Matching Paths" below to learn more
export const config = {
  //matcher: '/dashboard/channels/:path*',
}