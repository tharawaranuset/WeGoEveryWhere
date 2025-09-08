import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // หรือ session อะไรก็ได้
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/profile") && !token) {
    // ถ้าเข้า /profile แต่ยังไม่ login → redirect ไป /login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
