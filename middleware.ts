import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth'
import { Permission } from "@/lib/types/permissions";

export default NextAuth(authConfig).auth;

// Define protected routes and their required permissions
const protectedRoutes = {
  '/admin': [Permission.MANAGE_INVENTORY],
  '/bookings/manage': [Permission.MANAGE_INVENTORY],
  // Add more routes and their required permissions
} as const

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await auth()

  const userRole = session?.user?.role

  if (userRole) {
    request.cookies.set('user_permission', userRole.toString())
  }
  // Get user permissions from session/token
  // This depends on how you store user data - adjust accordingly
  const userPermissions = request.cookies.get('user_permissions')?.value
  
  // Check if the current path is protected
  const requiredPermissions = Object.entries(protectedRoutes).find(([route]) => 
    pathname.startsWith(route)
  )?.[1]

  if (requiredPermissions) {
    // If route is protected but no permissions, redirect to login
    if (!userPermissions) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check if user has required permissions
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
    // Add more protected path patterns
  ],
  runtime: 'nodejs'
};
