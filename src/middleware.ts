import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("gearup_token")?.value;
  const role = request.cookies.get("gearup_role")?.value;

  if (pathname.startsWith("/dashboard/customer")) {
    if (!token) {
      return NextResponse.redirect(new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}`, request.url));
    }
  }

  if (pathname.startsWith("/dashboard/provider")) {
    if (!token) {
      return NextResponse.redirect(new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}`, request.url));
    }
    if (role !== "provider" && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/customer", request.url));
    }
  }

  if (pathname.startsWith("/dashboard/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}`, request.url));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/customer", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
