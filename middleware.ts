import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth';
import { Permission } from "@/lib/types/permissions";

export default NextAuth(authConfig).auth;

const protectedRoutes = {
  '/admin': [Permission.MANAGE_INVENTORY],
  '/bookings/manage': [Permission.MANAGE_INVENTORY],
} as const;

const authRoutes = ['/login', '/signup'];

const getPermissionsForRole = (role: string): Permission[] => {
  const rolePermissions: Record<string, Permission[]> = {
    admin: [Permission.MANAGE_INVENTORY],
    user: [],
  };
  return rolePermissions[role] || [];
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();

  // Redirect authenticated users from auth routes
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (session?.user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Check protected routes
  const requiredPermissions = Object.entries(protectedRoutes).find(
    ([route]) => pathname.startsWith(route)
  )?.[1];

  if (!requiredPermissions) {
    return NextResponse.next();
  }

  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const userPermissions = getPermissionsForRole(session.user.role);
  const hasAccess = requiredPermissions.every(permission =>
    userPermissions.includes(permission)
  );

  if (!hasAccess) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/bookings/manage/:path*',
    '/login',
    '/signup',
  ],
  runtime: 'nodejs'
};