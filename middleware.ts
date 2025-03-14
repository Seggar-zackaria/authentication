import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export default NextAuth(authConfig).auth;


export async function middleware(request: NextRequest) {
 
  const response = NextResponse.next()
  response.headers.set('Cache-Control', 's-maxage=60')
  
  return response
}
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  runtime: 'nodejs'
};
