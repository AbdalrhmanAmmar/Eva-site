import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const adminPaths = ["/admin", "/admin/products"]; // عدل حسب صفحات الادمن
  const isAdminPage = adminPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // لو مفيش توكن → رجعه للّوجن
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Decode token to check role (لو عايز تحقق من الدور)
  const payload = JSON.parse(atob(token.split(".")[1]));

  if (isAdminPage && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url)); // ممنوع غير الادمن
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/checkout", "/profile"], // صفحات محمية
};
