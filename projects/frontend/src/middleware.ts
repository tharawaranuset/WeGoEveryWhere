import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthService } from "./lib/api";

export function middleware(req: NextRequest) {
  const refresh_jwt = req.cookies.get("refresh_jwt");

  // TODO
  if(!req.cookies.get("jwt") && refresh_jwt){
    AuthService.authControllerRefreshJwtToken();
  }
  const access_token = req.cookies.get("jwt");
  const { pathname } = req.nextUrl;

  // ยกเว้นไฟล์ระบบและ public assets
  const isPublicAsset =
    pathname.startsWith("/_next") ||  // CSS, JS, images
    pathname.startsWith("/favicon.ico");

  // if(pathname === "/login" && access_token){
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
  // ถ้าไม่ใช่ public asset และไม่ใช่ /login และไม่มี access_token → redirect
  if (!isPublicAsset && pathname !== "/login" && !access_token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// หรือใช้ matcher เพื่อกรอง route เฉพาะ
export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
