import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth'
import { Permission } from "@/lib/types/permissions";

export default NextAuth(authConfig).auth;

const protectedRoutes = {
  '/admin': [Permission.MANAGE_INVENTORY],
  '/bookings/manage': [Permission.MANAGE_INVENTORY],
} as const

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await auth()

  const userRole = session?.user?.role

  if (userRole) {
    request.cookies.set('user_permission', userRole.toString())
  }
  const userPermissions = request.cookies.get('user_permissions')?.value
  
  const requiredPermissions = Object.entries(protectedRoutes).find(([route]) => 
    pathname.startsWith(route)
  )?.[1]

  if (requiredPermissions) {
    if (!userPermissions) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const hasAccess = requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    )

    if (!hasAccess) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  const response = NextResponse.next()
  response.headers.set('Cache-Control', 's-maxage=60')
  
  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/bookings/manage/:path*',
  ],
  runtime: 'nodejs'
};
