import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/lookup") {
    const zip = request.nextUrl.searchParams.get("zip")?.trim() ?? "";
    if (/^\d{5}$/.test(zip)) {
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.pathname = `/lookup/${zip}`;
      cleanUrl.search = "";
      return NextResponse.redirect(cleanUrl, 308);
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = { matcher: ["/lookup/:path*"] };
