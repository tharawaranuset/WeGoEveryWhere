import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt");
  const { pathname } = req.nextUrl;

  // Allow access to login, Next.js assets, and favicon
  const publicPaths = [ "/_next", 
    "/favicon.ico",
    "/api",
    "/images",
    "/icons",
    "/register", //page
    "/login"
  ];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}