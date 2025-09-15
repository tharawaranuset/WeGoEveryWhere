import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt");
  const { pathname } = req.nextUrl;

  // ยกเว้นไฟล์ระบบและ public assets
  const isPublicAsset =
    pathname.startsWith("/_next") ||  // CSS, JS, images
    pathname.startsWith("/favicon.ico");

  // ถ้าไม่ใช่ public asset และไม่ใช่ /login และไม่มี token → redirect
  if (!isPublicAsset && pathname !== "/login" && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// หรือใช้ matcher เพื่อกรอง route เฉพาะ
export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
