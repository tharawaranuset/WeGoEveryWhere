import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AppService, AuthService } from "./lib/api";

export function middleware(req: NextRequest) {
  // TODO
  const access_token = req.cookies.get("jwt");
  console.log(access_token);
  if(access_token){
    const payload = JSON.parse(atob(access_token!.value?.split('.')[1]));
    console.log(payload);
  }
  
  
  const { pathname } = req.nextUrl;

  // ยกเว้นไฟล์ระบบและ public assets
  const isPublicAsset =
    pathname.startsWith("/_next") ||  // CSS, JS, images
    pathname.startsWith("/favicon.ico");

  // if(pathname === "/login" && access_token){
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
  // ถ้าไม่ใช่ public asset และไม่ใช่ /login และไม่มี access_token → redirect
  if (!isPublicAsset && (pathname !== "/login" && pathname !== "/register") && !access_token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// หรือใช้ matcher เพื่อกรอง route เฉพาะ
export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
